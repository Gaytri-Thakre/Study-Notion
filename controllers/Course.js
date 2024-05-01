const Course =require("../models/Course")
const User = require("../models/User")
const imageUploaderToCloudinary = require("../utils/imageUploader")
const Category = require("../models/Category")
require("dotenv").config()
// create course handler
exports.createCourse=(req,res)=>{
    try{
        // fetch data:
        const {courseName,courseDescription,whatYouWillLearn,price,tag,category} = req.body;
        // get thumbnail
        const thumbnail=req.files.thumbnailUrl;

        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category){
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            });
        }
        // check if instructor and fetch data
        const user = req.user.id;
        // the change is done here
        const instructor =await User.findById(user,{instructor:true});
        
        if(!instructor){
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            });
        }
        // check tag is valid or not
        const CategoryDetails = await Category.findById(category);
        if(!CategoryDetails){
            return res.status(400).json({
                success:false,
                message:"category details not found"
            });
        }
        // Upload the image to cloudinary
        const thumbnailUrl = await imageUploaderToCloudinary(thumbnail,process.env.FOLDER_NAME);
        // create a course
        const newCourse =await Course.create({
            courseName,
            courseDescription,
            instructor:instructor._id,
            whatYouWillLearn,
            price,
            category:CategoryDetails._id,
            thumbnailUrl:thumbnailUrl.secure_url,
        })
        // Instructor list will be updated
        // add a new course to user schema of Instructor
        await User.findByIdAndUpdate(
            {_id:instructor._id},
            {
                $push:{
                    course:newCourse._id,
                }
            },
            {new:true}
        );
        // update the tag schema
        await Category.findByIdAndUpdate(
            {_id:CategoryDetails._id},
            {
                $push:{
                    course:newCourse._id,
                }
            },
            {new:true}
        );
        // return response
        return res.status(200).json({
            success:true,
            message:"Course created successfully"
        });
    }catch(error){
        return res.status(400).json({
                success:true,
                message:"Course not created"
        });
    }
}

// get All courses:
exports.getAllCourses =async(req,res)=>{
    try{
        const allCourses= await Course.find({},{courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingsAndReview:true,
                                                studentEnrolled:true,})
                                                .populate("instructor")
                                                .exec();
        return res.status(200).json({
            succes:true,
            message:"All Courses returned Successfully",
            data:allCourses
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong in Course creation"
        })
    }
}

// getCourseDetails
exports.getCourseDetails = async(req,res)=>{
    try{
        // get course id
        const {courseId} = req.body
        // find course details
        const CourseDetails = Course.find(
            {_id:courseId}
        ).populate(
            {
                path:"instructor",
                populate:{
                    path:"addditionalDetails",
                },
            }
        )
        .populate("category")
        .populate("ratingsAndReviews")
        .populate({
            path:"courseContent",
                populate:{
                    path:"subSection",
                },
        })
        .exec();
        // get course details while populating
        // validation
        if(!CourseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find Course details with ${courseId}`,

            })
        }
        return res.status(200).json({
            success:true,
            message:"Course is fetched successfully",
            data:CourseDetails
        })


    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}