const knex = require("../database/knex");

class IngredientsController {
    async create(request, response) {
        const { name, dish_id } = request.body;

        try {
            const [ingredient_id] = await knex("ingredients").insert({
                name,
                dish_id
            });

            response.status(201).json({ ingredient_id, message: "Ingrediente adicionado com sucesso" });
        } catch (error) {
            console.error('Erro ao adicionar ingrediente:', error);
            response.status(500).json({ error: "Erro ao adicionar ingrediente" });
        }
    }

    async getOne(request, response) {
        const { dish_id } = request.params;

        try {
            const ingredients = await knex("ingredients").where({ dish_id });

            response.json({ ingredients });
        } catch (error) {
            console.error('Erro ao buscar ingredientes:', error);
            response.status(500).json({ error: "Erro ao buscar ingredientes" });
        }
    }

    async GetAll(request, response) {
        const { name } = request.query;

        const ingredients = await knex("ingredients")
            .whereLike("name", `%${name}%`)

        return response.json(ingredients)
    }
}

module.exports = IngredientsController;
