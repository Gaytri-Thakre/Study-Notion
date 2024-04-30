const User = require("../models/User");
const mailSender = require("../utils/mailSender");
// resetPasswordToken
exports.resetPasswordToken=async (req,res)=>{
    // get email from req body
    const email = req.body.email;
    try{
    // check user for this email,email verification
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(401).json({
            success:false,
            message:"Your Email is not registered with us"
        })
    }
    // generate token
    const token = crypto.randomUUID();
    // update user by adding token and expiration time
    await User.findOneAndUpdate({email:email},
                                {
                                    token:token,
                                    resetPasswordExpires:Date.now()+5*60*1000,
                                },
                                {new:true})//updated doc return hoga
    // create url
    const url = `http://localhost:3000/update-password/${token}`
    // send mail with url
    await mailSender(email,
                    "Password Reseting Link",
                    `Password Reset Link:${url}`);
    // return response
    return res.json({
        success:true,
        message:'Email sent Successfully,please check email and change password',
    });

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Something went wrong while reseting the password'
        })
    }
}
// reset Password
exports.resetPassword=async(req,res)=>{
    try{
    // data fetch
    const {password,confirmPassword,token}=req.body;
    // token comes in body due to frontend
    // validation
    if(password!==confirmPassword){
        return res.json({
            success:false,
            message:"Password in not matching"
        })
    }
    // get userDetails from db using token
    const userDetails = await User.findOne({token:token});
    // if no entry then token invalid
    if(!userDetails){
        return res.json({
            success:false,
            message:"Token is invalid",
        });
    }
    // check time
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            success:false,
            message:"Token expired you have to regenrate token",
        });
    }
    // password hash
    let hashedPassword = await bcrypt.hash(password,10);
    // change the password to newPassword
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    )
    // return res
    return res.status(200).json({
        success:true,
        message:"Password reset Successfully"
    })}catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Something went wrong while reseting the password'
        })
    }
}
