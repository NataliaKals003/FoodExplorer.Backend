const { Router } = require("express");
const OrdersController = require("../controllers/OrdersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const ordersRoutes = Router();
const ordersController = new OrdersController();

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.post("/", ordersController.create);
ordersRoutes.put("/", ordersController.update);
ordersRoutes.get("/:id", ordersController.GetOne);
ordersRoutes.get("/", ordersController.GetAll);
ordersRoutes.delete("/:id", ordersController.delete);

module.exports = ordersRoutes;