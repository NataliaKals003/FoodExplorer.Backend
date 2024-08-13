const knex = require('../database/knex');

const dishesTableName = "dishes";

class DishesController {
    async create(request, response) {
        try {
            const { name, description, price, category_id, ingredients } = request.body;
            const priceNumber = parseFloat(price);

            if (isNaN(priceNumber)) {
                return response.status(400).json({ error: "Invalid price" });
            }

            const categoryExists = await knex("dish_categories").where({ id: category_id }).first();

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

            await knex("ingredients").insert(ingredientsData);

            response.status(201).json({ message: "Dish successfully registered!" });
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "Error registering dish" });
        }
    }

    async update(request, response) {
        const { name, description, price, category_id, ingredients } = request.body;
        const { id } = request.params;

        try {
            const priceNumber = parseFloat(price);

            if (isNaN(priceNumber)) {
                return response.status(400).json({ error: "Invalid price" });
            }

            const dishExists = await trx(dishesTableName).where({ id }).first();
            if (!dishExists) {
                return response.status(404).json({ error: "Dish not found" });
            }

            await knex.transaction(async trx => {
                await trx(dishesTableName)
                    .where({ id })
                    .update({
                        name,
                        price: priceNumber,
                        description,
                        category_id,
                        updated_at: new Date().toISOString()
                    });

                await trx("ingredients").where({ dish_id: id }).del();

                const ingredientRecords = ingredients.map(ingredient => ({
                    dish_id: id,
                    name: ingredient
                }));
                await trx("ingredients").insert(ingredientRecords);
            });

            return response.status(200).json({ message: "Dish updated successfully" });

        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal server error" });
        }
    }

    async getOne(request, response) {
        const { id } = request.params;

        try {
            const dish = await knex(dishesTableName).where({ id }).first();

            if (!dish) {
                return response.status(404).json({ error: "Dish not found" });
            }

            const ingredients = await knex("ingredients")
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

    async getAll(request, response) {
        try {
            const dishes = await knex(dishesTableName)
                .select('*');

            const ingredients = await knex("ingredients")
                .select('*');

            const dishesWithIngredients = dishes.map(dish => {
                const dishIngredients = ingredients.filter(ingredient => ingredient.dish_id === dish.id);
                return {
                    ...dish,
                    ingredients: dishIngredients
                };
            });

            return response.json(dishesWithIngredients);

        } catch (error) {
            console.error('Error fetching dishes:', error);
            return response.status(500).json({ error: "Error fetching dishes" });
        }
    }
}

module.exports = DishesController;