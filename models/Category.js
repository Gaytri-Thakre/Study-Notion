const mongoose = require("mongoose")
const categorySchema = mongoose.Schema({
    CategoryName:{
        type:String,
        required:true,
    },
    course:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }],
    description:{
        type:String,
        trim:true,
        required:true,
    }
})

module.exports = mongoose.Schema("Category",categorySchema)
