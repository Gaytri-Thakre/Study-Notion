const Section = require("../models/Section")
const Subsection = require("../models/Subsection")
const {imageUploaderToCloudinary} = require("../utils/imageUploader")
exports.createSubSection = (req,res)=>{
    try{
        // data fetch
        const {title,timeDuration,description,sectionId} = req.body;
        // extract file
        const video = req.files.videoFile;
        // validation
        if(!sectionId || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                messsage:"Fill All credentials"
            })
        }
        // upload video to cloudinary
        const UploadVideo = await imageUploaderToCloudinary(video,process.env.FOLDER_NAME);
        // create a subsection
        const SubsectionDetails = await Subsection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:UploadVideo.secure_url
        })
        // update the section with this subsection
        await Section.findByIdAndUpdate({sectionId},{
            $push:{
                subSection:SubsectionDetails,
            }
        },
        {
            new:true,
        }).populate({
            
            path: 'subSection',
            model: 'Subsection'
            
        })
        // return response
        // res:
        return res.status(200).json({
            success:true,
            message:"SubSection created successfully",
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong in subsection creation"
        })
        
    }
}

exports.updateSubSection = async(req,res)=>{
    try{
        // data 
        const {title,SubSectionId,timeDuration,description} = req.body;
        // data validation
        if(!title || !SubSectionId || !timeDuration || !description){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }
        // entry update data
        const SubsectionUpdate = await Subsection.findByIdAndUpdate(
            SubSectionId,
            {
                title: title, // Update title
                timeDuration: timeDuration, // Update time duration
                description: description
            },
            {new:true}
        );
    
        // response
        return res.status(200).json({
            success:true,
            message:"Updated SubSection sucessfully",
            data:SubsectionUpdate
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong in subsection updation"
        })
    }
}

exports.deleteSubSection = async(req,res)=>{
    try{
        // from API / header parameter
        const {SubSectionId} = req.params;
        await Subsection.findByIdAndDelete(SubSectionId);
        // delete subsection in section also
        // return response
        return res.status(200).json({
            success:true,
            message:"Delete SubSection sucessfully",
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong in section deletion"
        })
    }

}

// get all subsections