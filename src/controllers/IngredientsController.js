const knex = require("../database/knex");

class IngredientsController {
    async GetAll(request, response) {
        const { name } = request.query;

        const ingredients = await knex("ingredients")
            .whereLike("name", `%${name}%`)

        return response.json(ingredients)
    }
}

module.exports = IngredientsController;
