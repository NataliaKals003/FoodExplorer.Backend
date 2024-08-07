exports.up = knex => knex.schema.createTable("dish_categories", table => {
    table.increments("id");
    table.varchar("name").notNullable();
});

exports.down = kenx => knex.schema.dropTable("dish_categories");
