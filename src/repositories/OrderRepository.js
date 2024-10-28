const knex = require("../database/knex");

const ordersTableName = "orders";
const {
  orderDishesTableName,
} = require("../repositories/OrderDishesRepository");
const { dishesTableName } = require("../repositories/DishRepository");

class OrderRepository {
  async getAll(userId) {
    try {
      const orders = await knex(ordersTableName)
        .join(
          `${orderDishesTableName}`,
          `${orderDishesTableName}.order_id`,
          `${ordersTableName}.id`
        )
        .join(
          `${dishesTableName}`,
          `${dishesTableName}.id`,
          `${orderDishesTableName}.dish_id`
        )
        .where(`${ordersTableName}.user_id`, userId)
        .select(
          `${ordersTableName}.id`,
          `${ordersTableName}.status`,
          `${ordersTableName}.observations`,
          `${ordersTableName}.total_price`,
          `${ordersTableName}.created_at`,
          `${ordersTableName}.updated_at`,
          `${dishesTableName}.name`,
          // `${dishesTableName}.id`,
          `${orderDishesTableName}.dish_id`,
          `${orderDishesTableName}.quantity`
        )
        .orderBy(`${ordersTableName}.created_at`);
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return response.status(500).json({ error: "Error fetching orders" });
    }
  }
}

module.exports = { OrderRepository, ordersTableName };
