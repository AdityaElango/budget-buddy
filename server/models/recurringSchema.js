const mongoose = require("mongoose");

const recurringSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["expense", "income"],
    required: true,
  },
  frequency: {
    type: String,
    enum: ["monthly"],
    default: "monthly",
  },
  dayOfMonth: {
    type: Number,
    min: 1,
    max: 31,
    default: 1,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastProcessed: {
    type: Date,
    default: null,
  },
});

const recurringModel = mongoose.model("recurring", recurringSchema);

module.exports = recurringModel;
