const Product = require("../model/product.model");

const getProducts = async (req, res) => {
  try {
    await Product.find().then((products) => {
      if (!products) {
        return res.status(404).json({ message: "Product not found!" });
      } else {
        return res.status(201).json({ products });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong with the server!" });
  }
};

/*
/api/product
Request Body: 
Response Body:
STATUS: 201
{
    "products": [
        {
            "_id": "62bb19dbbdd00e47980e36b0",
            "productName": "americano",
            "price": "50.000",
            "description": "bitter sweetness",
            "userId": "62bb17c41312621402c5bb2b",
            "__v": 0
        }
    ]
}
*/

// Add product (users need to sign in first)
const AddProduct = async (req, res) => {
  try {
    // Get the request body
    const { productName, price, description } = req.body;
    // Get user id from token
    let userId = req.userId;
    // Create product
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
};

/*
/api/product/addProduct
Request Body:
{
    "productName": "americano",
    "price": "50.000",
    "description": "bitter sweetness",
}
Response Body: 
STATUS: 201
{
    "message": "Succesfully posted",
    "result": {
        "productName": "americano",
        "price": "50.000",
        "description": "bitter sweetness",
        "userId": "62bb17c41312621402c5bb2b",
        "_id": "62bb19dbbdd00e47980e36b0",
        "__v": 0
    }
}
*/

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id).then(() => {
      return res
        .status(201)
        .json({ message: "Product is successfully deleted!" });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong with the server!" });
  }
};

/*
/api/product/<productId>
Request Body:
Response Body:
STATUS: 201
{
    "message": "Product is successfully deleted!"
}
*/

module.exports = {
  AddProduct,
  getProducts,
  deleteProduct,
};
