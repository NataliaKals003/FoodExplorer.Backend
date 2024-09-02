const knex = require("../database/knex");

const usersTableName = "users";

class UserRepository {
  async findByEmail(userEmail) {
    const userWithEmail = await knex(usersTableName)
      .where({
        email: userEmail,
      })
      .first();

    return userWithEmail;
  }

  async create({ name, email, password }) {
    const userId = await knex(usersTableName).insert({
      name,
      email,
      password: password,
    });

    return { id: userId };
  }

  async delete(user_id) {
    await knex(usersTableName).where({ id: user_id }).del();

    return { id };
  }
}

module.exports = UserRepository;
