const express = require("express");
const authenticate = require("../../middleware/authenticate");
const {
  createGoalCtrl,
  fetchUserGoalsCtrl,
  updateGoalCtrl,
  deleteGoalCtrl,
} = require("../../controllers/goal/goalCtrl");

const goalRoute = express.Router();

goalRoute.post("/", authenticate, createGoalCtrl);
goalRoute.get("/user/:userid", authenticate, fetchUserGoalsCtrl);
goalRoute.put("/:id", authenticate, updateGoalCtrl);
goalRoute.delete("/:id", authenticate, deleteGoalCtrl);

module.exports = goalRoute;
