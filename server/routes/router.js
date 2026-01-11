const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate")
const { signupCtrl, loginCtrl, deleteUserCtrl } = require("../controllers/authCtrl");


//for user registration
// AUTH ROUTES
router.post("/signup", signupCtrl);
router.post("/login", loginCtrl);
router.delete("/delete-user", deleteUserCtrl); // Temporary cleanup endpoint

router.get("/validuser",authenticate,async(req,res)=>{
     try{
          const ValidUserOne = await userdb.findOne({_id:req.userId});
          return res.status(201).json({status:201,ValidUserOne});
     }catch(error){
          return res.status(401).json({status:401,error});
     }
}) 

// Logout endpoint
router.post("/logout", authenticate, async(req, res) => {
     try {
          res.clearCookie("usercookie");
          return res.status(201).json({status: 201, message: "Logged out successfully"});
     } catch(error) {
          return res.status(500).json({status: 500, error: "Logout failed"});
     }
});

// Financial Health Score
router.get("/health-score", authenticate, async(req, res) => {
     try {
          const { month, year } = req.query;
          
          if (!month || !year) {
               return res.status(400).json({error: "Month and year are required"});
          }

          const { calculateFinancialHealth } = require("../utils/healthScoreCalc");
          const healthData = await calculateFinancialHealth(req.userId, parseInt(month), parseInt(year));
          
          return res.status(201).json({status: 201, ...healthData});
     } catch(error) {
          console.error("Health score error:", error);
          return res.status(500).json({error: error.message || "Error calculating health score"});
     }
});

const incomeRoute = require("./income/incomeRoutes");

router.use("/income",incomeRoute);

const expenseRoute = require("./expense/expenseRoutes");

router.use("/expense",expenseRoute);

const accountRoute = require("./account/accountRoutes");

router.use("/account",accountRoute);

const budgetRoute = require("./budget/budgetRoutes");

router.use("/budget",budgetRoute);

const recurringRoute = require("./recurring/recurringRoutes");

router.use("/recurring",recurringRoute);

// Update user profile
router.put("/updateuser/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { fname, lname, email, phone } = req.body;

    // Validate required fields
    if (!fname || !email) {
      return res.status(422).json({ message: "First name and email are required" });
    }

    // Check if email is being changed to an existing email
    const existingUser = await userdb.findOne({ email: email, _id: { $ne: id } });
    if (existingUser) {
      return res.status(422).json({ message: "This email is already in use" });
    }

    // Update user
    const updatedUser = await userdb.findByIdAndUpdate(
      id,
      { fname, lname, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      status: 200, 
      message: "Profile updated successfully",
      ValidUserOne: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error updating profile" });
  }
});

module.exports = router;