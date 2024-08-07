const knex = require("../database/knex");

const dishCategoriesTableName = "dish_categories";

class CategoriesController {

    async GetAll(request, response) {
        const { name } = request.query;

        const categories = await knex(dishCategoriesTableName)
            .whereLike("name", `%${name}%`)

        return response.json(categories)
    }
}

module.exports = CategoriesController;
