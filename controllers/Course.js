const Course =require("../models/Course")
const Tags = require("../models/Tags")
const User = require("../models/User")
const imageUploaderToCloudinary = require("../utils/imageUploader")
require("dotenv").config()
// create course handler
exports.createCourse=(req,res)=>{
    try{
        // fetch data:
        const {courseName,courseDescription,whatYouWillLearn,price,tag} = req.body;
        // get thumbnail
        const thumbnail=req.files.thumbnailUrl;

        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
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
        const TagDetails = await Tags.findById(tag);
        if(!TagDetails){
            return res.status(400).json({
                success:false,
                message:"Tag details not found"
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
            tag:TagDetails._id,
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
        await Tags.findByIdAndUpdate(
            {_id:TagDetails._id},
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
exports.showAllCourses =async(req,res)=>{
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