const express = require("express");
const router = express.Router();

const {
  AddProduct,
  getProducts,
  deleteProduct,
} = require("../controller/product.controller");

const { requireSignIn } = require("../middleware/authVerify");

router.post("/addProduct", requireSignIn, AddProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);

module.exports = router;
