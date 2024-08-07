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
                user_id,
                created_at: new Date().toISOString()
            });

            const orderDishesController = new OrderDishesController();
            await orderDishesController.Details({ body: { order_id, dishes } }, response);

        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            response.status(500).json({ error: "Erro ao criar pedido" });
        }
    }

    async update(request, response) {
        const { id } = request.params;
        const { status, total_price, observations, dishes } = request.body;

        try {
            const totalPriceNumber = parseFloat(total_price);
            if (isNaN(totalPriceNumber)) {
                return response.status(400).json({ error: "Preço total inválido" });
            }

            await knex("orders")
                .where({ id })
                .update({
                    status,
                    total_price: totalPriceNumber,
                    observations,
                    updated_at: new Date().toISOString()
                });

            // Verifica se o pedido existe
            const orderExists = await knex("orders").where({ id }).first();
            if (!orderExists) {
                return response.status(400).json({ error: "Pedido não encontrado" });
            }

            // Atualiza os detalhes dos pratos
            const orderDishesController = new OrderDishesController();

            for (const dish of dishes) {
                const { dish_id } = dish;

                // Verifica se o prato existe
                const dishExists = await knex("dishes").where({ id: dish_id }).first();
                if (!dishExists) {
                    return response.status(400).json({ error: `Prato com ID ${dish_id} não encontrado` });
                }
            }

            await orderDishesController.update({ body: { order_id: id, dishes } }, response);

            if (!response.headersSent) {
                return response.status(200).json({ message: "Pedido atualizado com sucesso!" });
            }
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            if (!response.headersSent) {
                return response.status(500).json({ error: "Erro ao atualizar pedido" });
            }
        }
    }

    async GetOne(request, response) {
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

    async GetAll(request, response) {
        const { user_id } = request.query;

        const orders = await knex("orders")
            .where({ user_id })

        return response.json(orders)
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("orders").where({ id }).delete();

        return response.json();
    }
}

module.exports = OrderController;
