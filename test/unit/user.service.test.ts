import { UserService } from "@src/services/users-service/user.service";
import { cacheUser } from "@src/lib/redis";

const mockKnex = () => ({
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  returning: jest.fn().mockResolvedValue([mockUser]),
});

const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  first_name: "Test",
  last_name: "User",
  imei: "123456789012345",
  phone: "+1234567890",
  address: "Test City, Test Street",
  company: "Test Company",
  country: "Россия",
  avatar: "https://example.com/avatar.jpg",
  created_at: new Date(),
  updated_at: new Date(),
};

// Мокируем Knex и Redis
jest.mock("../../database/knex", () => ({
  __esModule: true,
  default: jest.fn(() => mockKnex()),
}));

jest.mock("../../lib/redis", () => ({
  cacheUser: jest.fn(),
  invalidateUserCache: jest.fn(),
  redisCache: jest.fn(
    () => (target: any, key: string, descriptor: PropertyDescriptor) =>
      descriptor
  ),
}));

describe("UserService", () => {
  let service: UserService;
  let knexInstance: ReturnType<typeof mockKnex>;

  beforeEach(() => {
    // Создаем новый экземпляр мока Knex для каждого теста
    knexInstance = mockKnex();
    (require("../../database/knex").default as jest.Mock).mockReturnValue(
      knexInstance
    );

    service = new UserService();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create user with required fields", async () => {
      knexInstance.first.mockResolvedValue(mockUser);

      const userData = {
        username: "testuser",
        email: "test@example.com",
        first_name: "Test",
      };

      const result = await service.create(userData);

      expect(result).toEqual(mockUser);
      expect(knexInstance.insert).toHaveBeenCalled();
      expect(knexInstance.returning).toHaveBeenCalledWith("*");
      expect(cacheUser).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("findById", () => {
    it("should return user when exists", async () => {
      knexInstance.first.mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(result).toEqual(mockUser);
      expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
      expect(knexInstance.first).toHaveBeenCalled();
      expect(cacheUser).toHaveBeenCalledWith(mockUser);
    });

    it("should throw error when user not found", async () => {
      knexInstance.first.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow("User not found");
    });
  });

  describe("update", () => {
    it("should update user", async () => {
      knexInstance.first.mockResolvedValue(mockUser);

      const updateData = { first_name: "Updated" };
      await service.update(1, updateData);

      expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
      expect(knexInstance.update).toHaveBeenCalledWith(updateData);
      expect(cacheUser).toHaveBeenCalled();
    });
  });

  describe("getAll", () => {
    it("should return all users", async () => {
      knexInstance.select.mockResolvedValue([mockUser]);

      const result = await service.getAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe("delete", () => {
    it("should delete user and invalidate cache", async () => {
      // Настройка моков
      knexInstance.where.mockReturnThis();
      knexInstance.delete.mockResolvedValue(1); // 1 - количество удаленных строк

      // Вызов метода
      await service.delete(1);

      // Проверки
      expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
      expect(knexInstance.delete).toHaveBeenCalled();

      const { invalidateUserCache } = require("../../lib/redis");
      expect(invalidateUserCache).toHaveBeenCalledWith(1);
    });

    it("should throw error when user not found", async () => {
      knexInstance.delete.mockResolvedValue(0); // 0 - ничего не удалено

      await expect(service.delete(1)).rejects.toThrow("User not found");
    });

    it("should handle cache invalidation error gracefully", async () => {
      knexInstance.delete.mockResolvedValue(1);
      const { invalidateUserCache } = require("../../lib/redis");
      invalidateUserCache.mockRejectedValue(new Error("Cache error"));

      await expect(service.delete(1)).resolves.not.toThrow();
    });
  });
});
