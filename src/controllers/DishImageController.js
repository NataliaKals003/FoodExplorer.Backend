const knex = require('../database/knex');
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

const dishesTableName = "dishes";

class DishImageController {
    async update(request, response) {
        const { id } = request.params;
        // console.log(`request: ${request}`)
        const dishImageFilename = request.file.filename;

        const diskStorage = new DiskStorage();

        const dish = await knex(dishesTableName)
            .where('id', id).first();

        if (!dish) {
            throw new AppError("Dish not found")
        }

        if (dish.dish_image) {
            await diskStorage.deleteFile(dish.dish_image);
        }

        const filename = await diskStorage.saveFile(dishImageFilename);
        dish.dish_image = filename;

        await knex(dishesTableName).where('id', id).update({ dish_image: filename });

        return response.json({ ...dish, dish_image: filename });
    }
}

module.exports = DishImageController;