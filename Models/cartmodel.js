const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        requried:true,
        ref:'userModel'
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                requried:true,
                ref:'productModel'
            },
            count:{
                type:Number,
                required:true
            }
        }
    ]
})

const cartModel = mongoose.model('cartmodel',cartSchema)
module.exports = cartModel
