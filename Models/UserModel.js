const mongoose  = require("mongoose");

const usereSchema = new mongoose.Schema({
    firstname:{
        required:true,
        type:String
    },
    secondname:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    phonenumber:Number,
    Address:String,
    gender:String,
    profilepic:String,
    description:String,
    role:{
        type:String,
        default:'user'
    },
    active:{
        type:Boolean,
        default:true
    },
    licence:{
        type:String
    }
})

const userModel = mongoose.model('userModel',usereSchema)

module.exports = userModel