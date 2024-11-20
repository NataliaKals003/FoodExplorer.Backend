// utils/dishUtils.js
require("dotenv/config");
const BASE_URL = process.env.BASE_URL;

const mapOrdersToFrontend = (databaseOrderWithDishes) => {
  var dishes = [];
  var totalPrice = 0;

  databaseOrderWithDishes.forEach((item) => {
    totalPrice += item.quantity * item.price;
    dishes.push({
      dishId: item.dish_id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      image: `${BASE_URL}/files/${item.dish_image}`,
    });
  });

  console.log("totalPrice", totalPrice);
  totalPrice = parseFloat(totalPrice.toFixed(2));

  return {
    id: databaseOrderWithDishes[0].id,
    status: databaseOrderWithDishes[0].status,
    dateTime: databaseOrderWithDishes[0].created_at,
    dishes: dishes,
    totalPrice: totalPrice,
  };
};

module.exports = {
  mapOrdersToFrontend,
};
