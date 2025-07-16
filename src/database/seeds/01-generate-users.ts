import { faker } from "@faker-js/faker/locale/ru";
import { Knex } from "knex";
import { User } from "../types/users.interface.js";

export async function seed(knex: Knex): Promise<void> {
  // Убедимся, что таблица существует
  const hasTable = await knex.schema.hasTable("users");
  if (!hasTable) {
    console.log('Table "users" does not exist');
    return;
  }

  // Проверяем наличие данных
  const isEmpty = (await knex("users").count("id").first())?.count === "0";
  if (!isEmpty) {
    console.log("Users already exist - skipping seed");
    return;
  }

  // Генерация данных с улучшениями:
  const fakeUsers: Omit<User, "id">[] = Array.from({ length: 10 }, () => ({
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
  }));

  // Пакетная вставка с обработкой ошибок
  try {
    await knex.batchInsert("users", fakeUsers, 10); // Более эффективная вставка
    console.log(`Successfully inserted ${fakeUsers.length} fake users`);
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}
