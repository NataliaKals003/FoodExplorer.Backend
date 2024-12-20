const knex = require("../database/knex");

const dishesTableName = "dishes";
const ingredientsTableName = "ingredients";

class DishRepository {
  async create(newDish) {
    const [dish] = await knex(dishesTableName)
      .insert({
        name: newDish.name,
        description: newDish.description,
        price: newDish.price,
        category_id: newDish.categoryId,
        dish_image: newDish.imageFileName,
        created_at: new Date().toISOString(),
      })
      .returning(["id"]);

    return dish;
  }

  async find(dishId) {
    const existingDish = await knex(dishesTableName)
      .where({ id: dishId })
      .first();
    return existingDish;
  }

  async getAll() {
    const dishesData = await knex(dishesTableName).select(
      "id",
      "name",
      "description",
      "dish_image",
      "price",
      "category_id"
    );
    return dishesData;
  }

  async update(updateDish) {
    await knex(dishesTableName).where({ id: updateDish.dishId }).update({
      name: updateDish.name,
      dish_image: updateDish.imageName,
      price: updateDish.price,
      description: updateDish.description,
      category_id: updateDish.categoryId,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(dishId) {
    const deleteDish = await knex(dishesTableName).where({ id: dishId }).del();
    return deleteDish;
  }

  async searchDishes(searchTerm) {
    try {
      const results = await knex("dishes")
        .leftJoin("ingredients", "dishes.id", "ingredients.dish_id")
        .select("dishes.*")
        .distinct()
        .where("dishes.name", "like", `%${searchTerm}%`)
        .orWhere("ingredients.name", "like", `%${searchTerm}%`);

      return results;
    } catch (error) {
      throw new Error("Error fetching search results from the database");
    }
  }
}

module.exports = { DishRepository, dishesTableName };
