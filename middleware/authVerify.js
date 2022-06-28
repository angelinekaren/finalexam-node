const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const requireSignIn = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res
      .status(403)
      .json({ message: "Not authorized! No token provided! " });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized!" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

module.exports = {
  requireSignIn,
};
