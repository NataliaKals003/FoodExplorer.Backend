const { Router } = require("express");
const FavouritesController = require("../controllers/FavouritesController");

const favouritesRoutes = Router();
const favouritesController = new FavouritesController();

favouritesRoutes.post("/", favouritesController.create);
favouritesRoutes.delete("/", favouritesController.delete);

module.exports = favouritesRoutes;