import { userService } from "./user.service.js";
export class UserController {
    async getById(req, res) {
        try {
            const user = await userService.getById(Number(req.params.id));
            user ? res.json(user) : res.status(404).json({ error: "User not found" });
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error");
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const user = await userService.create(req.body);
            res.status(201).json(user);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error");
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const user = await userService.update(Number(req.params.id), req.body);
            res.json(user);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error");
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await userService.delete(Number(req.params.id));
            res.status(204).send();
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error");
            res.status(500).json({ error: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const users = await userService.getAll();
            res.json(users);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error");
            res.status(500).json({ error: error.message });
        }
    }
}
export const userController = new UserController();
