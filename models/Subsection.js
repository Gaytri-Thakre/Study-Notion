const mongoose = require("mongoose")
const subsectionSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    timeduration:{
        type:String,
    },
    videoUrl:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    }
})
module.exports = mongoose.model("Subsection",subsectionSchema)