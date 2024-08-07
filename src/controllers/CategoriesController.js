const knex = require("../database/knex");

class CategoriesController {
    // async create(request, response) {
    //     const { name } = request.body;

    //     try {
    //         const [id] = await knex("dish_categories").insert({
    //             name
    //         });

    //         response.status(201).json({ message: "Categoria criando com sucesso!" });
    //     } catch (error) {
    //         console.error('Erro ao criar categoria:', error);
    //         response.status(500).json({ error: "Erro ao criar categoria" });
    //     }
    // }

    // async getOne(request, response) {
    //     const { dish_id } = request.params;

    //     try {
    //         const ingredients = await knex("ingredients").where({ dish_id });

    //         response.json({ ingredients });
    //     } catch (error) {
    //         console.error('Erro ao buscar ingredientes:', error);
    //         response.status(500).json({ error: "Erro ao buscar ingredientes" });
    //     }
    // }

    async GetAll(request, response) {
        const { name } = request.query;

        const categories = await knex("dish_categories")
            .whereLike("name", `%${name}%`)

        return response.json(categories)
    }
}

module.exports = CategoriesController;
