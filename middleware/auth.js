// protected routes 
// student cannot go to admin
// auth,isStudent,isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
// authentication
exports.auth = async (req,res,next)=>{
    try{
        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer"," ");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Missing",
            })
        }
        // verify token:
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            })
        }
        next();

    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token"
        });
    }
}
// authorization:
exports.isStudent = (req,res,next) =>{
    try{
        // role is created in payload
        if(req.user.accountType !=='Student'){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for students",
            })
        }
        next()
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User Role is not matching",
        })
    }
}
exports.isInstructor=(req,res,next)=>{
    try{
        if(req.user.accountType !=='Instructor'){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Instructor",
            })
        }
        next()

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User Role is not matching",
        })
    }
}
exports.isAdmin=(req,res,next)=>{
    try{
        if(req.user.accountType !=='Admin'){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for admin",
            })
        }
        next()

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User Role is not matching",
        })
    }
}