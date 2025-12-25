/**
 * MongoDB Database Connection
 * 
 * Handles connection to MongoDB database using Mongoose.
 * Uses connection string from environment variable or defaults to local MongoDB.
 */

const mongoose = require("mongoose");

/**
 * Connect to MongoDB database
 * @async
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Use MONGO_URI from .env or fallback to local MongoDB
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/expense-tracker";
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
