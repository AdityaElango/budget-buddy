const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keysecret = "sdeivanaiananyaparikshithaditya"

const expenseSchema = new mongoose.Schema({
    category:{
        required: [true, "Title is required"],
        type: String
    },
    description:{
        type: String,
        required:[true, "Description is required"],
        trim:true,
    },
    type:{
        type: String,
        default: "expense"
    },
    account:{
        required: [true, "Account is required"], 
        type: String
    },
    amount:{
        type: Number,
        required:[true, "Amount is required"],
    },
    date:
    {
        type: Date,
        required: [true, "Date is required"],
    },
    tags: {
        type: [String],
        default: [],
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref :"userdb",
        required: [true, "UserID is required"]
    }
},
{timestamps: true}
);

//pagination
expenseSchema.plugin(mongoosePaginate);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
