import knex, { migrate, seed } from "./database/knex.js";

import "dotenv/config";
// import { migrate } from "./database/knex";

async function main() {
  await migrate.latest();
  await seed.run();
}

// Вызов основной функции с обработкой возможных ошибок
main().catch((e) => {
  // Логирование ошибки в консоль
  console.error(e);
  // Завершение процесса с кодом ошибки (1 - failure)
  process.exit(1);
});

// console.log(process.env.POSTGRES_DB); // "user-log"
// console.log(process.env.JWT_SECRET); // "eyJhbGciOiJFUzI1NiIsI"
