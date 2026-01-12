const express = require("express");
const authenticate = require("../../middleware/authenticate");
const {createAccCtrl, fetchAllAccCtrl,fetchAccDetailsCtrl , updateAccCtrl, deleteAccCtrl} = require("../../controllers/account/accountCtrl");

const accountRoute = express.Router();


accountRoute.post("/", authenticate, createAccCtrl);
accountRoute.get("/", fetchAllAccCtrl);
accountRoute.get("/:id", fetchAccDetailsCtrl);
accountRoute.put("/:id", authenticate, updateAccCtrl);
accountRoute.delete("/:id", authenticate, deleteAccCtrl);


module.exports = accountRoute;