const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
