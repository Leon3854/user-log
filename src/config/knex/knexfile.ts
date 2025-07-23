import type { Knex } from "knex";
import path from "path";

const commonConfig: Partial<Knex.Config> = {
  client: "pg",
  migrations: {
    directory: path.join(__dirname, "../../database/migrations"),
    extension: "ts",
    disableTransactions: false,
    loadExtensions: [".ts"],
  },
  seeds: {
    directory: path.join(__dirname, "../../database/seeds"),
    extension: "ts",
    loadExtensions: [".ts"],
  },
};

const config: { [key: string]: Knex.Config } = {
  development: {
    ...commonConfig,
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
    },
    debug: true, // Логирование SQL для разработки
  },

  test: {
    ...commonConfig,
    connection: {
      host: process.env.DB_HOST || "test-db",
      user: process.env.DB_USER || "test_user",
      password: process.env.DB_PASSWORD || "test_password",
      database: process.env.DB_NAME || "test_db",
      port: parseInt(process.env.DB_PORT || "5432"),
    },
    pool: {
      min: 1,
      max: 1,
      idleTimeoutMillis: 1000,
    },
    debug: false,
    asyncStackTraces: true,
  },

  production: {
    ...commonConfig,
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
    },
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
    },
  },
};

export default config;

// import type { Knex } from "knex";
// import path from "path";

// const commonConfig = {
//   client: "pg",
//   migrations: {
//     directory: path.join(__dirname, "../../database/migrations"),
//     extension: "ts",
//     disableTransactions: false, // Явно указываем, что миграции используют транзакции
//     loadExtensions: [".ts"],
//   },
//   seeds: {
//     directory: path.join(__dirname, "../../database/seeds"),
//     extension: "ts",
//     loadExtensions: [".ts"],
//   },
// };

// const config: { [key: string]: Knex.Config } = {
//   development: {
//     ...commonConfig,
//     connection: {
//       host: process.env.POSTGRES_HOST,
//       user: process.env.POSTGRES_USER,
//       password: process.env.POSTGRES_PASSWORD,
//       database: process.env.POSTGRES_DB,
//       port: parseInt(process.env.POSTGRES_PORT || "5432"),
//     },
//   },

//   test: {
//     ...commonConfig,
//     connection: {
//       host: process.env.DB_HOST || "test-db",
//       user: process.env.DB_USER || "test_user",
//       password: process.env.DB_PASSWORD || "test_password",
//       database: process.env.DB_NAME || "test_db",
//       port: parseInt(process.env.DB_PORT || "5432"),
//     },
//     pool: {
//       min: 1,
//       max: 1, // Важно для тестов - ограничиваем соединение
//       idleTimeoutMillis: 1000, // Быстрое освобождение соединения
//     },
//     debug: false, // Отключаем логирование SQL в тестах
//     asyncStackTraces: true, // Полезно для отладки
//   },

//   production: {
//     ...commonConfig,
//     connection: {
//       host: process.env.POSTGRES_HOST,
//       user: process.env.POSTGRES_USER,
//       password: process.env.POSTGRES_PASSWORD,
//       database: process.env.POSTGRES_DB,
//       port: parseInt(process.env.POSTGRES_PORT || "5432"),
//     },
//     pool: {
//       min: 2,
//       max: 10,
//     },
//   },
// };

// export default config;

// import type { Knex } from "knex";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const config: Knex.Config = {
//   client: "pg",
//   connection: {
//     host: process.env.POSTGRES_HOST,
//     user: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASSWORD,
//     database: process.env.POSTGRES_DB,
//     port: parseInt(process.env.POSTGRES_PORT || "5432"),
//   },
//   migrations: {
//     directory: path.join(__dirname, "../../database/migrations"),
//     extension: "ts",
//   },
//   seeds: {
//     directory: path.join(__dirname, "../../database/seeds"),
//     extension: "ts",
//     loadExtensions: [".ts"],
//   },
// };

// export default config;
