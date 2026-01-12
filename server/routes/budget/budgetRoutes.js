const express = require("express");
const authenticate = require("../../middleware/authenticate");
const {
    createBudCtrl, fetchAllBudCtrl,fetchBudDetailsCtrl , updateBudCtrl, deleteBudCtrl,userBudCtrl
} = require("../../controllers/budget/budgetCtrl");

const budgetRoute = express.Router();

budgetRoute.post("/", authenticate, createBudCtrl);
budgetRoute.get("/", fetchAllBudCtrl);
budgetRoute.get("/user/:userid", authenticate, userBudCtrl);
budgetRoute.get("/:id", fetchBudDetailsCtrl);
budgetRoute.put("/:id", authenticate, updateBudCtrl);
budgetRoute.delete("/:id", authenticate, deleteBudCtrl);

module.exports = budgetRoute;
