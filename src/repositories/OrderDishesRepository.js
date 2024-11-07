const knex = require("../database/knex");

const orderDishesTableName = "order_dishes";

class OrderDishesRepository {
  async create(dishId, orderId, quantity) {
    const order = await knex(orderDishesTableName).insert({
      dish_id: dishId,
      order_id: orderId,
      quantity: quantity,
    });
    return order;
  }

  async find(orderId) {
    const existingOrder = await knex(orderDishesTableName)
      .where({ id: orderId })
      .first();
    return existingOrder;
  }

  async update(updateOrder) {
    await knex(orderDishesTableName).where({ id: updateOrder.orderId }).update({
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
