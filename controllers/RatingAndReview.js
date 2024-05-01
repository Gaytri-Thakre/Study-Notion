const RatingAndReview =  require("../models/RatingAndReview");
const Course = require("../models/Course");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
// create rating
exports.createRatingAndReview=(req,res)=>{
    try{
        // get data
        const userId = req.user.id;
        // fetchdata from req body
        const {rating,review,courseId} = req.body;
        // validation =>user is enrolled or not
        const courseDetail = await Course.findOne(
            {_id:courseId,
                studentEnrolled:{$elemMatch:{$eq:userId}},
            });
        if(!courseDetail){
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course',
            })
        }
        // One review only=>already reviewed
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId
        });
        if(alreadyReviewed){
            return res.staus(403).json({
                success:false,
                message:'Course is already reviewed by the user'
            })
            
        }
        // create Review
        const newReview = await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId
        })
        // Update Course
        const updatedCourseDeatils=await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    RatingAndReview:newReview,
                }

            },{new:true})
            console.log(updatedCourseDeatils)
        // return response 
            return res.status(200).json({
                success:true,
                message:"Rating and Review is done successfully"
            })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Rating and Review is not created"
        })
    }
}
// avg rating
exports.avgRating=(req,res)=>{
    try{
        // get course id
        const courseId = req.body.courseid;
        // cal avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])
        // return avg rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }
        // if no rating / Review exist
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0 ,no ratings given till now",
            averageRating:0
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// get all rating
exports.getAllRating = async(req,res)=>{
    try{
        // find rating
        const allReviews = await RatingAndReview.find({})
                                                .sort()
                                                .populate({
                                                    path:"user",
                                                    select:"firstName lastName email image",
                                                })
                                                .populate({
                                                    path:"course",
                                                    select:"courseName"
                                                })
                                                .exec();
        return res.status(200).json({
            success:true,
            message:"All Rating fetch successfully",
            data:allReviews
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

