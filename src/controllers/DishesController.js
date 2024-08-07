const knex = require("../database/knex");

class DishesController {
    async create(request, response) {
        try {
            const { name, description, price, category_id, ingredients } = request.body;
            const priceNumber = parseFloat(price);

            if (isNaN(priceNumber)) {
                return response.status(400).json({ error: "Preço inválido" });
            }

            const categoryExists = await knex("dish_categories").where({ id: category_id }).first();

            if (!categoryExists) {
                return response.status(400).json({ error: "Categoria não encontrada" });
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

            response.status(201).json({ message: "Prato cadastrado com sucesso!" });
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "Erro ao cadastrar prato" });
        }
    }

    async GetOne(request, response) {
        const { id } = request.params;

        try {
            const dish = await knex("dishes").where({ id }).first();

            if (!dish) {
                return response.status(404).json({ error: "Prato não encontrado" });
            }

            const ingredients = await knex("ingredients")
                .where({ dish_id: id })
                .select("name");

            return response.json({
                ...dish,
                ingredients
            });
        } catch (error) {
            console.error('Erro ao buscar prato:', error);
            response.status(500).json({ error: "Erro ao buscar prato" });
        }
    }

    // async GetAll(request, response) {
    //     const { name, ingredients } = request.query;

    //     let dishes;

    //     if(ingredients) {
    //         const filterIngredients = ingredients.split(',').map( ingredient => ingredient.trim())

    //         dishes = await knex("ingredients")
    //         .whereIn("name", filterIngredients)

    //     }else {
    //         dishes = await knex("dishes")
    //             .whereLike("name", `%${name}%`)
    //     }



    //     return response.json(dishes)
    // }


}

module.exports = DishesController;