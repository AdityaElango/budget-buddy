const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const keysecret = process.env.JWT_SECRET || "sdeivanaiananyaparikshithadityae"
const userSchema = new mongoose.Schema({
    fname:{
        type: String,
        required:true,
        trim:true,
    },
    lname:{
        type: String,
        trim:true,
        default: ""
    },
    email:{
        type: String,
        required:true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not valid email")
            }
        }
    },
    phone:{
        type: String,
        trim:true,
        default: ""
    },
    password:{
        type: String,
        required:true,
        minlength:6
    },
    cpassword:{
        type: String,
        required:true,
        minlength:6
    },
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]
},
{timestamps: true}
);

// hash password

userSchema.pre("save", async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next()
});

//token generate
userSchema.methods.generateAuthtoken = async function(){
    try{
        let token1 = jwt.sign({_id:this._id},keysecret,{
            expiresIn:"1d"
        });

        this.tokens = this.tokens.concat({token:token1});
        await this.save();
        return token1;
    }catch (error){
        res.status(422).json(error)
    }
}

//creating model

const userdb = new mongoose.model("users",userSchema);

module.exports = userdb;