exports.up = knex => knex.schema.createTable("orders", table => {
    table.increments("id");
    table.integer("user_id").references("id").inTable("users");
    table.string("status");
    table.decimal("total_price", 10, 2);
    table.text("observations");
    table.timestamp("created_at");
    table.timestamp("updated_at");
});

exports.down = knex => knex.schema.dropTable("orders");
