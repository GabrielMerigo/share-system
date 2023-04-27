const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const mongoose = require("mongoose");
const userModel = require("./models/User");
const secret = "super-secret-key";

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
    res.json({ error: "Email existing, try another one..." });
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

app.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.statusCode = 403;
    return res.json({ error: "Email not registered" });
  }

  if (user.password !== password) {
    res.statusCode = 403;
    return res.json({ error: "Wrong password" });
  }

  jwt.sign(
    { email, user: user.name, id: user._id },
    secret,
    { expiresIn: "48h" },
    (err, token) => {
      if (err) {
        res.sendStatus(500);
        console.log(err);
      } else {
        res.json({ token: 123 });
      }
    }
  );
});

module.exports = app;
