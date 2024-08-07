const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class IngredientsController {

    async create(request, response) {
        const { user_id, dish_id } = request.body;

        try {
            // Verifica se o prato e o usuário existem antes de adicionar ao favoritos
            const dishExists = await knex("dishes").where({ id: dish_id }).first();
            const userExists = await knex("users").where({ id: user_id }).first();

            if (!dishExists) {
                return response.status(404).json({ error: "Prato não encontrado" });
            }

            if (!userExists) {
                return response.status(404).json({ error: "Usuário não encontrado" });
            }

            // Verifica se o prato já está nos favoritos do usuário
            const favouriteExists = await knex("favourites")
                .where({ user_id, dish_id })
                .first();

            if (favouriteExists) {
                return response.status(400).json({ error: "Prato já está nos favoritos" });
            }

            // Adiciona o prato aos favoritos
            await knex("favourites").insert({
                user_id,
                dish_id
            });

            response.status(201).json({ message: "Prato adicionado aos favoritos com sucesso!" });

        } catch (error) {
            console.error('Erro ao adicionar prato aos favoritos:', error);
            response.status(500).json({ error: "Erro ao adicionar prato aos favoritos" });
        }
    }
}

module.exports = IngredientsController;
