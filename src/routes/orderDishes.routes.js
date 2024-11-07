const { Router } = require("express");
const OrderDishesController = require("../controllers/OrderDishesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const orderDishesRoutes = Router();
const orderDishesController = new OrderDishesController();

orderDishesRoutes.use(ensureAuthenticated);

orderDishesRoutes.post("/", orderDishesController.create);
// orderDishesRoutes.put("/order-dishes", orderDishesController.update);

module.exports = orderDishesRoutes;
