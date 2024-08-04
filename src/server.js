const express = require('express');

const routes = require("./routes/index");

const app = express();
app.use(express.json());
app.use(routes)

const PORT = 2222;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


