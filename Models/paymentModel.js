const mongoose = require("mongoose")

const paymentschema = new mongoose.Schema({

    userID:{
        required:true,
         type:mongoose.Schema.Types.ObjectId,
         ref:'userModel'
    },
    productID:{
        required:true,
         type:mongoose.Schema.Types.ObjectId,
         ref: 'productModel'
    },
    ShippingAddress:{
        required:true,
        type:String
    },
    City:{
        required:true,
        type:String
    },
    State:{
        required:true,
        type:String
    },
    Pincod:{
        requried:true,
        type:String
    },
    phoneNumber:{
        required:true,
        type:Number
    },
    PaymentID:{
        requried:true,
        type:String
    },
    status:{
        type:String,
        required: true,
        default:'pending'
    },
    Date:{
        requried:true,
        type:Date,
        default:Date.now()
    },
    amount:{
        type:Number,
        required: true
    }
})

const paymentModel = mongoose.model('paymentModel',paymentschema)
module.exports =paymentModel