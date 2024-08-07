const knex = require("../database/knex");
import { dish_categoriesTableName } from "./CategoriesController";
import { ingredientsTableName } from "./IngredientsController";

export const dishesTableName = "dishes";

class DishesController {
    async create(request, response) {
        try {
            const { name, description, price, category_id, ingredients } = request.body;
            const priceNumber = parseFloat(price);

            if (isNaN(priceNumber)) {
                return response.status(400).json({ error: "Invalid price" });
            }

            const categoryExists = await knex(dish_categoriesTableName).where({ id: category_id }).first();

            if (!categoryExists) {
                return response.status(400).json({ error: "Category not found" });
            }

            await knex(dishesTableName).insert({
                name,
                description,
                price: priceNumber,
                category_id,
                created_at: new Date().toISOString()
            });

            const ingredientsData = ingredients.map(ingredient => ({
                name: ingredient
            }));

            await knex(ingredientsTableName).insert(ingredientsData);

            response.status(201).json({ message: "Dish successfully registered!" });
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "Error registering dish" });
        }
    }

    async GetOne(request, response) {
        const { id } = request.params;

        try {
            const dish = await knex(dishesTableName).where({ id }).first();

            if (!dish) {
                return response.status(404).json({ error: "Dish not found" });
            }

            const ingredients = await knex(ingredientsTableName)
                .where({ dish_id: id })
                .select("name");

            return response.json({
                ...dish,
                ingredients
            });
        } catch (error) {
            console.error('Error searching for dish:', error);
            response.status(500).json({ error: "Error searching for dish" });
        }
    }
}

module.exports = DishesController;