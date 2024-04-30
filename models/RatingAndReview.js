const mongoose = require("mongoose")
const RatingAndReviewSchema = mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    Rating:{
        type:Number,
        required:true,
    },
    Review:{
        type:String,
        trim:true,
        required:true,
    }
})

module.exports = mongoose.Schema("RatingAndReview",RatingAndReviewSchema)
