const mongoose = require("mongoose")
const TagSchema = mongoose.Schema({
    TagName:{
        type:String,
        required:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    description:{
        type:String,
        trim:true,
        required:true,
    }
})

module.exports = mongoose.Schema("Tags",TagSchema)
