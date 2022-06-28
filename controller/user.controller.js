const User = require("../model/user.model");

const UserSignup = async (req, res) => {
  const { fullname, username, email, password } = req.body;

  try {
    User.findOne({ $or: [{ email: email }, { username: username }] })
    .then((user) => {
        if (user) {
            let errors = "";
            if (user.username == username) {
                errors = "Username is already in use!";
            } else {
                errors = "Email is already in use!";
            }
            return res.status(400).json({ message: errors });
        } else {
            await User.create({
                fullname: fullname,
                username: username,
                email: email,
                password: password,
            })
            .then((newUser) => {
                return res.status(201).json({
                    newUser,
                    message: `Hi, ${username}! Your account has successfully created~`,
                  });
            })
        }
    }
    
    ).catch((err) => {
        return res.status(400).json({
            error: err,
          });
    })
  } catch (err) {
    return res.status(500).json({ message: "Sign up failed!", error: err });
  }
};

const storeFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (user) {
            user.favorites.push(req.params.id);
            await user.save()
            
            return res.status(201).json({
                message: "Successfully added",
              });
            } else {
                return res.status(404).json({ message: "Listing Not Found!" });
              }
            } catch (err) {
                return res
                  .status(500)
                  .json({ message: "Something went wrong with the server!" });
              }
}

module.exports = {
    UserSignup,
    storeFavorites,
}