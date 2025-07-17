import { faker } from "@faker-js/faker/locale/ru";
import { Knex } from "knex";
import { User } from "../types/users.interface.js";
import redis from "../../lib/redis";

export async function seed(knex: Knex): Promise<void> {
  try {
    // Проверка кеша
    const seeded = await redis.get("users:seeded");
    if (seeded) {
      console.log("Users already seeded (cached) - skipping");
      return;
    }

    // Проверка таблицы
    if (!(await knex.schema.hasTable("users"))) {
      throw new Error('Table "users" does not exist');
    }

    // Проверка данных
    if ((await knex("users").count("id").first())?.count !== "0") {
      await redis.set("users:seeded", "true", "EX", 86400);
      console.log("Users exist - marking as seeded");
      return;
    }

    // Генерация данных
    const fakeUsers = Array.from(
      { length: 10 },
      (): Omit<User, "id"> => ({
        username: faker.internet.username(), // Добавим username
        email: faker.internet.email({ provider: "example.com" }), // Единый домен
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        imei: faker.phone.imei(),
        phone: faker.phone.number({ style: "national" }), // Единый формат
        address: `${faker.location.city()}, ${faker.location.streetAddress()}`,
        company: faker.company.name(), // Более реалистичные названия
        country: "Россия", // Фиксируем страну
        avatar: faker.image.avatarGitHub(), // Более качественные аватары
        created_at: faker.date.past({ years: 1 }), // Разные даты создания
        updated_at: new Date(),
      })
    );

    // Транзакция: вставка + кеширование
    await knex.transaction(async (trx) => {
      await trx.batchInsert("users", fakeUsers, 10);

      const pipeline = redis.pipeline();
      pipeline.set("users:seeded", "true", "EX", 86400);
      pipeline.set("users:data", JSON.stringify(fakeUsers), "EX", 3600);
      await pipeline.exec();
    });

    console.log(`Inserted and cached ${fakeUsers.length} users`);
  } catch (error) {
    console.error("Seed failed:", error);
    await redis.del("users:seeded"); // Откат кеша при ошибке
    throw error; // Пробрасываем для остановки seed
  }
}
