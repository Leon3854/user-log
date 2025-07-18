import knex from "../../database/knex.js";
import { User } from "../../database/types/users.interface.js";
import { cacheUser, invalidateUserCache, redisCache } from "../../lib/redis.js";
export class UserService {
  @redisCache((id: number) => `user:${id}`, 3600)
  async getById(id: number): Promise<User | null> {
    return knex("users").where({ id }).first();
  }

  async create(userData: Omit<User, "id">): Promise<User> {
    if (!userData.email || !userData.username) {
      throw new Error("Email and username are required");
    }
    const [user] = await knex("users").insert(userData).returning("*");
    await cacheUser(user);
    return user;
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    const [user] = await knex("users")
      .where({ id })
      .update(userData)
      .returning("*");
    await cacheUser(user);
    return user;
  }

  async delete(id: number): Promise<void> {
    await knex("users").where({ id }).delete();
    await invalidateUserCache(id);
  }

  @redisCache(() => "users:all", 1800)
  async getAll(): Promise<User[]> {
    return knex("users").select();
  }
}

export const userService = new UserService();
