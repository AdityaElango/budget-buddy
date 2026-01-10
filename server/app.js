/**
 * BudgetBuddy Backend Server
 * 
 * Main application entry point for the expense tracker API.
 * This server handles authentication, expense/income tracking, 
 * budgets, recurring transactions, and financial analytics.
 */

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config(); // Load environment variables from .env file

const connectDB = require("./db/conn.js"); // Database connection
const router = require("./routes/router"); // API routes

const app = express();

// ============================================
// DATABASE CONNECTION
// ============================================
connectDB(); // Initialize MongoDB connection

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Parse incoming JSON payloads
app.use(express.json());

// Parse cookies for authentication tokens
app.use(cookieParser());

// Enable Cross-Origin Resource Sharing (CORS)
// Allows frontend (React app) to communicate with backend
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://budgetbuddyfinance.netlify.app"
    ],
    credentials: true,
  })
);


// ============================================
// API ROUTES
// ============================================
// All API endpoints are prefixed with /api
// Examples: /api/login, /api/expense, /api/budget
app.use("/api", router);

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
// Simple endpoint to verify server is running
app.get("/", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// ============================================
// SERVER INITIALIZATION
// ============================================
const PORT = process.env.PORT || 5000; // Use environment port or default to 5000

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Export app for testing purposes
module.exports = app;
