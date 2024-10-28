const knex = require("../database/knex");

const orderDishesTableName = "order_dishes";

class OrderDishesRepository {
  async create(newOrder) {
    const [order] = await knex(orderdishesTableName)
      .insert({
        order_id: newOrder.orderId,
        dish_id: newOrder.dishId,
        quantity: newOrder.quantity,
        created_at: new Date().toISOString(),
      })
      .returning(["id"]);
    return order;
  }

  async find(orderId) {
    const existingOrder = await knex(orderdishesTableName)
      .where({ id: orderId })
      .first();
    return existingOrder;
  }

  async update(updateOrder) {
    await knex(orderdishesTableName).where({ id: updateOrder.orderId }).update({
      orderId: updateOrder.order_id,
      dishId: updateOrder.dish_id,
      quantity: updateOrder.quantity,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(orderId) {
    const deleteOrder = await knex(orderdishesTableName)
      .where({ id: orderId })
      .del();
    return deleteOrder;
  }
}

module.exports = { OrderDishesRepository, orderDishesTableName };
