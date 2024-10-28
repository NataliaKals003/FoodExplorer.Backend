const { Router } = require("express");
const FavouritesController = require("../controllers/FavouritesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const favouritesRoutes = Router();
const favouritesController = new FavouritesController();

favouritesRoutes.use(ensureAuthenticated);

favouritesRoutes.post("/", favouritesController.create);
favouritesRoutes.delete("/:dishId", favouritesController.delete);
favouritesRoutes.get("/", favouritesController.getAll);

module.exports = favouritesRoutes;
