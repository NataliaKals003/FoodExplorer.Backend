exports.up = knex => knex.schema.createTable("orders", table => {
    table.increments("id");
    table.string("status");
    table.decimal("total_price", 10, 2);
    table.text("observations");
    table.integer("user_id").references("id").inTable("users");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updtated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("orders");
