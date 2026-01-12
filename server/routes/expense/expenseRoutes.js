const express = require("express");
const authenticate = require("../../middleware/authenticate");
const {
  createExpCtrl,
  fetchAllExpCtrl,
  fetchExpDetailsCtrl,
  updateExpCtrl,
  deleteExpCtrl,
  usercatExpCtrl,
  userExpCtrl,
  useraccExpCtrl
} = require("../../controllers/expense/expenseCtrl");

const expenseRoute = express.Router();

expenseRoute.post("/", authenticate, createExpCtrl);
expenseRoute.get("/", fetchAllExpCtrl);
expenseRoute.get("/user/:userid", authenticate, userExpCtrl);
expenseRoute.get("/user/:userid/:cat", authenticate, usercatExpCtrl);
expenseRoute.get("/useracc/:userid/:acc", authenticate, useraccExpCtrl);
expenseRoute.get("/:id", fetchExpDetailsCtrl);
expenseRoute.put("/:id", authenticate, updateExpCtrl);
expenseRoute.delete("/:id", authenticate, deleteExpCtrl);

module.exports = expenseRoute;
