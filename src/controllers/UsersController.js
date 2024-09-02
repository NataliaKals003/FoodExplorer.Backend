const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const UserRepository = require("../repositories/UserRepository");
const { hash, compare } = require("bcryptjs");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const userRepository = new UserRepository();

    const userWithEmail = await userRepository.findByEmail(email);
    if (userWithEmail != null) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await userRepository.create({ name, email, password: hashedPassword });

    return response.status(201).json();
  }

  async delete(request, response) {
    try {
      const user_id = request.user.id;

      const userRepository = new UserRepository();

      await userRepository.delete({ user_id });

      response.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      response.status(500).json({ error: "Error deleting user" });
    }
  }
}

module.exports = UsersController;
