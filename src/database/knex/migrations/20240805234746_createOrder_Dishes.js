exports.up = knex => knex.schema.createTable("order_dishes", table => {
    table.increments("id");
    table.integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE");
    table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE");
    table.integer("quantity");
});

exports.down = kenx => knex.schema.dropTable("order_dishes");
