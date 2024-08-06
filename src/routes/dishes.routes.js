const { Router } = require("express");
const DishesController = require("../controllers/DishesController");

const dishesRoutes = Router();
const dishesController = new DishesController();

dishesRoutes.post("/", dishesController.create);
dishesRoutes.get("/:id", dishesController.GetOne);
dishesRoutes.get("/", dishesController.GetAll);

module.exports = dishesRoutes;