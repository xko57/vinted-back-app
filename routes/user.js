const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized connection, check your email and/or password",
      });
    }

    const hashUserLogin = SHA256(password + user.salt).toString(encBase64);

    if (hashUserLogin === user.hash) {
      const token = uid2(16);
      user.token = token;

      await User.updateOne({ token: token });

      return res.status(200).json({
        _id: user._id,
        email: user.email,
        username: user.username,
        newsletter: user.newsletter,
        token: token,
      });
    } else {
      return res.status(401).json({
        message: "Unauthorized connection, check your email and/or password",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password, newsletter } = req.body;

    if (username && email && password && newsletter !== undefined) {
      const userEmail = await User.findOne({ email: email });
      if (userEmail) {
        return res.status(400).json({ message: "email already used" });
      }

      const password = req.body.password;
      const salt = uid2(16);
      const hash = SHA256(password + salt).toString(encBase64);
      const token = uid2(16);

      const newUser = new User({
        email: email,
        username: username,
        password: password,
        newsletter: newsletter,
        salt: salt,
        hash: hash,
        token: token,
      });

      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        newsletter: newsletter,
        token: token,
      });
    }
    return res.status(428).json({ message: "Missing parameters" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
