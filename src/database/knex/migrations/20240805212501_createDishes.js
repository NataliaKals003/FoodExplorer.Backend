exports.up = knex => knex.schema.createTable("dishes", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.text("description");
    table.decimal("price", 10, 2);
    table.timestamp("created_at").default(knex.fn.now());
});

exports.down = kenx => knex.schema.dropTable("dishes");
