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
      const status = request.query.status; // Get status from query parameters

      const userIdToFilter = isAdmin ? null : userId;
      const databaseOrdersWithDishes = await orderRepository.getAll(
        userIdToFilter,
        status // Pass status to the repository
      );

      if (!databaseOrdersWithDishes || databaseOrdersWithDishes.length == 0) {
        return response.json([]);
      }

      const mappedOrders = [];
      const grouped = databaseOrdersWithDishes.reduce((acc, order) => {
        if (!acc[order.id]) {
          acc[order.id] = [];
        }
        acc[order.id].push(order);
        return acc;
      }, {});

      for (const orderId in grouped) {
        mappedOrders.push(mapOrdersToFrontend(grouped[orderId]));
      }

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

  // async delete(request, response) {
  //   const { dishId } = request.params;
  //   const userId = request.user.id;
  //   try {
  //     const result = await orderRepository.delete(userId, dishId);

  //     if (result === 0) {
  //       return response.status(404).json({ error: "Order not found" });
  //     }

  //     return response
  //       .status(200)
  //       .json({ message: "Order successfully removed!" });
  //   } catch (error) {
  //     console.error("Error removing order:", error);
  //     return response.status(500).json({ error: "Error removing order" });
  //   }
  // }
}

module.exports = OrderController;
