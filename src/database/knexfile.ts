import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "postgres", // имя сервиса в Docker
      user: "youruser",
      password: "yourpassword",
      database: "yourdb",
    },
    migrations: {
      directory: "./src/database/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },
};

export default config;
