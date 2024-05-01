const Section = require("../models/Section")
const Course = require("../models/Course")
exports.createSection = (req,res)=>{
    try{
        // data fetch
        const {sectionName,courseId} = req.body;
        // validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }
        // create section
        const newSection = await Section.create({sectionName});
        // update course sechma
        const updateCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true},
        ).populate({
            path: 'courseContent',
            populate: {
                path: 'subSection',
                model: 'Subsection'
            }
        });
        // res:
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            data:updateCourseDetails
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong in section creation"
        })
        
    }
}

exports.updateSection = async(req,res)=>{
    try{
        // data 
        const {sectionName,SectionId} = req.body;
        // data validation
        if(!sectionName || !SectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }
        // entry update data
        const section = await Section.findByIdAndUpdate(
            SectionId,
            {sectionName},
            {new:true}
        );
    
        // response
        return res.status(200).json({
            success:true,
            message:"Updated Section sucessfully",
            data:section
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong in section updation"
        })
    }
}

exports.deleteSection = async(req,res)=>{
    try{
        // from API / header parameter
        const {SectionId} = req.params;
        await Section.findByIdAndDelete(SectionId);
        // update course sechma
        await Course.findByIdAndDelete(newSection._id)
        // return response
        return res.status(200).json({
            success:true,
            message:"Delete Section sucessfully",
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong in section deletion"
        })
    }
}

// get all sections