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

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    fname,
    email,
    password: hashedPassword,
  });

  const user = await newUser.save();

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
    { _id: user._id, id: user._id }, // Include both _id and id for compatibility
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

// ================= DELETE USER (for testing/cleanup) =================
const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOneAndDelete({ email });
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    status: 200,
    message: "User deleted successfully",
  });
});

module.exports = { signupCtrl, loginCtrl, deleteUserCtrl };
