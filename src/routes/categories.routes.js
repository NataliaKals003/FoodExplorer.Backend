const { Router } = require("express");
const CategoriesController = require("../controllers/CategoriesController");

const categoriesRoutes = Router();
const categoriesController = new CategoriesController();

categoriesRoutes.get("/", categoriesController.GetAll);

module.exports = categoriesRoutes;