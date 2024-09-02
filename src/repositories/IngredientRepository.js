const knex = require("../database/knex");

const ingredientTableName = "ingredients";

class IngredientRepository {
  async create(dishId, ingredientNames) {
    const ingredientsData = ingredientNames.map((ingredientName) => ({
      dish_id: dishId,
      name: ingredientName,
    }));

    const ingredient = await knex(ingredientTableName).insert(ingredientsData);

    return ingredient;
  }

  async update(dishId) {
    const ingredientsData = ingredients.map((ingredientName) => ({
      dish_id: dishId,
      name: ingredientName,
    }));

    await knex(ingredientTableName).insert(ingredientsData);
  }

  async getIngredientById(dishId) {
    const ingredientsData = await knex(ingredientTableName)
      .where({ dish_id: dishId })
      .select("name");
    return ingredientsData;
  }

  async getAll() {
    const getAll = knex("ingredients").select("dish_id", "name");
    return getAll;
  }

  async delete(dishId) {
    await knex(ingredientTableName).where({ dish_id: dishId }).del();
  }
}

module.exports = IngredientRepository;
