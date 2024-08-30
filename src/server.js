require("express-async-errors");

const AppError = require("./utils/AppError");
const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const uploadConfig = require("./configs/upload");
require("dotenv/config");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal serer error",
  });
});

const PORT = process.env.PORT || 2222;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
