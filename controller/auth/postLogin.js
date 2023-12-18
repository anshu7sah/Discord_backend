const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
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
      return res.status(200).json({
        userDetails: {
          username: user.username,
          token,
          email: user.email,
        },
      });
    }
    return res.status(400).send("Invalid credentials.Please try again");
  } catch (error) {
    return res.status(500).send("something went wrong. Please try again");
  }
};

module.exports = postLogin;
