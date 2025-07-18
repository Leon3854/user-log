import { faker } from "@faker-js/faker/locale/ru";
import { Knex } from "knex";
import { User } from "../types/users.interface.js";
import { userService } from "../../services/users-service/user.service.js";
import redis from "../../lib/redis.js";

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
      { length: 20 },
      (): Omit<User, "id"> => ({
        username: faker.internet.userName(),
        email: faker.internet.email({ provider: "example.com" }),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        imei: faker.phone.imei(),
        phone: faker.phone.number({ style: "national" }),
        address: `${faker.location.city()}, ${faker.location.streetAddress()}`,
        company: faker.company.name(),
        country: "Россия",
        avatar: faker.image.avatarGitHub(),
        created_at: faker.date.past({ years: 1 }),
        updated_at: new Date(),
      })
    );

    // Используем сервис для создания пользователей
    for (const userData of fakeUsers) {
      await userService.create(userData);
    }

    // Кешируем факт выполнения сидирования
    await redis.set("users:seeded", "true", "EX", 86400);
    console.log(`Successfully seeded ${fakeUsers.length} users`);
  } catch (error) {
    console.error("Seed failed:", error);
    await redis.del("users:seeded");
    throw error;
  }
}
