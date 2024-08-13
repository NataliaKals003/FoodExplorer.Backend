const knex = require('../database/knex');
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

const DishesTableName = "dishes";

class DishImageController {
    async update(request, response) {
        const { id } = request.params;
        console.log(`request: ${request}`)
        const dishImageFilename = request.file.filename;

        const diskStorage = new DiskStorage();

        const dish = await knex(DishesTableName)
            .where('id', id).first();

        if (!dish) {
            throw new AppError("Dish not found")
        }

        if (dish.dishImg) {
            await diskStorage.deleteFile(dish.dishImg);
        }

        const filename = await diskStorage.saveFile(dishImageFilename);
        dish.dishImg = filename;

        await knex(DishesTableName).where('id', id).update({ dishImg: filename });

        return response.json({ ...dish, dishImg: filename });
    }
}

module.exports = DishImageController;