import type { Knex } from "knex";

/**
 * @param {Knex} knex - Экземпляр Knex
 * @returns {Promise<void>}
 */
export async function up(knex: Knex): Promise<void> {
  // Реализация миграции
}

/**
 * @param {Knex} knex - Экземпляр Knex
 * @returns {Promise<void>}
 */
export async function down(knex: Knex): Promise<void> {
  // Реализация отката
}
