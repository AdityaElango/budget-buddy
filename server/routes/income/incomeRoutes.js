const express = require("express");
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

incomeRoute.post("/", createIncCtrl);
incomeRoute.get("/", fetchAllIncCtrl);
incomeRoute.get("/:id", fetchIncDetailsCtrl);
incomeRoute.put("/:id", updateIncCtrl);
incomeRoute.get("/user/:userid", userIncCtrl);
incomeRoute.get("/useracc/:userid/:acc", useraccIncCtrl);
incomeRoute.delete("/:id", deleteIncCtrl);

module.exports = incomeRoute;
