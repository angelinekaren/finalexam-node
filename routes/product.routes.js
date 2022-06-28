const express = require("express");
const router = express.Router();

const { AddProduct } = require("../controller/product.controller");

router.post("/addProduct", AddProduct);

module.exports = router;
