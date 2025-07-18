export const seedTemplate = (tableName) => ({
    seed: async (knex) => {
        await knex(tableName).del();
        await knex(tableName).insert([
            { id: 1, name: "Example 1" },
            { id: 2, name: "Example 2" },
        ]);
    },
});
