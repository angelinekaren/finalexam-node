const express = require("express");
const router = express.Router();

const { UserSignup, storeFavorites } = require("../controller/user.controller");

router.post("/signup", UserSignup);
router.post("/favorites", storeFavorites);

module.exports = router;
