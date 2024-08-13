const knex = require("../database/knex");

const orderdishesTableName = "order_dishes";

class OrderDishesController {
    async details(request, response) {
        const { order_id, dishes } = request.body;

        try {
            for (const dish of dishes) {
                const { dish_id, quantity } = dish;

                await knex(orderdishesTableName).insert({
                    order_id,
                    dish_id,
                    quantity
                });
            }
            response.status(201).json({ message: "Order successfully added!" });

        } catch (error) {
            console.error("Error adding order:", error);
            response.status(500).json({ error: "Error adding order" });
        }
    }

    async update(request, response) {
        const { order_id, dishes } = request.body;

        try {
            await knex(orderdishesTableName)
                .where({ order_id })
                .del();

            for (const dish of dishes) {
                const { dish_id, quantity } = dish;

                await knex(orderdishesTableName).insert({
                    order_id,
                    dish_id,
                    quantity
                });
            }

        } catch (error) {
            console.error("Error updating order details", error);
            throw error;
        }
    }
}

module.exports = OrderDishesController;
