exports.up = knex => knex.schema.createTable("dishes", table => {
    table.increments("id");
    table.integer("category_id").references("id").inTable("dish_categories").onDelete("CASCADE");
    table.varchar("name").notNullable();
    table.text("description");
    table.decimal("price", 10, 2);
});

exports.down = kenx => knex.schema.dropTable("dishes");
