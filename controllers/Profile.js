const Profile = require("../models/Profile")
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
exports.UpdateProfile=async(req,res)=>{
    try{
        // get data
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;
        // get userId
        const id=req.user.id;
        // validate
        if(!contactNumber || !gender || !id){

        }
        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails =await Profile.findById(profileId)
        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        profileDetails.about=about;
        await profileDetails.save();
        // response
        return res.status(200).json({
            success:true,
            message:'Profile updated Successfully',
            profileDetails
        });
    
        }catch(error){
            console.log(error)
            return res.status(500).json({
                success:false,
                message:'Something went wrong while updating profile'
            })
        }

}
// account deletion :
exports.deleteAccount = async(req,res)=>{
    try{
        // get id
        const id = req.user.id;
        // validation
        const userDetails = User.findById(id);
        if(!userDetails){
             return res.status(404).json({
                 success:false,
                 User:"User Not Found"
             })
        }
        // profile deletion
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // delete the User enrollment and User courses also
        // User Deletion
        await User.findByIdAndDelete({_id:id});
        // scheduling
        // response
        return res.status(200).json({
            success:true,
            message:'User deleted Successfully',
            
        });

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Something went wrong while deleting user profile'
        })
    }
};

exports.getAllUserDetails = async(req,res)=>{
    try{
        // get id
        const id = req.user.id;
        // validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        // return response 
        return res.status(200).json({
            success:true,
            message:"User Data Fetched Successfully",
            userDetails
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

// getEnrolledCourses
exports.getEnrolledCourses = async (req,res) =>{
    try{
        // get user id
        const userid = req.user.id
        // get user details and populate to courses
        const userDetails = await User.findOne({
            _id:userid
        })
        .populate("courses")
        .exec()
        // validation
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find user with id: ${userDetails}`
            })
        }
        // return response
        return res.status(200).json({
            success:true,
            data:userDetails.courses
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
    
};
// updateDisplayPicture
exports.updateDisplayPicture = async(req,res) =>{
    try{
        // get the image
        const displayPicture = req.files.displayPicture
        // get user id
        const userId = req.user.id
        // upload a image
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        // updateProfile
        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { imageUrl: image.secure_url },
            { new: true }
        )
        // return response
        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
