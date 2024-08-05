exports.up = knex => knex.schema.createTable("favourites", table => {
    table.increments("id");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE");
});

exports.down = kenx => knex.schema.dropTable("favourites");
