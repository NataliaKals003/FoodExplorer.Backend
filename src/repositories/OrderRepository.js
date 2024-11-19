const knex = require("../database/knex");

const ordersTableName = "orders";
const {
  orderDishesTableName,
} = require("../repositories/OrderDishesRepository");
const { dishesTableName } = require("../repositories/DishRepository");

class OrderRepository {
  async create(userId) {
    return await knex(ordersTableName)
      .insert({
        user_id: userId,
        status: "Pending",
        created_at: new Date().toISOString(),
      })
      .returning("id");
  }

  async getAll(userId, status) {
    try {
      const query = knex(ordersTableName)
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
        .select(
          `${ordersTableName}.id`,
          `${ordersTableName}.status`,
          `${ordersTableName}.observations`,
          `${ordersTableName}.total_price`,
          `${ordersTableName}.created_at`,
          `${ordersTableName}.updated_at`,
          `${dishesTableName}.name`,
          `${dishesTableName}.dish_image`,
          `${dishesTableName}.price`,
          `${orderDishesTableName}.dish_id`,
          `${orderDishesTableName}.quantity`
        )
        .orderBy(`${ordersTableName}.created_at`);

      // Add user filter if `userId` is provided
      if (userId) {
        query.where(`${ordersTableName}.user_id`, userId);
      }

      // Add status filter if `status` is provided
      if (status) {
        query.where(`${ordersTableName}.status`, status);
      }

      const orders = await query;
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Error fetching orders");
    }
  }

  async getOne(id) {
    try {
      const order = await knex(ordersTableName)
        .where(`${ordersTableName}.id`, id)
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
        .select(
          `${ordersTableName}.id`,
          `${ordersTableName}.status`,
          `${ordersTableName}.observations`,
          `${ordersTableName}.total_price`,
          `${ordersTableName}.created_at`,
          `${ordersTableName}.updated_at`,
          `${dishesTableName}.name`,
          `${dishesTableName}.price`,
          `${dishesTableName}.dish_image`,
          `${orderDishesTableName}.dish_id`,
          `${orderDishesTableName}.quantity`
        );
      return order;
    } catch (error) {
      console.error("Error fetching orders:", error);
      response.status(500).json({ error: "Error fetching orders" });
    }
  }

  async find(userId, status) {
    try {
      const existingOrder = await knex(ordersTableName)
        .where({ user_id: userId, status: status })
        .first();
      return existingOrder;
    } catch (error) {
      console.error("Error fetching order:", error);
      return response.status(500).json({ error: "Error fetching order" });
    }
  }

  async update(orderId, status) {
    try {
      return await knex(ordersTableName).where({ id: orderId }).update({
        status,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error for update order:", error);
      return response.status(500).json({ error: "Error for update order" });
    }
  }

  // async delete(userId, dishId) {
  //   const deleteDish = await knex(ordersTableName)
  //     .where({ user_id: userId, dish_id: dishId })
  //     .del();
  //   return deleteDish;
  // }
}

module.exports = { OrderRepository, ordersTableName };
