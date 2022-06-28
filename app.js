const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", userRoutes);
app.use("/api/product", productRoutes);

module.exports = app;
