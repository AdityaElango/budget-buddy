const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const budgetSchema = new mongoose.Schema({
    category:{
        required: [true, "Title is required"],
        type: String
    },
    budget:{
        required: [true, "Budget is required"],
        type: Number,
        default: 0,
    },
    expense:
    {
        required: [true, "Expense is required"],
        type: Number,
        default: 0
    },
    type:{
        type: String,
        default: "budget"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref :"userdb",
        required: [true, "UserID is required"]
    }
},
{timestamps: true}
);
budgetSchema.plugin(mongoosePaginate);

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;