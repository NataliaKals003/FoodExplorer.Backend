const OrderDishesRepository = require("../repositories/OrderDishesRepository");
const AppError = require("../utils/AppError");

const orderDishesRepository = new OrderDishesRepository();

class OrderDishesController {
  async create(request, response) {
    const { order_id, dishes } = request.body;

    try {
      for (const dish of dishes) {
        const { dish_id, quantity } = dish;

        newOrder = {
          orderId: order_id,
          dishId: dish_id,
          quantity: quantity,
        };

        const order = await orderDishesRepository.create(newOrder);

        if (order.id == null) {
          return response.status(500).json({ error: "Order not created" });
        }
      }
      response.status(201).json({ message: "Order successfully added!" });
    } catch (error) {
      response.status(500).json({ error: "Error adding order" });
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
    const id = request.params.id;
    try {
      const result = await orderDishesRepository.delete(id);

      if (result === 0) {
        return response.status(404).json({ error: "Order not found" });
      }

      return response
        .status(200)
        .json({ message: "Order successfully deleted!" });
    } catch (error) {
      console.error("Error removing order:", error);
      return response.status(500).json({ error: "Error removing order" });
    }
  }
}

module.exports = OrderDishesController;
