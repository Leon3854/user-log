import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Очищаем таблицу только в тестовом окружении
  await knex("users").del();

  // Генерируем тестовые данные
  const testUsers = [
    {
      username: "test_user_1",
      email: "test1@example.com",
      first_name: "Тест",
      last_name: "Пользователь 1",
      imei: "123456789012345",
      phone: "+79990001122",
      address: "Москва, ул. Тестовая, 1",
      company: "Тестовая компания",
      country: "Россия",
      avatar: "https://example.com/avatar1.jpg",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      username: "test_user_2",
      email: "test2@example.com",
      first_name: "Тест",
      last_name: "Пользователь 2",
      imei: "987654321098765",
      phone: "+79990003344",
      address: "Санкт-Петербург, ул. Примерная, 2",
      company: "Примерная компания",
      country: "Россия",
      avatar: "https://example.com/avatar2.jpg",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Вставляем тестовые данные
  await knex("users").insert(testUsers);
}
