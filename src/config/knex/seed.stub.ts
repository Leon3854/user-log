/**
 * этот файл помогает автоматически заполнить таблицу table_name нужными данными, например, при разработке или тестировании.
 */
import type { Knex } from "knex";

export const seedTemplate = (tableName: string) => ({
  seed: async (knex: Knex) => {
    await knex(tableName).del();
    await knex(tableName).insert([
      { id: 1, name: "Example 1" },
      { id: 2, name: "Example 2" },
    ]);
  },
});
