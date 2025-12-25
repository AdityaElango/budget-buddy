const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keysecret = "sdeivanaiananyaparikshithaditya"

const incomeSchema = new mongoose.Schema({
    category:{
        required: [true, "Title is required"],
        type: String
    },
    description:{
        type: String,
        required:[true, "Description is required"],
        trim:true,
    },
    account:{
        required: [true, "Account is required"], 
        type: String,
    },
    type:{
        type: String,
        default: "income"
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
incomeSchema.plugin(mongoosePaginate);

const Income = mongoose.model("Income", incomeSchema);

module.exports = Income;
