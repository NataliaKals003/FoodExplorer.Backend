const knex = require("../database/knex");

class CategoriesController {

    async GetAll(request, response) {
        const { name } = request.query;

        const categories = await knex("dish_categories")
            .whereLike("name", `%${name}%`)

        return response.json(categories)
    }
}

module.exports = CategoriesController;
