const mongoose = require("mongoose");
const courseSchema = mongoose.Schema({
    couseName:{
        type:String,
        required:true,
    },
    courseDescription:{
        type:String,
        trim:true
    },
    price:{
        type:Number,
        required:true,
    },
    courseContent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    },
    tags:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tags"
    },
    ratingsAndReview:{
        type:mongoose.Schema.Types.OnjectId,
        ref:"RatingAndReview"
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    studentEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    thumbnailUrl:{
        type:String,
    },
    studentEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

});
module.exports = mongoose.model("Course",courseSchema)