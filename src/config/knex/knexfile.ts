import type { Knex } from "knex";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
  },
  migrations: {
    directory: path.join(__dirname, "../../database/migrations"),
    extension: "ts",
  },
  seeds: {
    directory: path.join(__dirname, "../../database/seeds"),
    extension: "ts",
  },
};

export default config;
