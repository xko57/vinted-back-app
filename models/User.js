const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String,
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
