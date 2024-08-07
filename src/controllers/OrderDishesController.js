const knex = require("../database/knex");

class OrderDishesController {
    async Details(request, response) {
        const { order_id, dishes } = request.body;

        try {
            for (const dish of dishes) {
                const { dish_id, quantity } = dish;

                await knex("order_dishes").insert({
                    order_id,
                    dish_id,
                    quantity
                });
            }
            response.status(201).json({ message: "Pedido adicionado com sucesso!" });

        } catch (error) {
            console.error('Erro ao adicionar pedido:', error);
            response.status(500).json({ error: "Erro ao adicionar pedido" });
        }
    }

    async update(request, response) {
        const { order_id, dishes } = request.body;

        try {
            await knex("order_dishes")
                .where({ order_id })
                .del();

            for (const dish of dishes) {
                const { dish_id, quantity } = dish;

                await knex("order_dishes").insert({
                    order_id,
                    dish_id,
                    quantity
                });
            }

        } catch (error) {
            console.error('Erro ao atualizar detalhes do pedido:', error);
            throw error;
        }
    }
}

module.exports = OrderDishesController;
