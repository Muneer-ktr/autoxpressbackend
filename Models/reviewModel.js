const mongoose  = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review:{
        type:String
    },
    username:{
        type:String
    },
    email:{
        type:String
    }
})

const reviewModel = mongoose.model('reviewModel',reviewSchema)
module.exports = reviewModel