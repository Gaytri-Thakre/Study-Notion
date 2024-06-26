const mongoose = require("mongoose")
const sectionSchema = mongoose.Schema({
    sectionName:{
        type:String,
    },
    subSection:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Subsection",
            required:true,
        }
    ]
})
module.exports = mongoose.model("Section",sectionSchema)