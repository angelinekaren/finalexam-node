const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

dotenv.config();

// Sign Up user
const UserSignup = async (req, res) => {
  // Get request body
  const { fullname, username, email, password } = req.body;

  try {
    User.findOne({ $or: [{ email: email }, { username: username }] })
      .then((user) => {
        if (user) {
          let errors = "";
          // Check for duplicate
          if (user.username == username) {
            errors = "Username is already in use!";
          } else {
            errors = "Email is already in use!";
          }
          return res.status(400).json({ message: errors });
        } else {
          // Hashed the password
          bcrypt.hash(password, 10).then(async (hashedPswd) => {
            await User.create({
              fullname: fullname,
              username: username,
              email: email,
              password: hashedPswd,
            }).then((newUser) => {
              return res.status(201).json({
                newUser,
                message: `Hi, ${username}! Your account has successfully created~`,
              });
            });
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({
          error: err,
        });
      });
  } catch (err) {
    return res.status(500).json({ message: "Sign up failed!", error: err });
  }
};

/*
/api/signup
Request Body:
{
    "fullname": "angeline karen",
    "username": "angelinekaren",
    "email": "angrybird2909@gmail.com",
    "password": "kar123"
}
Response Body:
STATUS: 201
{
    "newUser": {
        "fullname": "angeline karen",
        "username": "angelinekaren",
        "email": "angrybird2909@gmail.com",
        "password": "$2a$10$bkdCs0frhKLbDMpiekZEgeHVA/yczyq1hCahigzJcKXWvB6Jw2yVG",
        "favorites": [],
        "recentlyviewed": [],
        "orderHistory": [],
        "_id": "62bb17c41312621402c5bb2b",
        "__v": 0
    },
    "message": "Hi, angelinekaren! Your account has successfully created~"
}
*/

// Login
const UserLogin = async (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    if (!user) {
      return res.status(404).json({
        message: "Authentication failed! Invalid user",
      });
    }
    // Check if the password matched
    var passwordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordValid) {
      // Unauthorized
      return res.status(401).json({
        message: "Invalid password",
      });
    }
    // Create jwt token
    var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(201).json({
      message: "User successfully logged in!",
      user,
      accessToken: token,
    });
  });
};

/*
/api/login
Request Body:
{
    "email": "angrybird2909@gmail.com",
    "password": "kar123"
}
Response Body:
STATUS: 201
{
    "message": "User successfully logged in!",
    "user": {
        "_id": "62bb17c41312621402c5bb2b",
        "fullname": "angeline karen",
        "username": "angelinekaren",
        "email": "angrybird2909@gmail.com",
        "password": "$2a$10$bkdCs0frhKLbDMpiekZEgeHVA/yczyq1hCahigzJcKXWvB6Jw2yVG",
        "favorites": [],
        "recentlyviewed": [],
        "orderHistory": [],
        "__v": 0
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYmIxN2M0MTMxMjYyMTQwMmM1YmIyYiIsImlhdCI6MTY1NjQyODkwMywiZXhwIjoxNjU2NDM2MTAzfQ.7CdYh8QldO9wo5ivzrBDqCjmbfYQ7T0IRsN1B3qYols"
}
*/

// Store favorites (need to sign in)
const storeFavorites = async (req, res) => {
  try {
    // Find the user by userId from jwt token
    const user = await User.findById(req.userId);
    if (user) {
      // Push product Id to User's favorites
      user.favorites.push(req.params.id);
      await user.save();
      return res.status(201).json({
        message: "Successfully added",
      });
    } else {
      return res.status(404).json({ message: "Product Not Found!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong with the server!" });
  }
};

/*
/api/favorites/<productId>
Request Body: None
Response Body:
STATUS: 201
{
    "message": "Successfully added"
}
*/

const getUsers = async (req, res) => {
  try {
    await User.find().then((users) => {
      if (!users) {
        return res.status(404).json({ message: "Users not found!" });
      } else {
        return res.status(201).json({ users });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong with the server!" });
  }
};

/*
/api/users
Request Body:
Response Body:
STATUS: 201
{
    "users": [
        {
            "_id": "62bb17c41312621402c5bb2b",
            "fullname": "angeline karen",
            "username": "angelinekaren",
            "email": "angrybird2909@gmail.com",
            "password": "$2a$10$bkdCs0frhKLbDMpiekZEgeHVA/yczyq1hCahigzJcKXWvB6Jw2yVG",
            "favorites": [
                "62bb19dbbdd00e47980e36b0"
            ],
            "recentlyviewed": [],
            "orderHistory": [],
            "__v": 1
        }
    ]
}
*/

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id).then(() => {
      return res.status(201).json({ message: "User is successfully deleted!" });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong with the server!" });
  }
};

/*
/api/users/<id>
Request Body: 
Response Body: 
STATUS: 201
{
    message: "User is successfully deleted!"
}
*/

module.exports = {
  UserSignup,
  UserLogin,
  storeFavorites,
  getUsers,
  deleteUser,
};
