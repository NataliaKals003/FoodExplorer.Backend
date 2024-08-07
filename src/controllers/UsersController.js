const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const { hash, compare } = require("bcryptjs");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const database = await sqliteConnection();
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (checkUserExists) {
            throw new AppError("Este email ja esta em uso");
        }

        const hashedPassword = await hash(password, 8);

        await database.run("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, new Date().toISOString()]);

        return response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body
        const { id } = request.params;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

        if (!user) {
            throw new AppError("Usuário nao enontrado");
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = ?", [email]);

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Este email ja esta em uso");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError("Digite a sua ultima senha")
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if (!checkOldPassword) {
                throw new AppError("A senha antiga nao confere!")
            }

            user.password = await hash(password, 8);
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = ?
            WHERE id = ?`,
            [user.name, user.email, user.password, new Date().toISOString(), id]
        )

        return response.status(200).json({ message: "Usuário atualizado com sucesso" });

        // const userRepository = new UserRepository();
        // const userService = new UserService(userRepository);
        // await userService.update({ user_id, name, email, password, old_password });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("users").where({ id }).delete();

        return response.json();
    }
}

module.exports = UsersController;