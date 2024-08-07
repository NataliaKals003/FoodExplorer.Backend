exports.up = knex => knex.schema.createTable("ingredients", table => {
    table.integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE");
    table.varchar("name").notNullable();
});

exports.down = kenx => knex.schema.dropTable("ingredients");
