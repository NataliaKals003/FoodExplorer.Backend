const { Router } = require("express");

const usersRoutes = require("./users.routes")
const ordersRoutes = require("./orders.routes")
const dishesRoutes = require("./dishes.routes")
const ingredientsRoutes = require("./ingredients.routes")
const categoriesRoutes = require("./categories.routes")
const favouritesRoutes = require("./favourites.routes")

const routes = Router();
routes.use("/users", usersRoutes);
routes.use("/orders", ordersRoutes);
routes.use("/dishes", dishesRoutes);
routes.use("/ingredients", ingredientsRoutes);
routes.use("/categories", categoriesRoutes);
routes.use("/favourites", favouritesRoutes);

module.exports = routes;