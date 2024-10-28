// utils/dishUtils.js
require("dotenv/config");

const BASE_URL = process.env.BASE_URL;

const mapOrdersToFrontend = (databaseOrder) => ({
  id: databaseOrder.id,
  status: databaseOrder.status,
  dishes: [
    {
      quantity: databaseOrder.quantity,
      name: databaseOrder.name,
    },
  ],
  dateTime: databaseOrder.created_at,
});

module.exports = {
  mapOrdersToFrontend,
};
