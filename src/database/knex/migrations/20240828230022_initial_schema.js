exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments("id");
      table.text("name").notNullable();
      table.text("email").notNullable();
      table.text("password").notNullable();
      table
        .enum("role", ["admin", "customer"], {
          useNative: true,
          enumName: "roles",
        })
        .notNullable()
        .default("customer");

      table.timestamp("created_at").default(knex.fn.now());
      table.timestamp("updated_at").default(knex.fn.now());
    })
    .createTable("dishes", function (table) {
      table.increments("id");
      table
        .integer("category_id")
        .references("id")
        .inTable("dish_categories")
        .onDelete("CASCADE");
      table.varchar("name").notNullable();
      table.text("description");
      table.varchar("dish_image");
      table.decimal("price", 10, 2);
      table.timestamp("created_at");
      table.timestamp("updated_at");
    })
    .createTable("ingredients", function (table) {
      table
        .integer("dish_id")
        .references("id")
        .inTable("dishes")
        .onDelete("CASCADE");
      table.varchar("name").notNullable();
    })
    .createTable("favourites", function (table) {
      table
        .integer("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("dish_id")
        .references("id")
        .inTable("dishes")
        .onDelete("CASCADE");
    })
    .createTable("dish_categories", function (table) {
      table.increments("id");
      table.varchar("name").notNullable();
    })
    .createTable("create_order", function (table) {
      table.increments("id");
      table
        .integer("dish_id")
        .references("id")
        .inTable("dishes")
        .onDelete("CASCADE");
      table
        .integer("order_id")
        .references("id")
        .inTable("orders")
        .onDelete("CASCADE");
      table.integer("quantity");
    })
    .createTable("orders", function (table) {
      table.increments("id");
      table.integer("user_id").references("id").inTable("users");
      table.string("status");
      table.decimal("total_price", 10, 2);
      table.text("observations");
      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
};

exports.down = async function (knex) {
  await knex.schema
    .dropTableIfExists("users")
    .dropTableIfExists("dishes")
    .dropTableIfExists("ingredients")
    .dropTableIfExists("favourites")
    .dropTableIfExists("dish_categories")
    .dropTableIfExists("create_order")
    .dropTableIfExists("orders");
};
