const knex = require("../database/knex");

const dishCategoriesTableName = "dish_categories";

class CategoriesController {

    async getAll(request, response) {
        try {
            const categories = await knex(dishCategoriesTableName).select('id', 'name');
            response.json(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            response.status(500).json({ error: 'Failed to fetch categories' });
        }
    }
}

module.exports = CategoriesController;
