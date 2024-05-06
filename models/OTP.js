const mongoose = require("mongoose");
const mailSender = require("../utils/mailsender")
const OTPSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
})
// middleware
// User->data enter->email OTP->OTP entry->OTP submitted->then DB entry created
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email from STudyNotion",otp);
        console.log("Email send Successfully",mailResponse)

    }catch(error){
        console.log("error occured while sending mails: ",error);
        throw error;
    }
}
OTPSchema.pre("save",async function(){
    await sendVerificationEmail(this.email,this.otp);
    next();
})
module.export = mongoose.model("OTP",OTPSchema)
