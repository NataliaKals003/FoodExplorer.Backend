const knex = require("../database/knex");

const favouritesTableName = "favourites";

class FavouriteRepository {
  async create(userId, dishId) {
    const favourite = await knex(favouritesTableName).insert({
      user_id: userId,
      dish_id: dishId,
    });
    return favourite;
  }

  async delete(userId, dishId) {
    try {
      const removeFavourite = await knex(favouritesTableName)
        .where({ user_id: userId, dish_id: dishId })
        .del();

      return removeFavourite;
    } catch (error) {
      console.error("Error removing favourite:", error);
      throw error;
    }
  }

  async getAll(userId) {
    try {
      const favourites = await knex(favouritesTableName)
        .join("dishes", "dishes.id", `${favouritesTableName}.dish_id`)
        .where(`${favouritesTableName}.user_id`, userId)
        .select("dishes.*", `${favouritesTableName}.dish_id`)
        .orderBy("dishes.name");

      return favourites;
    } catch (error) {
      console.error("Error removing favourite:", error);
      throw error;
    }
  }
}

module.exports = { FavouriteRepository, favouritesTableName };
