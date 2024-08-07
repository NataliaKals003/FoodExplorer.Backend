const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { dishesTableName } = require("./DishesController");
const { usersTableName } = require("./UsersController");

const favouritesTableName = "favourites";

class IngredientsController {

    async create(request, response) {
        const { user_id, dish_id } = request.body;

        try {
            const dishExists = await knex(dishesTableName).where({ id: dish_id }).first();
            const userExists = await knex(usersTableName).where({ id: user_id }).first();

            if (!dishExists) {
                return response.status(404).json({ error: "Dish not found" });
            }

            if (!userExists) {
                return response.status(404).json({ error: "User not found" });
            }

            const favouriteExists = await knex(favouritesTableName)
                .where({ user_id, dish_id })
                .first();

            if (favouriteExists) {
                return response.status(400).json({ error: "Dish is already in favorites" });
            }

            await knex(favouritesTableName).insert({
                user_id,
                dish_id
            });

            response.status(201).json({ message: "Dish successfully added to favorites!" });

        } catch (error) {
            console.error('Error adding dish to favorites:', error);
            response.status(500).json({ error: "Error adding dish to favorites" });
        }
    }

    async delete(request, response) {

        const { user_id, dish_id } = request.body;

        try {
            const result = await knex(favouritesTableName)
                .where({ user_id, dish_id })
                .del();

            if (result === 0) {
                return response.status(404).json({ error: "Favorite not found" });
            }

            return response.status(200).json({ message: "Dish successfully removed from favorites!" });

        } catch (error) {
            console.error('Error removing dish from favorites:', error);
            return response.status(500).json({ error: "Error removing dish from favorites" });
        }
    }
}

module.exports = IngredientsController;
