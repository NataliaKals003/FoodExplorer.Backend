const { Router } = require("express");
const multer = require("multer");
const uploadCongig = require("../configs/upload");

const DishesController = require("../controllers/DishesController");
const DishesImageController = require("../controllers/DishImageController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const dishesRoutes = Router();
const upload = multer(uploadCongig.MULTER)

const dishesController = new DishesController();
const dishesImageController = new DishesImageController();

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post("/", dishesController.create);
dishesRoutes.get("/:id", dishesController.getOne);
dishesRoutes.patch("/image/:id", upload.single("image"), dishesImageController.update);

module.exports = dishesRoutes;