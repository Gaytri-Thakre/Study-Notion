const Tags = recuire("../models/tags");
exports.createTag = async(req,res)=>{
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
        const tagDetails=await Tags.create({
            name:name,
            description:description,
        })
        console.log(tagDetails);
        return res.status(200).json({
            success:true,
            message:"Tag created successfully",
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong in Tag creation"
        })
    }
}

// get all Tags.
exports.showAllTags=async(req,res)=>{
    try{
        // find all tags from  db of tag model
        const allTags= await Tags.find({},{name:true,description:true});
        return res.status(200).json({
            succes:true,
            message:"All Tags returned Successfully",
            data:allTags
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong in Tag creation"
        })
    }
}