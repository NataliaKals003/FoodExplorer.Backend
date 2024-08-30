const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
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

class DishesController {
  async create(request, response) {
    try {
      const { name, description, price, categoryId } = request.body;
      const ingredients = request.body.ingredients.split(",");
      const imageFile = request.file;

      const diskStorage = new DiskStorage();

      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber)) {
        return response.status(400).json({ error: "Invalid price" });
      }

      const categoryExists = await knex("dish_categories")
        .where({ id: categoryId })
        .first();
      if (!categoryExists) {
        return response.status(400).json({ error: "Category not found" });
      }

      const imageFileName = imageFile
        ? await diskStorage.saveFile(imageFile)
        : null;

      const [dish] = await knex(dishesTableName)
        .insert({
          name: name,
          description: description,
          price: priceNumber,
          category_id: categoryId,
          dish_image: imageFileName,
          created_at: new Date().toISOString(),
        })
        .returning(["id"]);

      const dishId = dish.id;

      if (!dishId) {
        return response.status(500).json({ error: "Dish ID not returned" });
      }

      const dishExists = await knex(dishesTableName)
        .where({ id: dishId })
        .first();
      if (!dishExists) {
        return response
          .status(500)
          .json({ error: "Dish not found after insertion" });
      }

      const ingredientsData = ingredients.map((ingredient) => ({
        dish_id: dishId,
        name: ingredient,
      }));

      await knex("ingredients").insert(ingredientsData);

      response.status(201).json({ message: "Dish successfully registered!" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Error registering dish" });
    }
  }

  async update(request, response) {
    const { name, description, price, categoryId } = request.body;
    const { id } = request.params;
    const newImageFile = request.file;
    const ingredients = request.body.ingredients.split(",");

    const diskStorage = new DiskStorage();

    try {
      const existingDish = await knex(dishesTableName).where({ id }).first();
      if (!existingDish) {
        return response.status(404).json({ error: "Dish not found" });
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

      await knex.transaction(async (knex) => {
        await knex(dishesTableName).where({ id }).update({
          name: name,
          dish_image: imageName,
          price: priceNumber,
          description: description,
          category_id: categoryId,
          updated_at: new Date().toISOString(),
        });

        await knex("ingredients").where({ dish_id: id }).del();

        const ingredientsData = ingredients.map((ingredientName) => ({
          dish_id: id,
          name: ingredientName,
        }));

        await knex("ingredients").insert(ingredientsData);
      });

      return response
        .status(200)
        .json({ message: "Dish updated successfully" });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  async getOne(request, response) {
    const { id } = request.params;
    try {
      const dish = await knex(dishesTableName).where({ id }).first();
      if (!dish) {
        return response.status(404).json({ error: "Dish not found" });
      }

      const frontendDish = mapDishToFrontend(dish);
      console.log("dish", frontendDish);

      const ingredients = await knex("ingredients")
        .where({ dish_id: id })
        .select("name");

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
      const dishes = await knex(dishesTableName).select(
        "id",
        "name",
        "description",
        "dish_image",
        "price",
        "category_id"
      );

      const ingredients = await knex("ingredients").select("dish_id", "name");

      // console.log('Dishes:', dishes);
      // console.log('Ingredients:', ingredients);

      const dishesWithIngredients = dishes.map((dish) => {
        const frontendDish = mapDishToFrontend(dish);

        const dishIngredients = ingredients
          .filter((ingredient) => ingredient.dish_id === dish.id)
          .map((ingredient) => ingredient.name); // Assuming you want an array of ingredient names

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
      const result = await knex(dishesTableName).where({ id }).del();

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
