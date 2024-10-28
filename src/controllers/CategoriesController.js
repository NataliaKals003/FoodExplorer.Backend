const CategoryRepository = require("../repositories/CategoryRepository");

const categoryRepository = new CategoryRepository();

class CategoriesController {
  async getAll(request, response) {
    try {
      const categories = await categoryRepository.getAll();
      response.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      response.status(500).json({ error: "Failed to fetch categories" });
    }
  }
}

module.exports = CategoriesController;
