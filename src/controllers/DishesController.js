const knex = require('../database/knex');

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

            await knex("dishes").insert({
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

    async GetOne(request, response) {
        const { id } = request.params;

        try {
            const dish = await knex("dishes").where({ id }).first();

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

    async update(request, response) {
        const { name, description, price, category_id, ingredients } = request.body;
        const { id } = request.params;

        try {
            const PriceNumber = parseFloat(price);

            if (isNaN(PriceNumber)) {
                return response.status(400).json({ error: "Invalid price" });
            }

            await knex.transaction(async trx => {
                // Update dish
                await trx("dishes")
                    .where({ id })
                    .update({
                        name,
                        price: PriceNumber,
                        description,
                        category_id,
                        updated_at: new Date().toISOString()
                    });

                const dishExists = await trx("dishes").where({ id }).first();
                if (!dishExists) {
                    return response.status(404).json({ error: "Dish not found" });
                }

                await trx("ingredients").where({ dish_id: id }).del();

                // Insert new ingredients
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
}

module.exports = DishesController;