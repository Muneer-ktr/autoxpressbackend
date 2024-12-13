const userModel = require("../Models/UserModel")

const adminMiddleware = async(req,res,next)=>{
    const id =req.payload

    const user = await userModel.findById(id)
    if(user.role === 'admin'){
        return next()
    }
    return res.status(409).send('Access Denied')
}

module.exports = adminMiddleware