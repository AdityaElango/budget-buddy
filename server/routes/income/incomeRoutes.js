const express = require("express");
const authenticate = require("../../middleware/authenticate");
const {
  createIncCtrl,
  fetchAllIncCtrl,
  fetchIncDetailsCtrl,
  updateIncCtrl,
  deleteIncCtrl,
  useraccIncCtrl,
  userIncCtrl
} = require("../../controllers/income/incomeCtrl");

const incomeRoute = express.Router();

incomeRoute.post("/", authenticate, createIncCtrl);
incomeRoute.get("/", fetchAllIncCtrl);
incomeRoute.get("/:id", fetchIncDetailsCtrl);
incomeRoute.put("/:id", authenticate, updateIncCtrl);
incomeRoute.get("/user/:userid", authenticate, userIncCtrl);
incomeRoute.get("/useracc/:userid/:acc", authenticate, useraccIncCtrl);
incomeRoute.delete("/:id", authenticate, deleteIncCtrl);

module.exports = incomeRoute;
