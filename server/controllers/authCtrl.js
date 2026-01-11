const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// ================= SIGNUP =================
const signupCtrl = expressAsyncHandler(async (req, res) => {
  const { fname, email, password, cpassword } = req.body;

  if (!fname || !email || !password || !cpassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== cpassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({
    fname,
    email,
    password: password,
  });

  res.status(201).json({
    status: 201,
    message: "Signup successful",
    user: {
      id: user._id,
      fname: user.fname,
      email: user.email,
    },
  });
});

// ================= LOGIN =================
const loginCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    status: 201,
    result: {
      token,
      userValid: {
        id: user._id,
        fname: user.fname,
        email: user.email,
      },
    },
  });
});

module.exports = { signupCtrl, loginCtrl };
