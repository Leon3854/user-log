import knex from "@src/database/knex";
import { UserService } from "@src/services/users-service/user.service";
import { faker } from "@faker-js/faker/locale/ru";

describe("UserService Integration", () => {
  let service: UserService;

  beforeAll(async () => {
    await knex.migrate.latest();
    service = new UserService();
  });

  afterEach(async () => {
    await knex("users").truncate();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it("should create and find user", async () => {
    // 1. Подготовка тестовых данных
    const testUserData = {
      username: faker.internet.username(),
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      imei: faker.phone.imei(),
      phone: faker.phone.number(),
      address: `${faker.location.city()}, ${faker.location.streetAddress()}`,
      company: faker.company.name(),
      country: "Россия",
      avatar: faker.image.avatarGitHub(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    // 2. Создаем пользователя через сервис
    const createdUser = await service.create(testUserData);

    // 3. Проверяем что пользователь создан и имеет ID
    expect(createdUser).toHaveProperty("id");
    expect(typeof createdUser.id).toBe("number");

    // 4. Дополнительная проверка TypeScript (если требуется)
    if (typeof createdUser.id !== "number") {
      throw new Error("User id is not a number");
    }

    // 5. Ищем пользователя по ID
    const foundUser = await service.findById(createdUser.id as number);

    // 6. Проверяем что найденный пользователь соответствует созданному
    expect(foundUser).toMatchObject({
      id: createdUser.id,
      username: testUserData.username,
      email: testUserData.email,
      first_name: testUserData.first_name,
      last_name: testUserData.last_name,
      imei: testUserData.imei,
      phone: testUserData.phone,
      address: testUserData.address,
      company: testUserData.company,
      country: testUserData.country,
      avatar: testUserData.avatar,
      created_at: testUserData.created_at,
      updated_at: testUserData.updated_at,
    });
  });

  it("should throw error when user not found", async () => {
    // Пытаемся найти несуществующего пользователя
    await expect(service.findById(999999)).rejects.toThrow("User not found");
  });
});
