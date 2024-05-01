const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailsender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollment");
const { default: mongoose } = require("mongoose");
// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req,res)=>{
    // get courseId and UserId
    const {course_id}=req.body;
    const userId =req.user.id;
    // validation 
    if(!course_id){
        return res.json({
            success:false,
            message:"Please Provide valid Course ID"
        })
    }
    // valid courseId
    let course;
    try{
        course = await Course.findById(course_id);
        // valid courseDetail
        if(!course){
            return res.json({
                success:false,
                message:"Could not find the course"
            });
        }
        // user already pay for the same course
        // convert user id to object id
        const uid = new mongoose.Types.ObjectId(userId);
        // user already pay for the same course
        if(course.studentEnrolled.includes(uid)){
            // return response
            return res.status(200).json({
                success:false,
                message:"Student is already enrolled"
            })
        }

        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
    // order created
    const amount =course.price;
    const currency = "INR";
    const options={
        amount : amount*100,
        currency,
        receipt: `${Math.random(Date.now()).toString()}`, // Fix the receipt generation
        notes:{
            courseId:course_id,
            userId,
        }
    }
    try{
        // intiate the payment
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        // return response
         return res.status(200).json({
             success:true,
             courseName:course.courseName,
             courseDescription:course.courseDescription,
             thumbnail:course.thumbnail,
             orderId:paymentResponse.id,
             currency:paymentResponse.currency,
             amopunt:paymentResponse.amount,
         })


    }catch(error){
        console.log(error);
        res.json({
            success:false,
            message:"COuld not initiate order",
        })
    }
    
   
};


// verify signature of Razorpay and server
exports.verifySignature = async(req,res)=>{
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    // hashed based message authentication
    const shasum =crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    if(signature !== digest){
        return res.status(400).json({
            success:false,
            message:"payment is not autherized"
        })
    }
    // payment is authorized
    console.log("Payment is Authorized")
    const {courseId,userId} = req.body.payload.payment.entity.notes;
    try{
        // fulfill the action
        // find the course and enroll student in course
        const enrolledCourse = await Course.findOneAndUpdate(
            {id:courseId},
            {$push:{studentEnrolled:userId}},
            {new:true},
        );
        if(!enrolledCourse){
            return res.status(500).json({
                success:false,
                message:"course not found"
            });
        }
        console.log(enrolledCourse);
        // find the student
        const enrolledStudent = await User.findOneAndUpdate(
            {id:userId},
            {$push:{courses:courseId}},
            {new:true},
        );
        console.log(enrolledStudent);
        // mail send krdo confirmation wala
        const emailResponse=await mailSender(
            enrolledStudent.email,
            "Congratulation you are onboard into new Course",
            "Happy Learning",
        );
        // courseprogress 0%
        // response send
        return res.status(200).json({
            success:true,
            message:"Signature Verified and Course Added"
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong in Payment"
        })
    }
}