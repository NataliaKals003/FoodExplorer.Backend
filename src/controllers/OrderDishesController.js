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
            response.status(201).json({ message: "Detalhes do pedido adicionados com sucesso" });
        } catch (error) {
            console.error('Erro ao adicionar detalhes do pedido:', error);
            response.status(500).json({ error: "Erro ao adicionar detalhes do pedido" });
        }
    }
}

module.exports = OrderDishesController;
