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

app.post("/user", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.sendStatus(400);
  const user = await User.findOne({ email: email });
  if (user) {
    res.statusCode = 400;
    res.json({ erru: "Email existing, try another one..." });
    return;
  }

  const newUser = new User({
    name,
    email,
    password,
  });

  const result = await newUser.save();
  return res.json({ email: result.email });
});

app.delete("/user/:email", async (req, res) => {
  await User.deleteOne({ email: req.params.email });
  res.sendStatus(200);
});

module.exports = app;
