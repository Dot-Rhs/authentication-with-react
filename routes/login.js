const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const { comparePassword } = require("../utils");

const router = express.Router();

router.post("/", async function(req, res, next) {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log("user", user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed.  No user found"
      });
    }

    const match = await comparePassword(req.body.password, user.password);
    if (match) {
      const { email, firstName, lastName } = user;
      const data = {
        email,
        firstName,
        lastName
      };

      const token = jwt.sign(
        {
          data
        },
        "superSecret"
      );

      return res.json({
        success: true,
        message: "Authentication successful",
        token
      });
      //req.session.user = user;
      //return res.render("index", { title: "Login successful" });
    }

    return res.status(401).json({
      success: false,
      message: "Login unsuccessful, passwords do not match"
    });
  } catch (err) {
    return res.json({
      error: err
    });
  }
});

module.exports = router;
