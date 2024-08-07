const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class IngredientsController {

    async create(request, response) {
        const { user_id, dish_id } = request.body;

        try {
            const dishExists = await knex("dishes").where({ id: dish_id }).first();
            const userExists = await knex("users").where({ id: user_id }).first();

            if (!dishExists) {
                return response.status(404).json({ error: "Prato não encontrado" });
            }

            if (!userExists) {
                return response.status(404).json({ error: "Usuário não encontrado" });
            }

            const favouriteExists = await knex("favourites")
                .where({ user_id, dish_id })
                .first();

            if (favouriteExists) {
                return response.status(400).json({ error: "Prato já está nos favoritos" });
            }

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

    async delete(request, response) {

        const { user_id, dish_id } = request.body;

        try {
            const result = await knex("favourites")
                .where({ user_id, dish_id })
                .del();

            if (result === 0) {
                return response.status(404).json({ error: "Favorito não encontrado" });
            }

            return response.status(200).json({ message: "Prato removido dos favoritos com sucesso!" });

        } catch (error) {
            console.error('Erro ao remover prato dos favoritos:', error);
            return response.status(500).json({ error: "Erro ao remover prato dos favoritos" });
        }
    }
}

module.exports = IngredientsController;
