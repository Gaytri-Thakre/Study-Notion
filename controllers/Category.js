const Category= require("../models/tags");
exports.createCategory = async(req,res)=>{
    try{
        // fetch data
        const {name,description} = req.body;
        // validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        // create entry in DB
        const CategoryDetails=await Category.create({
            name:name,
            description:description,
        })
        console.log(CategoryDetails);
        return res.status(200).json({
            success:true,
            message:"category created successfully",
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong in Category creation"
        })
    }
}

// get all Tags.
exports.showAllCategory=async(req,res)=>{
    try{
        // find all tags from  db of tag model
        const allTags= await Category.find({},{name:true,description:true});
        return res.status(200).json({
            succes:true,
            message:"All Categories returned Successfully",
            data:allTags
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong in Tag creation"
        })
    }
}