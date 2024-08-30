// const knex = require('../database/knex');
// const DiskStorage = require("../providers/DiskStorage");
// const AppError = require("../utils/AppError");

// const dishesTableName = "dishes";

// class DishImageController {
//     async create(request, response) {
//         const { dish_id } = request.body;
//         const imageFile = request.file;

//         const diskStorage = new DiskStorage();
//         // try {
//         //     const dish = await knex(dishesTableName)
//         //         .where({ id: dish_id })
//         //         .first();

//         //     console.log('Recebido:', { imageFile });

//         //     if (!dish) {
//         //         return response.status(404).json({ message: "Dish not found" });
//         //     }

//         //     const filename = await diskStorage.saveFile(imageFile.filename);

//         //     if (dish.image) {
//         //         await diskStorage.deleteFile(dish.image);
//         //     }

//         //     await knex(dishesTableName)
//         //         .update({ image: filename })
//         //         .where({ id: dish_id });

//         //     return response.json({ image: filename });
//         // } catch (error) {
//         //     return response.status(error.status || 500).json({ message: error.message });
//         // }
//     }

//     async update(request, response) {
//         const { id } = request.dish;  // Assuming `request.dish` is set by some middleware
//         const imageFile = request.file.filename;
//         const diskStorage = new DiskStorage();

//         try {
//             const dish = await knex(dishesTableName).where({ id }).first();

//             if (!dish) {
//                 return response.status(404).json({ message: "Dish not found" });
//             }

//             if (dish.image) {
//                 await diskStorage.deleteFile(dish.image);
//             }

//             const filename = await diskStorage.saveFile(imageFile);
//             await knex(dishesTableName).update({ image: filename }).where({ id });

//             return response.json({ image: filename });
//         } catch (error) {
//             return response.status(error.status || 500).json({ message: error.message });
//         }
//     }
// }

// module.exports = new DishImageController();