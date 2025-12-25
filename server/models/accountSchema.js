const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const accountSchema = new mongoose.Schema({
    account:{
        required: [true, "Account is required"], 
        type: String,
    },
    amount:{
        required: [true, "Amount is required"],
        type: Number,
        default: 0,
    },
    type:{
        type: String,
        default: "account"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref :"userdb",
        required: [true, "UserID is required"]
    }
},
{timestamps: true}
);
accountSchema.plugin(mongoosePaginate);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;