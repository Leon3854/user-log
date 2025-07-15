import _knex from "knex";
import knexConfig from "../config/knex/knexfile.js";

const knex = _knex(knexConfig);

export default knex;

// логируем результат выполнения миграций
function logMigrationResults(action: string, result: [number, string[]]) {
  if (result[1].length === 0) {
    console.log(
      ["latest", "up"].includes(action)
        ? "All migrations are up to date"
        : "All migrations have been rolled back"
    );
    return;
  }
  console.log(
    `Batch ${result[0]} ${
      ["latest", "up"].includes(action) ? "ran" : "rolled back"
    } the following migrations:`
  );
  for (const migration of result[1]) {
    console.log("- " + migration);
  }
}

// вывод списка завершонных и ожидаемых миграций
function logMigrationList(list: [{ name: string }[], { file: string }[]]) {
  console.log(`Found ${list[0].length} Completed Migration file/files.`);
  for (const migration of list[0]) {
    console.log("- " + migration.name);
  }
  console.log(`Found ${list[1].length} Pending Migration file/files.`);
  for (const migration of list[1]) {
    console.log("- " + migration.file);
  }
}

// Логируем выполнение сидов
function logSeedRun(result: [string[]]) {
  if (result[0].length === 0) {
    console.log("No seeds to run");
  }
  console.log(`Ran ${result[0].length} seed files`);
  for (const seed of result[0]) {
    console.log("- " + seed?.split(/\/|\\/).pop());
  }
  // Ran 5 seed files
}

// Подтвердаем создание нового сида
function logSeedMake(name: string) {
  console.log(`Created seed: ${name.split(/\/|\\/).pop()}`);
}

// управление миграциями
export const migrate = {
  // применяет все новые миграции
  latest: async () => {
    logMigrationResults("latest", await knex.migrate.latest());
  },
  // откатывает последний batch миграций
  rollback: async () => {
    logMigrationResults("rollback", await knex.migrate.rollback());
  },
  // откатыает на вообще!
  down: async (name?: string) => {
    logMigrationResults("down", await knex.migrate.down({ name }));
  },
  //
  up: async (name?: string) => {
    logMigrationResults("up", await knex.migrate.up({ name }));
  },
  // показывает список миграций
  list: async () => {
    logMigrationList(await knex.migrate.list());
  },
  // создает новую миграцию
  make: async (name: string) => {
    if (!name) {
      console.error("Please provide a migration name");
      process.exit(1);
    }
    console.log(await knex.migrate.make(name, { extension: "js" }));
  },
};

export const seed = {
  // выполняет все сиды
  run: async () => {
    logSeedRun(await knex.seed.run());
  },
  // создаем новый сид
  make: async (name: string) => {
    if (!name) {
      console.error("Please provide a seed name");
      process.exit(1);
    }
    logSeedMake(await knex.seed.make(name));
  },
};
