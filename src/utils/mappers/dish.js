// utils/dishUtils.js
require("dotenv/config");

const BASE_URL = process.env.BASE_URL;

const mapDishToFrontend = (databaseDish) => ({
  id: databaseDish.id,
  name: databaseDish.name,
  description: databaseDish.description,
  image: `${BASE_URL}/files/${databaseDish.dish_image}`,
  price: databaseDish.price,
  categoryId: databaseDish.category_id,
});

module.exports = {
  mapDishToFrontend,
};
