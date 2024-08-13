const { Router } = require("express");
const CategoriesController = require("../controllers/CategoriesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const categoriesRoutes = Router();
const categoriesController = new CategoriesController();

categoriesRoutes.use(ensureAuthenticated);

categoriesRoutes.get("/", categoriesController.getAll);

module.exports = categoriesRoutes;