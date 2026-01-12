const express = require("express");
const authenticate = require("../../middleware/authenticate");
const router = express.Router();
const recurringCtrl = require("../../controllers/recurring/recurringCtrl");

// Get all recurring for a user
router.get("/user/:userId", authenticate, recurringCtrl.getAllRecurring);

// Create new recurring transaction
router.post("/", authenticate, recurringCtrl.createRecurring);

// Update recurring transaction (toggle active status)
router.patch("/:id", authenticate, recurringCtrl.updateRecurring);

// Delete recurring transaction
router.delete("/:id", authenticate, recurringCtrl.deleteRecurring);

module.exports = router;
