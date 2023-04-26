const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userModel = require("./models/User");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/systemShareDb");

const User = mongoose.model("User", userModel);

app.get("/", (req, res) => {
  res.json({});
});

// VERIFICAR ERROR
app.post("/user", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  await newUser.save();
});

module.exports = app;
