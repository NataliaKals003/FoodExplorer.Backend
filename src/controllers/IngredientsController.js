const knex = require("../database/knex");

class IngredientsController {

    // async getOne(request, response) {
    //     const { dish_id } = request.params;

    //     try {
    //         const ingredients = await knex("ingredients").where({ dish_id });

    //         response.json({ ingredients });
    //     } catch (error) {
    //         console.error('Erro ao buscar ingredientes:', error);
    //         response.status(500).json({ error: "Erro ao buscar ingredientes" });
    //     }
    // }

    async GetAll(request, response) {
        const { name } = request.query;

        const ingredients = await knex("ingredients")
            .whereLike("name", `%${name}%`)

        return response.json(ingredients)
    }
}

module.exports = IngredientsController;
