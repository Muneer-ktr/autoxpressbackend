const mongoose = require("mongoose")

const productSchema =  new mongoose.Schema({
    category:{
        required:true,
        type:String
    },
    productname:{
        required:true,
        type:String
    },
    aboutProduct:{
        required:true,
        type:String
    },
    price:{
        required:true,
        type:Number
    },
    productImage:{
        required:true,
        type:String
    },
    dealerId:{
        required:true,
        type:String
    }
})

const productModel =  mongoose.model('productModel',productSchema)
module.exports = productModel