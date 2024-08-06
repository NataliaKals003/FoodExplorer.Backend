const knex = require("../database/knex");

class OrderDishesController {
    async Details(request, response) {
        const { order_id, dishes } = request.body;

        // if (!order_id || !Array.isArray(dishes)) {
        //     return response.status(400).json({ error: "Dados obrigatórios ausentes ou formato incorreto" });
        // }

        try {
            for (const dish of dishes) {
                const { dish_id, quantity } = dish;

                // if (!dish_id || !quantity) {
                //     continue; // Ignora se faltar dados
                // }

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
