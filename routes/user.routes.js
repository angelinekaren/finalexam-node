const express = require("express");
const router = express.Router();

const {
  UserSignup,
  storeFavorites,
  UserLogin,
  getUsers,
  deleteUser,
} = require("../controller/user.controller");

const { requireSignIn } = require("../middleware/authVerify");

router.post("/signup", UserSignup);
router.post("/login", UserLogin);
router.post("/favorites/:id", requireSignIn, storeFavorites);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

module.exports = router;
