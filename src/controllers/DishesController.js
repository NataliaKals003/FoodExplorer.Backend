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

    async GetOne(request, response) {
        const { id } = request.params;

        try {
            const dish = await knex("dishes").where({ id }).first();

            if (!dish) {
                return response.status(404).json({ error: "Prato não encontrado" });
            }

            const ingredients = await knex("ingredients")
                .where({ dish_id: id })
                .select("id", "name");

            return response.json({
                ...dish,
                ingredients
            });
        } catch (error) {
            console.error('Erro ao buscar prato:', error);
            response.status(500).json({ error: "Erro ao buscar prato" });
        }
    }

    async GetAll(request, response) {
        const { name } = request.query;

        const dishes = await knex("dishes")
            .whereLike("name", `%${name}%`)

        return response.json(dishes)
    }


}

module.exports = DishesController;