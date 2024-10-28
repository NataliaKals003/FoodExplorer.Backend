const knex = require("../database/knex");

const dishCategoriesTableName = "dish_categories";

class CategoryRepository {
  async find(categoryId) {
    const existingCategory = await knex(dishCategoriesTableName)
      .where({ id: categoryId })
      .first();

    return existingCategory;
  }

  async getAll() {
    const categories = knex(dishCategoriesTableName).select("id", "name");
    return categories;
  }
}

module.exports = CategoryRepository;
