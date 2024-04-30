const mongoose = require("mongoose")
const sectionSchema = mongoose.Schema({
    sectionName:{
        type:Sting,
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