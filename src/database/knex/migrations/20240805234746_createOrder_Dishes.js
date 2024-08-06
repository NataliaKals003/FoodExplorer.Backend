exports.up = knex => knex.schema.createTable("order_dishes", table => {
    table.increments("id");
    table.integer("quantity");
    table.integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE");
    table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE");
});

exports.down = kenx => knex.schema.dropTable("order_dishes");
