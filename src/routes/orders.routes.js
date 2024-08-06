const { Router } = require("express");
const OrdersController = require("../controllers/OrdersController");
const OrderDishesController = require("../controllers/OrderDishesController");

const ordersRoutes = Router();
const ordersController = new OrdersController();
const orderDishesController = new OrderDishesController();

ordersRoutes.post("/:user_id", ordersController.create);
ordersRoutes.get("/:id", ordersController.getAll);
ordersRoutes.post("/order-dishes", orderDishesController.Details);

module.exports = ordersRoutes;