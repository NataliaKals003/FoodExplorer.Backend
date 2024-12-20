const AppError = require("../utils/AppError");
const {
  OrderDishesRepository,
} = require("../repositories/OrderDishesRepository");
const { OrderRepository } = require("../repositories/OrderRepository");
const { DishRepository } = require("../repositories/DishRepository");

const dishRepository = new DishRepository();
const orderDishesRepository = new OrderDishesRepository();
const orderRepository = new OrderRepository();

class OrderDishesController {
  async create(request, response) {
    const { dishId, quantity } = request.body;
    const userId = request.user.id;

    try {
      const dishExists = await dishRepository.find(dishId);
      if (!dishExists) {
        return response.status(404).json({ error: "Dish not found" });
      }

      if (quantity <= 0) {
        return response
          .status(400)
          .json({ error: "Quantity must be greater than 0" });
      }

      const existingPendingOrder = await orderRepository.find(
        userId,
        "Pending"
      );

      var orderId;
      if (existingPendingOrder != null) {
        orderId = existingPendingOrder.id;
      } else {
        const [newOrder] = await orderRepository.create(userId);
        orderId = newOrder.id;
      }

      const existingDishInOrder =
        await orderDishesRepository.findByDishAndOrder(orderId, dishId);

      if (existingDishInOrder) {
        // If dish exists, update the quantity
        const updatedQuantity = existingDishInOrder.quantity + quantity;
        await orderDishesRepository.updateQuantity(
          orderId,
          dishId,
          updatedQuantity
        );
        return response
          .status(200)
          .json({ message: "Dish quantity updated in the order!" });
      } else {
        await orderDishesRepository.create(dishId, orderId, quantity);

        return response
          .status(201)
          .json({ message: "Dish successfully added to order!" });
      }
    } catch (error) {
      console.error("Error adding dish to order:", error);
      return response
        .status(500)
        .json({ error: "Error adding this dish to the order" });
    }
  }

  async update(request, response) {
    const { order_id, dishes } = request.body;
    const id = request.params.id;

    try {
      const existingOrder = await orderDishesRepository.find(id);
      if (!existingOrder) {
        throw new AppError("Order not found");
      }

      for (const dish of dishes) {
        const { dish_id, quantity } = dish;

        const updateOrder = {
          orderId: order_id,
          dishId: dish_id,
          quantity: quantity,
        };

        await orderDishesRepository.update(updateOrder);
      }
    } catch (error) {
      console.error("Error updating order", error);
      throw error;
    }
  }

  async delete(request, response) {
    const { id, dishId } = request.params;

    console.log("Dish ID:", dishId, "Order ID:", id);

    try {
      const result = await orderDishesRepository.delete(id, dishId);

      if (result === 0) {
        return response.status(404).json({ error: "Order not found" });
      }

      return response
        .status(200)
        .json({ message: "Order successfully removed!" });
    } catch (error) {
      console.error("Error removing order:", error);
      return response.status(500).json({ error: "Error removing order" });
    }
  }
}

module.exports = OrderDishesController;
