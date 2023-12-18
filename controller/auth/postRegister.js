const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExist = await User.exists({ email });
    if (userExist) {
      return res.status(409).send("Email already in use");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "24h",
      }
    );
    res.status(201).json({
      userDetails: {
        email: user.email,
        token,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).send("Error occured. Please try again");
  }
};

module.exports = postRegister;
