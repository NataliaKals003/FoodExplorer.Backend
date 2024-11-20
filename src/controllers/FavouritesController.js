const { DishRepository } = require("../repositories/DishRepository");
const { FavouriteRepository } = require("../repositories/FavouriteRepository");
const { mapDishToFrontend } = require("../utils/mappers/dish");

const dishRepository = new DishRepository();
const favouriteRepository = new FavouriteRepository();

class IngredientsController {
  async create(request, response) {
    const { dishId } = request.body;
    const userId = request.user.id;

    try {
      const dishExists = await dishRepository.find(dishId);
      if (!dishExists) {
        return response.status(404).json({ error: "Dish not found" });
      }

      await favouriteRepository.create(userId, dishId);
      return response
        .status(201)
        .json({ message: "Dish successfully added to favorites!" });
    } catch (error) {
      console.error("Error adding dish to favorites:", error);
      return response
        .status(500)
        .json({ error: "Error adding dish to favorites" });
    }
  }

  async getAll(request, response) {
    try {
      const userId = request.user.id;
      const favourites = await favouriteRepository.getAll(userId);

      const favouritesWithDishes = favourites?.map((dish) => {
        return mapDishToFrontend(dish);
      });

      response.json(favouritesWithDishes);
    } catch (error) {
      console.error("Error fetching favourites:", error);
      response.status(500).json({ error: "Failed to fetch favourites" });
    }
  }

  async delete(request, response) {
    const { dishId } = request.params;
    const userId = request.user.id;

    try {
      const dishExists = await dishRepository.find(dishId);
      if (!dishExists) {
        return response.status(404).json({ error: "Dish not found" });
      }

      const result = await favouriteRepository.delete(userId, dishId);
      if (result === 0) {
        return response.status(404).json({ error: "Favorite not found" });
      }

      return response
        .status(200)
        .json({ message: "Favourite successfully removed!" });
    } catch (error) {
      console.error("Error removing favourite:", error);
      return response.status(500).json({ error: "Error removing favourite" });
    }
  }
}

module.exports = IngredientsController;
