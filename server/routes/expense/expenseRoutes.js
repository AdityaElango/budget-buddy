const express = require("express");
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

expenseRoute.post("/", createExpCtrl);
expenseRoute.get("/", fetchAllExpCtrl);
expenseRoute.get("/user/:userid", userExpCtrl);
expenseRoute.get("/user/:userid/:cat", usercatExpCtrl);
expenseRoute.get("/useracc/:userid/:acc", useraccExpCtrl);
expenseRoute.get("/:id", fetchExpDetailsCtrl);
expenseRoute.put("/:id", updateExpCtrl);
expenseRoute.delete("/:id", deleteExpCtrl);

module.exports = expenseRoute;
