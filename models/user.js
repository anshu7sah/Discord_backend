const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: "string",
  },
  password: {
    type: "string",
  },
  email: {
    type: "string",
    unique: true,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
