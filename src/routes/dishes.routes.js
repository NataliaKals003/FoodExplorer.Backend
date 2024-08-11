const { Router } = require("express");
const DishesController = require("../controllers/DishesController");

const dishesRoutes = Router();
const dishesController = new DishesController();


dishesRoutes.post("/", dishesController.create);
dishesRoutes.get("/:id", dishesController.GetOne);
dishesRoutes.put("/:id", dishesController.update);

module.exports = dishesRoutes;