require("express-async-errors");

const AppError = require("./utils/AppError");
const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const uploadConfig = require("./configs/upload");
require("dotenv/config");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

// Middleware de tratamento de erros
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
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 2222;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
