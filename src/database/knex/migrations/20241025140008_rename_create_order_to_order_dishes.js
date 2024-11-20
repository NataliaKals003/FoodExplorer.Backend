exports.up = function (knex) {
  return knex.schema.renameTable("create_order", "order_dishes");
};

exports.down = function (knex) {
  return knex.schema.renameTable("order_dishes", "create_order");
};
