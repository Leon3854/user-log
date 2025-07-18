import path, { dirname } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";
config();
// Получаем __dirname аналог для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
// Универсальные пути относительно корня проекта
// const MIGRATIONS_DIR = path.join(__dirname, "../../database/migrations");
// const SEEDS_DIR = path.join(__dirname, "../../database/seeds");
const MIGRATIONS_DIR = path.join(__dirname, "../database/migrations");
const SEEDS_DIR = path.join(__dirname, "../database/seeds");
const knexConfig = {
    development: {
        client: "pg",
        connection: {
            host: process.env.POSTGRES_HOST || "localhost",
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB || "postgres",
            port: Number(process.env.POSTGRES_PORT) || 5432,
        },
        pool: { min: 2, max: 10 },
        migrations: {
            directory: MIGRATIONS_DIR,
            extension: "ts",
        },
        seeds: {
            directory: SEEDS_DIR,
            extension: "ts",
        },
    },
    production: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        pool: { min: 2, max: 10 },
        migrations: {
            directory: MIGRATIONS_DIR,
            extension: "ts",
        },
        seeds: {
            directory: SEEDS_DIR,
            extension: "ts",
        },
    },
};
const getCurrentEnvironment = () => {
    return process.env.NODE_ENV === "production" ? "production" : "development";
};
export default knexConfig[getCurrentEnvironment()];
