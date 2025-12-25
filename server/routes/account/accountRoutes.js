const express = require("express");
const {createAccCtrl, fetchAllAccCtrl,fetchAccDetailsCtrl , updateAccCtrl, deleteAccCtrl} = require("../../controllers/account/accountCtrl");

const accountRoute = express.Router();


accountRoute.post("/",createAccCtrl);
accountRoute.get("/",fetchAllAccCtrl);
accountRoute.get("/:id",fetchAccDetailsCtrl);
accountRoute.put("/:id",updateAccCtrl);
accountRoute.delete("/:id",deleteAccCtrl);


module.exports = accountRoute;