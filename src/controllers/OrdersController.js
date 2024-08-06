const knex = require("../database/knex");
const OrderDishesController = require('./OrderDishesController');

class OrderController {
    async create(request, response) {
        try {
            const { status, total_price, observations, user_id, dishes } = request.body;

            const totalPriceNumber = parseFloat(total_price);
            if (isNaN(totalPriceNumber)) {
                return response.status(400).json({ error: "Preço total inválido" });
            }

            const [order_id] = await knex("orders").insert({
                status,
                total_price: totalPriceNumber,
                observations,
                user_id
            });

            const orderDishesController = new OrderDishesController();
            await orderDishesController.Details({ body: { order_id, dishes } }, response);

        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            response.status(500).json({ error: "Erro ao criar pedido" });
        }
    }

    async getAll(request, response) {
        const { id } = request.params;

        try {
            const order = await knex("orders").where({ id }).first();

            if (!order) {
                return response.status(404).json({ error: "Pedido não encontrado" });
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
            console.error('Erro ao buscar pedidos:', error);
            response.status(500).json({ error: "Erro ao buscar pedidos" });
        }
    }
}

module.exports = OrderController;
