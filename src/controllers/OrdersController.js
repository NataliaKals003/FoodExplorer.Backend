const knex = require("../database/knex");
const { dishesTableName } = require("./DishesController");
const { order_dishesTableName } = require("./OrderDishesController");

const ordersTableName = "orders";

class OrderController {
    async create(request, response) {
        try {
            const { status, total_price, observations, user_id, dishes } = request.body;

            const totalPriceNumber = parseFloat(total_price);
            if (isNaN(totalPriceNumber)) {
                return response.status(400).json({ error: "Invalid total price" });
            }

            await knex(ordersTableName).insert({
                status,
                total_price: totalPriceNumber,
                observations,
                user_id,
                created_at: new Date().toISOString()
            });

            const orderDishesController = new OrderDishesController();
            await orderDishesController.Details({ body: { dishes } }, response);

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

            await knex(ordersTableName)
                .where({ id })
                .update({
                    status,
                    total_price: totalPriceNumber,
                    observations,
                    updated_at: new Date().toISOString()
                });

            const orderExists = await knex(ordersTableName).where({ id }).first();
            if (!orderExists) {
                return response.status(400).json({ error: "Order not found" });
            }

            const orderDishesController = new OrderDishesController();

            for (const dish of dishes) {
                const { dish_id } = dish;

                const dishExists = await knex(dishesTableName).where('id', dish_id).first();
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

    async GetOne(request, response) {
        const { id } = request.params;

        try {
            const order = await knex(ordersTableName).where({ id }).first();

            if (!order) {
                return response.status(404).json({ error: "Order not found" });
            }

            const dishes = await knex(order_dishesTableName)
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

    async GetAll(request, response) {
        const { user_id } = request.query;

        const orders = await knex(ordersTableName)
            .where({ user_id })

        return response.json(orders)
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex(ordersTableName).where({ id }).delete();

        return response.json();
    }
}

module.exports = OrderController;
