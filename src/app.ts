import express from "express";
import knex, { migrate, seed } from "./database/knex.js";
import "dotenv/config";
import { userController } from "./services/users-service/user.controller.js";

async function main() {
  // Инициализация Express приложения
  const app = express();
  const port = process.env.PORT || 3000;

  // Middleware для обработки JSON
  app.use(express.json());

  // Маршруты
  app.get("/users/:id", userController.getById.bind(userController));
  app.post("/users", userController.create.bind(userController));

  // Запуск миграций и сидов
  await migrate.latest();
  await seed.run();

  // Запуск сервера
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Вызов основной функции с обработкой возможных ошибок
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
