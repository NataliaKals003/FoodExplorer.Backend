const { Router } = require("express");
const multer = require("multer");
const uploadCongig = require("../configs/upload");

const DishesController = require("../controllers/DishesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const dishesRoutes = Router();
const upload = multer(uploadCongig.MULTER);

const dishesController = new DishesController();

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post(
  "/",
  verifyUserAuthorization("admin"),
  upload.single("imageFile"),
  dishesController.create
);
dishesRoutes.put(
  "/:id",
  verifyUserAuthorization("admin"),
  upload.single("imageFile"),
  dishesController.update
);
dishesRoutes.get("/", dishesController.getAll);
dishesRoutes.get("/:id", dishesController.getOne);
dishesRoutes.delete(
  "/:id",
  verifyUserAuthorization("admin"),
  dishesController.delete
);

module.exports = dishesRoutes;
