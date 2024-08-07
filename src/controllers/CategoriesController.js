const knex = require("../database/knex");

export const dish_categoriesTableName = "dish_categories";

class CategoriesController {

    async GetAll(request, response) {
        const { name } = request.query;

        const categories = await knex(dish_categoriesTableName)
            .whereLike("name", `%${name}%`)

        return response.json(categories)
    }
}

module.exports = CategoriesController;
