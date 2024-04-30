const mongoose = require("mongoose")
const subsectionSchema = mongoose.Schema({
    title:{
        type:Sting,
        required:true,
    },
    timeduration:{
        type:String,
    },
    videoUrl:{
        type:Sting,
        required:true,
    },
    description:{
        type:String,
        required:true,
    }
})
module.exports = mongoose.model("Subsection",subsectionSchema)