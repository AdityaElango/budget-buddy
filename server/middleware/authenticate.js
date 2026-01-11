const jwt = require("jsonwebtoken"); 
const userdb = require("../models/userSchema");
require("dotenv").config();
const keysecret = process.env.JWT_SECRET || "sdeivanaiananyaparikshithadityae"

const authenticate = async(req,res,next)=>{
    try{
        // Check for token in Authorization header or cookie
        const token = req.headers.authorization || req.cookies.usercookie;
        
        if (!token) {
            return res.status(401).json({status:401,message:"Unauthorized no token provided"});
        }
        
        const verifytoken = jwt.verify(token,keysecret);
        
        const rootUser = await userdb.findOne({_id:verifytoken._id || verifytoken.id});
        
        if(!rootUser){throw new Error("user not found")}

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

        next();
    }catch(error){
        res.status(401).json({status:401,message:"Unauthorized no token provided"})
    }
}

module.exports = authenticate