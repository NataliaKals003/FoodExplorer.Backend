const knex = require("../database/knex");

const dish_CategoriesTableName = "dish_categories";

class CategoriesController {

    async GetAll(request, response) {
        const { name } = request.query;

        const categories = await knex(dish_CategoriesTableName)
            .whereLike("name", `%${name}%`)

        return response.json(categories)
    }
}

module.exports = CategoriesController;
