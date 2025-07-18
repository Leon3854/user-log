var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import knex from "../../database/knex.js";
import { cacheUser, invalidateUserCache, redisCache } from "../../lib/redis.js";
export class UserService {
    async getById(id) {
        return knex("users").where({ id }).first();
    }
    async create(userData) {
        if (!userData.email || !userData.username) {
            throw new Error("Email and username are required");
        }
        const [user] = await knex("users").insert(userData).returning("*");
        await cacheUser(user);
        return user;
    }
    async update(id, userData) {
        const [user] = await knex("users")
            .where({ id })
            .update(userData)
            .returning("*");
        await cacheUser(user);
        return user;
    }
    async delete(id) {
        await knex("users").where({ id }).delete();
        await invalidateUserCache(id);
    }
    async getAll() {
        return knex("users").select();
    }
}
__decorate([
    redisCache((id) => `user:${id}`, 3600),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getById", null);
__decorate([
    redisCache(() => "users:all", 1800),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getAll", null);
export const userService = new UserService();
