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
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    tag:{
        type:[String],
        required:true,
    },
    ratingsAndReviews:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    studentEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    thumbnailUrl:{
        type:String,
    },
    studentEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    whatYouWillLearn: {
		type: String,
	},
    status: {
		type: String,
		enum: ["Draft", "Published"],
	},

});
module.exports = mongoose.model("Course",courseSchema)