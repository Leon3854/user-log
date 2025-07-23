import knex from "../src/database/knex";

beforeAll(async () => {
  console.log("=== Applying test migrations ===");
  try {
    await knex.migrate.latest();
    await knex.seed.run();
    console.log("=== Test DB ready ===");
  } catch (error) {
    console.error("Failed to setup test DB:", error);
    throw error;
  }
});

afterAll(async () => {
  console.log("=== Cleaning test DB ===");
  try {
    await knex.migrate.rollback({}, true);
    await knex.destroy();
  } catch (error) {
    console.error("Failed to clean test DB:", error);
  }
});
