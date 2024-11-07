const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { OrderRepository } = require("../repositories/OrderRepository");

const { mapOrdersToFrontend } = require("../utils/mappers/order");

const orderRepository = new OrderRepository();

class OrderController {
  async create(request, response) {
    const userId = request.user.id;

    try {
      const newOrderId = await orderRepository.create(userId);

      return response.status(201).json({ orderId: newOrderId });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      return response.status(500).json({ error: "Erro ao criar pedido" });
    }
  }

  async getOne(request, response) {
    const { id } = request.params;
    try {
      const orderDishes = await orderRepository.getOne(id);

      if (!orderDishes || orderDishes.length === 0) {
        throw new AppError("Order not found");
      }

      const formattedOrder = mapOrdersToFrontend(orderDishes);

      response.json(formattedOrder);
    } catch (error) {
      console.error("Error searching for order:", error);
      response.status(500).json({ error: "Error searching for order" });
    }
  }

  async getAll(request, response) {
    try {
      const userId = request.user.id;
      const isAdmin = request.user.role === "admin";

      const userIdToFilter = isAdmin ? null : userId;
      const databaseOrdersWithDishes = await orderRepository.getAll(
        userIdToFilter
      );

      if (!databaseOrdersWithDishes || databaseOrdersWithDishes.length == 0) {
        response.json([]);
      }

      const mappedOrders = [];

      // Group by `order_id`
      const grouped = databaseOrdersWithDishes.reduce((acc, order) => {
        if (!acc[order.id]) {
          acc[order.id] = [];
        }
        acc[order.id].push(order);
        return acc;
      }, {});

      // console.log("grouped", grouped);

      for (const orderId in grouped) {
        mappedOrders.push(mapOrdersToFrontend(grouped[orderId]));
      }

      // ordersWithDishes.forEach((order) => {
      //   if (!ordersMap.has(order.id)) {
      //     ordersMap.set(order.id, mapOrdersToFrontend(order));
      //   }
      //   // ordersMap.get(order.id).dishes.push({
      //   //   quantity: order.quantity,
      //   //   name: order.name,
      //   // });
      // });

      // const formattedOrders = Array.from(ordersMap.values());

      response.json(mappedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return response.status(500).json({ error: "Error fetching orders" });
    }
  }

  async update(request, response) {
    // const userId = request.user.id;
    const orderId = request.params.id;
    const { status } = request.body;

    console.log("status:", status);
    console.log("orderId:", orderId);

    try {
      // const orderExists = await orderRepository.find(userId, status);

      // if (!orderExists) {
      //   response.status(404).json({ error: "Order not found" });
      // }

      await orderRepository.update(orderId, status);
      return response
        .status(200)
        .json({ message: "Order updated successfully" });
    } catch (error) {
      console.error('Error updating order:"', error);
      return response.status(500).json({ error: "Error updating order" });
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    try {
      const result = await knex(ordersTableName).where({ id }).del();

      if (result === 0) {
        return response.status(404).json({ error: "Order not found" });
      }

      return response.status(204).json();
    } catch (error) {
      console.error("Error deleting order:", error);
      return response.status(500).json({ error: "Error deleting order" });
    }
  }
}

module.exports = OrderController;
