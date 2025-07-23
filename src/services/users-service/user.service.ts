import knex from "@src/database/knex";
import { User } from "@src/database/types/users.interface";
import { cacheUser, invalidateUserCache, redisCache } from "../../lib/redis";
export class UserService {
  @redisCache((id: number) => `user:${id}`, 3600)
  async getById(id: number): Promise<User | null> {
    return knex("users").where({ id }).first();
  }

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.email || !userData.username) {
      throw new Error("Email and username are required");
    }
    const [user] = await knex("users")
      .insert({
        username: userData.username,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email,
        imei: userData.imei || "",
        phone: userData.phone || "",
        address: userData.address || "",
        company: userData.company || "",
        country: userData.country || "",
        avatar: userData.avatar || "",
        create: userData.created_at,
        update: userData.updated_at,
      })
      .returning("*");
    await cacheUser(user);
    return user;
  }

  async findById(id: number): Promise<User> {
    if (!id) {
      throw new Error("Id not found");
    }
    const user = await knex("users").where({ id }).first();
    if (!user) {
      throw new Error("User not found");
    }
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
