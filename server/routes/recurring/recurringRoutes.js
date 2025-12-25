const express = require("express");
const router = express.Router();
const recurringCtrl = require("../../controllers/recurring/recurringCtrl");

// Get all recurring for a user
router.get("/user/:userId", recurringCtrl.getAllRecurring);

// Create new recurring transaction
router.post("/", recurringCtrl.createRecurring);

// Update recurring transaction (toggle active status)
router.patch("/:id", recurringCtrl.updateRecurring);

// Delete recurring transaction
router.delete("/:id", recurringCtrl.deleteRecurring);

module.exports = router;
