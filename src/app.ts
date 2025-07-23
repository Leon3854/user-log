import express from "express";
import knex, { migrate, seed } from "@src/database/knex";
import "dotenv/config";
import { userController } from "./services/users-service/user.controller";
import "reflect-metadata";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get("/users/:id", userController.getById.bind(userController));
app.post("/users", userController.create.bind(userController));

// Экспортируем app для тестов
export { app };

// Функция запуска сервера
export const startServer = async () => {
  await migrate.latest();
  await seed.run();

  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

// Универсальная проверка на прямой запуск
const isMainModule = () => {
  // Для ES модулей
  if (typeof import.meta?.url === "string") {
    return import.meta.url === `file://${process.argv[1]}`;
  }
  // Для CommonJS
  return require.main === module;
};

if (isMainModule()) {
  startServer().catch(console.error);
}

// Запуск только если файл исполняется напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch(console.error);
}
