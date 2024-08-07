const knex = require("../database/knex");

export const ingredientsTableName = "ingredients";

class IngredientsController {
    async GetAll(request, response) {
        const { name } = request.query;

        const ingredients = await knex(ingredientsTableName)
            .whereLike("name", `%${name}%`)

        return response.json(ingredientsTableName)
    }
}

module.exports = IngredientsController;
