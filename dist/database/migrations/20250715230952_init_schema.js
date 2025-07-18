export async function up(knex) {
    await knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("username").notNullable().unique();
        table.string("email").notNullable().unique();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("phone").notNullable();
        table.string("imei").unique();
        table.string("address");
        table.string("company");
        table.string("country").defaultTo("USA");
        table.string("avatar");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists("users");
}
