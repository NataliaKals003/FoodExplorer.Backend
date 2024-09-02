const knex = require("../database/knex");
const AppError = require("../utils/AppError");

const DiskStorage = require("../providers/DiskStorage");
const DishRepository = require("../repositories/DishRepository");
const CategoryRepository = require("../repositories/CategoryRepository");
const IngredientRepository = require("../repositories/IngredientRepository");
require("dotenv/config");

const dishesTableName = "dishes";
const BASE_URL = process.env.BASE_URL;

const mapDishToFrontend = (databaseDish) => ({
  id: databaseDish.id,
  name: databaseDish.name,
  description: databaseDish.description,
  image: `${BASE_URL}/files/${databaseDish.dish_image}`,
  price: databaseDish.price,
  categoryId: databaseDish.category_id,
});

const diskStorage = new DiskStorage();
const dishRepository = new DishRepository();
const categoryRepository = new CategoryRepository();
const ingredientRepository = new IngredientRepository();

class DishesController {
  async create(request, response) {
    try {
      const { name, description, price, categoryId } = request.body;
      const ingredients = request.body.ingredients.split(",");

      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber)) {
        return response.status(400).json({ error: "Invalid price" });
      }

      const existingCategory = await categoryRepository.find(categoryId);
      if (existingCategory == null) {
        return response.status(400).json({ error: "Category not found" });
      }

      let imageFileName = null;
      if (request.file != null) {
        imageFileName = await diskStorage.saveFile(request.file);
      }

      const newDish = {
        name: name,
        description: description,
        price: priceNumber,
        categoryId: categoryId,
        imageFileName: imageFileName,
      };

      const dish = await dishRepository.create(newDish);

      if (dish.id == null) {
        return response.status(500).json({ error: "Dish not created" });
      }

      await ingredientRepository.create(dish.id, ingredients);

      response.status(201).json({ message: "Dish successfully registered!" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Error registering dish" });
    }
  }

  async update(request, response) {
    const { name, description, price, categoryId } = request.body;
    const id = request.params.id;
    const newImageFile = request.file;
    const ingredients = request.body.ingredients.split(",");

    const diskStorage = new DiskStorage();

    try {
      const existingDish = await dishRepository.find(id);
      if (!existingDish) {
        throw new AppError("Dish not found");
      }

      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber)) {
        return response.status(400).json({ error: "Invalid price" });
      }

      let imageName;

      // If a new image is provided
      if (newImageFile) {
        // Delete the existing image if there is one
        if (existingDish.dish_image) {
          await diskStorage.deleteFile(existingDish.dish_image);
        }
        // Save the new image and set the imageName to the new image's filename
        await diskStorage.saveFile(newImageFile);
        imageName = newImageFile.filename;
      } else {
        // If no new image is provided, keep the existing image
        imageName = existingDish.dish_image;
      }

      const updateDish = {
        name: name,
        description: description,
        price: priceNumber,
        categoryId: categoryId,
        imageName: imageName,
        dishId: id,
      };

      await dishRepository.update(updateDish);
      await ingredientRepository.delete(id);
      await ingredientRepository.create(id, ingredients);

      return response
        .status(200)
        .json({ message: "Dish updated successfully" });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  async getOne(request, response) {
    const id = request.params.id;
    try {
      const existingDish = await dishRepository.find(id);
      if (!existingDish) {
        throw new AppError("Dish not found");
      }

      const frontendDish = mapDishToFrontend(existingDish);

      const ingredients = await ingredientRepository.getIngredientById(id);

      const ingredientsNames = ingredients.map((ingredient) => ingredient.name);

      return response.json({
        ...frontendDish,
        ingredients: ingredientsNames,
      });
    } catch (error) {
      console.error("Error searching for dish:", error);
      response.status(500).json({ error: "Error searching for dish" });
    }
  }

  async getAll(request, response) {
    try {
      const dishes = await dishRepository.getAll();

      const ingredients = await ingredientRepository.getAll();

      const dishesWithIngredients = dishes.map((dish) => {
        const frontendDish = mapDishToFrontend(dish);

        const dishIngredients = ingredients
          .filter((ingredient) => ingredient.dish_id === dish.id)
          .map((ingredient) => ingredient.name);

        return {
          ...frontendDish,
          ingredients: dishIngredients,
        };
      });

      return response.json(dishesWithIngredients);
    } catch (error) {
      console.error("Error fetching dishes:", error);
      return response.status(500).json({ error: "Error fetching dishes" });
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    try {
      const result = await dishRepository.delete(id);

      if (result === 0) {
        return response.status(404).json({ error: "Dish not found" });
      }

      return response
        .status(200)
        .json({ message: "Dish successfully removed!" });
    } catch (error) {
      console.error("Error removing dish:", error);
      return response.status(500).json({ error: "Error removing dish" });
    }
  }
}

module.exports = DishesController;
