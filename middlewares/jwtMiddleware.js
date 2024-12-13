
 const jwt = require('jsonwebtoken');
    const jwtMiddleware = (req,res,next)=>{
        try{
    const token = req.headers['authorization'].split(' ')[1]
    
    const jwtResponse = jwt.verify(token,'superkey321')
    req.payload = jwtResponse.id 
    next()
    
}catch(err){
res.status(401).send('Authorization Failed... Please login')
}
    }
 

 module.exports = jwtMiddleware