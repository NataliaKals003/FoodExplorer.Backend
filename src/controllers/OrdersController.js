const knex = require("../database/knex");
const OrderDishesController = require("./OrderDishesController");

const OrdersTableName = "orders";

class OrderController {
    async create(request, response) {
        try {
            const { status, total_price, observations, dishes } = request.body;
            const user_id = request.user.id;

            const totalPriceNumber = parseFloat(total_price);
            if (isNaN(totalPriceNumber)) {
                return response.status(400).json({ error: "Invalid total price" });
            }

            const [orderId] = await knex(OrdersTableName).insert({
                status,
                total_price: totalPriceNumber,
                observations,
                user_id,
                created_at: new Date().toISOString()
            });

            const orderDishesController = new OrderDishesController();
            await orderDishesController.details({ body: { order_id: orderId, dishes } }, response);

            return response.status(201).json({ message: "Order successfully created" });

        } catch (error) {
            console.error("Error creating order:", error);
            response.status(500).json({ error: "Error creating order" });
        }
    }

    async update(request, response) {
        const { id } = request.params;
        const { status, total_price, observations, dishes } = request.body;

        try {
            const totalPriceNumber = parseFloat(total_price);
            if (isNaN(totalPriceNumber)) {
                return response.status(400).json({ error: "Invalid total price" });
            }

            const orderExists = await knex(OrdersTableName).where({ id }).first();
            if (!orderExists) {
                return response.status(400).json({ error: "Order not found" });
            }

            await knex(OrdersTableName)
                .where({ id })
                .update({
                    status,
                    total_price: totalPriceNumber,
                    observations,
                    updated_at: new Date().toISOString()
                });

            const orderDishesController = new OrderDishesController();

            for (const dish of dishes) {
                const { dish_id } = dish;

                const dishExists = await knex("dishes").where('id', dish_id).first();
                if (!dishExists) {
                    return response.status(400).json({ error: `Dish with id ${dish_id} not found` });
                }
            }

            await orderDishesController.update({ body: { order_id: id, dishes } }, response);

            if (!response.headersSent) {
                return response.status(200).json({ message: "Order successfully updated!" });
            }
        } catch (error) {
            console.error('Error updating order:"', error);
            if (!response.headersSent) {
                return response.status(500).json({ error: "Error updating order" });
            }
        }
    }

    async getOne(request, response) {
        const { id } = request.params;

        try {
            const order = await knex(OrdersTableName).where({ id }).first();

            if (!order) {
                return response.status(404).json({ error: "Order not found" });
            }

            const dishes = await knex("order_dishes")
                .join("dishes", "order_dishes.dish_id", "dishes.id")
                .where({ order_id: id })
                .select("dishes.*", "order_dishes.quantity")
                .orderBy("dishes.name");

            return response.json({
                ...order,
                dishes
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            response.status(500).json({ error: "Error fetching orders" });
        }
    }

    async getAll(request, response) {
        const user_id = request.user.id

        try {
            const orders = await knex(OrdersTableName)
                .select('id', 'status', 'observations', 'total_price', 'dishes', 'created_at', 'updated_at')
                .where({ user_id });

            return response.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            return response.status(500).json({ error: "Error fetching orders" });
        }
    }

    async delete(request, response) {
        const { id } = request.params;

        try {
            const result = await knex(OrdersTableName).where({ id }).del();

            if (result === 0) {
                return response.status(404).json({ error: "Order not found" });
            }

            return response.status(204).json();
        } catch (error) {
            console.error('Error deleting order:', error);
            return response.status(500).json({ error: "Error deleting order" });
        }
    }
}

module.exports = OrderController;
