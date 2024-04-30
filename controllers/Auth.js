const User = require("../models/User")
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
require("dotenv").config();
// sendOTP
exports.sendOTP = async(req,res)=>{
    try{ 
        // fetch email from request body
        const {email}=req.body;
        // check if user already exists
        const UserALreadyExist =await User.findOne({email});
        // if yes then user already register go to login page
        if(UserALreadyExist){
            return res.status(401).json({
                succes:false,
                message:"User Already Exist Go To Login"
            });
        }
        // generate OTP
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        console.log("OTP generated: ",otp);

        // check unique otp or not:
        const result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            })
            result = await OTP.findOne({otp:otp});
        }
        const otpPayload = {email,otp};
        // create an entry for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        return res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp,
        })
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
// signup
exports.signUp = async(req,res)=>{
    const {
        firstName,
        lastName,
        email, 
        password ,
        accountType ,
        contactNumber,
        confirmPassword,
        otp
    }= req.body;
    try{

        // data fetch
        
        // validate the data
        // if not filled all details
        if(!firstName || !lastName || !accountType || !email || !password || !confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Fill all credentials"
            })
        }
        // 2 password match karo
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Confirm password does not match"
            })
        }
        // check user already exists or not
        const existingUser = await User.findOne({email});
            if(existingUser){
                return res.status(400).json({
                    success:false,
                    message:"User already exists",
                });
            }
        // find most recent OTP stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        // validate OTP
        if(recentOtp.length == 0){
            // OTP not found
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }else if(otp!== recentOtp.otp){
            // Invalid OTP
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }
        // Hash password
        let hashedPassword= await bcrypt.hash(password,10);
        
        // entry create in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateofBirth:null,
            about:null,
            contactNumber:null
        })
        const user= await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        // return res
        return res.status(200).json({
            success:true,
            message:'User is registered Succesfully',
            user,
        })
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }

}



// login

exports.login = async(req,res)=>{

    const {email,password}=req.body;
    // get data from req.body
    try{
        // validation data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Fill all credentials"
            })
        }
        // user exist or not
        // user is not present in db
        let user =await User.findOne({email});//use populate if needed
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Go to Signup"
            })
        }
        // user is present check the password with hashed password

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(403).json({
                success: false,
                message: "Incorrect Password"
            });
        }
        // generate JWT after passsword matching
        const payload ={
            id:user._id,
            email:user.email,
            accountType:user.accountType,
        }
        let token = jwt.sign(payload,
        process.env.JWT_SECRET,
        {
            expiresIn: "2h", // Token expires in 1 hour, you can adjust this
        });
        user=  user.toObject();
        user.token = token;
        delete user.password;
        // create cookie and send response
        
        const options={
            expiresIn:new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("Cookie",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Login successful",
        });
    }
    
    catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Login failed, Please try again later.",
        });
    }
};
// changePassword
exports.changePassword = async(req,res)=>{
    // get oldPassword,newPassword,confirmNewPassword
    const {oldPassword,newPassword,confirmPassword} = req.body;
    try{
        if(!oldPassword|| !newPassword ||!confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Fill all required fields"
            });
        }
        // Fetch user details
        const userId = req.user.id; // Assuming you have middleware to extract user details from JWT
        const user = await User.findById(userId);

        // Verify old password
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(403).json({
                success: false,
                message: "Incorrect old password"
            });
        }

        // Validate new password
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        user.password = hashedPassword;
        await user.save();

        // You can send an email notification here if needed

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    }catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to change password, Please try again later."
        });
    }
}
