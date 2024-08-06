const knex = require("../database/knex");

class DishesController {
    async create(request, response) {
        try {
            const { name, description, price } = request.body;
            const priceNumber = parseFloat(price);

            if (isNaN(priceNumber)) {
                return response.status(400).json({ error: "Preço inválido" });
            }

            const [dish_id] = await knex("dishes").insert({
                name,
                description,
                price: priceNumber
            });

            response.status(201).json({ dish_id });
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "Erro ao cadastrar prato" });
        }
    }
}

module.exports = DishesController;