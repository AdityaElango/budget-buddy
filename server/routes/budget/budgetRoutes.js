const express = require("express");
const {
    createBudCtrl, fetchAllBudCtrl,fetchBudDetailsCtrl , updateBudCtrl, deleteBudCtrl,userBudCtrl
} = require("../../controllers/budget/budgetCtrl");

const budgetRoute = express.Router();

budgetRoute.post("/", createBudCtrl);
budgetRoute.get("/", fetchAllBudCtrl);
budgetRoute.get("/user/:userid", userBudCtrl);
budgetRoute.get("/:id", fetchBudDetailsCtrl);
budgetRoute.put("/:id", updateBudCtrl);
budgetRoute.delete("/:id", deleteBudCtrl);

module.exports = budgetRoute;
