const { Router } = require("express");
const IngredientsController = require("../controllers/IngredientsController");

const ingredientsRoutes = Router();
const ingredientsController = new IngredientsController();

ingredientsRoutes.post("/", ingredientsController.create);
ingredientsRoutes.get("/:dish_id", ingredientsController.getOne);
ingredientsRoutes.get("/", ingredientsController.GetAll);

module.exports = ingredientsRoutes;