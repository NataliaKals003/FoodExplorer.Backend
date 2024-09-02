const knex = require("../database/knex");

const dishCategoriesName = "dish_categories";

class CategoryRepository {
  async find(categoryId) {
    const existingCategory = await knex(dishCategoriesName)
      .where({ id: categoryId })
      .first();

    return existingCategory;
  }
}

module.exports = CategoryRepository;
