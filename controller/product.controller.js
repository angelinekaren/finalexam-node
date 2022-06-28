const { Product } = require("../model/product.model");

const AddProduct = asyncHandler(async (req, res) => {
  try {
    const { productName, price, description } = req.body;
    let userId = req.userId;

    await Product.create({
      productName: productName,
      price: price,
      description: description,
      userId: userId,
    }).then((result) => {
      return res.status(201).json({
        message: `Succesfully posted`,
        result,
      });
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = {
  AddProduct,
};
