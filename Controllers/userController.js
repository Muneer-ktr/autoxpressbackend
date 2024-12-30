const bcrypt = require('bcrypt')
const userModel = require('../Models/UserModel')
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const otpSending = require('../helpers/otpSending');
const forgotpassword = require('../helpers/forgotpassword');
const { jwtDecode } = require('jwt-decode');
const { default: axios } = require('axios');
const reviewModel = require('../Models/reviewModel');



exports.register = async(req,res)=>{
    const {fname,sname,email,password} = req.body

    if(!fname || !sname || !email || !password){
        res.status(400).send("Plaese Fill the Form")
    }else{
    try{
        const existingUser = await userModel.findOne({email}) 
        console.log(existingUser);
        if(existingUser){
            res.status(409).send({message:'Already registered.. Please login'})
        }else{
            const saltRounds = 10
            const hashPassword = await bcrypt.hash(password,saltRounds)
            const otp = otpGenerator.generate(6, {digits:true, upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
            const otpExpires = new Date(Date.now()+1*60*1000)


            const newUser  =  new userModel({
                firstname:fname,
                secondname:sname,
                email,
                password:hashPassword,
                phonenumber:'',
                Address:'',
                gender:'',
                profilepic:'',
                discription:'',
                licence:'',
                otpExpires,
                otp
            })
            await newUser.save()
            await otpSending(email,otp)

            res.status(200).send({message:'New User added',newUser})
        }
    }catch(err){
        res.status(500).send('Internal Server Error')
        console.log(err);
    }
    }
}

//otp verification
exports.otpVerification = async(req,res)=>{
    const {email,otp}= req.body
    console.log(otp);
    
  try {
      if(!email||!otp){
          return res.status(400).send({message:'please enter a valid email'})
  
      }
          const existingUser = await userModel.findOne({email})
  
          if(!existingUser){
              return res.status(404).send("User not found")
          }
         if(existingUser.otp != otp){
          return res.status(400).send("Invalid OTP... try again")
      }
      const date = new Date(Date.now())
      if(existingUser.otpExpires<date){
          return res.status(410).send({message:'Time Expired'})
      }
      existingUser.isVerified = true
      existingUser.otp = null
      existingUser.otpExpires = null
          await existingUser.save()
          res.status(200).send({message:'Account verified...'})
  } catch (error) {
    res.status(500).send("internal server Error")
    console.log(error);
    
  }
}
//otp resend
exports.resendOtp = async(req,res)=>{
    const {email,otp} = req.body

   try {
     const existingUser = await userModel.findOne({email})
      
     if(!existingUser){
         return res.status(404).send({message:'User not Found'})
     }
     const date = new Date(Date.now())
     if(existingUser.otpExpires>date){
         return res.status(400).send('OTP still Valid')
     }
     const newotp = otpGenerator.generate(6, {digits:true, upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
     const otpExpires = new Date(Date.now()+1*60*1000)
 
     existingUser.otp = newotp
     existingUser.otpExpires = otpExpires
 
    await existingUser.save()
    await otpSending(email,newotp)
    res.status(200).send({message:'new otp send'})

   } catch (error) {
    res.status(500).send('internal Server error')
    
   }
}

// login
exports.login = async(req,res)=>{
    const{email,password} = req.body

    try{
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            const result = await bcrypt.compare(password,existingUser.password)
            if(result){
                // const token = jwt.sign({id:existingUser._id},'superseceretekey12345')
                const token = jwt.sign({id:existingUser._id},'superkey321')
                res.status(200).send({token,existingUser})
            }else{
                res.status(404).send({message:'Incorrect email or Password'})
            }
        }else{
            res.status(404).send({message:'Account not found'})
        }
    }catch(err){
        res.status(500).send('Internal Server Error')
        console.log(err);
    }
}


// Dealer Register
exports.dealeRegister = async(req,res)=>{
    const {fname,sname,email,password,discription} = req.body
    const license = req.file.filename
    

    if(!fname || !sname ||!email ||!password ||!license ||!discription){
        res.status(400).send('Please fill the Form')
    }else{
        try{
            const existingUser = await userModel.findOne({email})
            if(existingUser){
                res.status(409).send({message:'Alredy Registered'})
            }else{
                saltRounds = 10
                const hashPassword = await bcrypt.hash(password,saltRounds)
                const otp = otpGenerator.generate(6, {digits:true, upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
                const otpExpires = new Date(Date.now()+1*60*1000)
    

                const newDealer = await new userModel({
                    firstname:fname,
                    secondname:sname,
                    email,
                    password:hashPassword,
                    phonenumber:'',
                    Address:'',
                    gender:'',
                    profilepic:'',
                    description:discription,
                    role:'dealer',
                    active:false,
                    licence:license,
                    otpExpires,
                    otp
                })
                await newDealer.save()
                await otpSending(email,otp)
                res.status(200).send({message:'Dealer Added',newDealer})

            }

        }catch(err){
            res.status(500).send('Internal Server Error')
            console.log(err);
        }
    }
}

// get dealers
exports.getDealer = async(req,res)=>{
    try{
    const dealers = await userModel.find({role:'dealer'})
    res.status(200).send(dealers)
   }catch(err){
    res.status(500).send('Internal Server  Error')
    console.log(err);
   }
}

// approve or reject dealer
exports.manageDealer = async(req,res)=>{
    const {status} = req.body
    const{id}= req.params

    try{
        const dealer = await userModel.findById(id)

    if(!dealer){
        return res.status(404).send({message:'Dealer not found'})
    }
    if(status === 'approve'){
        dealer.active = true
        dealer.save()
        res.status(200).send('Dealer approved successfully')
    }else if(status === 'rejected'){
       await dealer.deleteOne()
       res.status(200).send('Dealer Rejected Successfully')
    }else{
        res.status(406).send('Please provide a valid status')
    }
}catch(err){
    console.log(err);
    res.status(500).send('internal server error')
}
}

//dealer Delete

exports.deleteDealer = async(req,res)=>{
    const {id} = req.params


try {
        const dealer = await userModel.findById(id)
        await dealer.deleteOne()
    
        res.status(200).send("delaler deleted..")
} catch (error) {
    res.status(500).send('Internal server error')
}
}


// forget Password 

exports.forgotPassword = async(req,res)=>{
    const {email} = req.body
    console.log(req.body);
    

try {
        const existingUser = await userModel.findOne({email})
    
        if(!existingUser){
            return res.status(404).send('Account not Found')
        }else{
            const token = jwt.sign({id:existingUser._id},'superkey123',{expiresIn:'30m'})
            const base_URL = process.env.BASE_URL
            const resetLink = `${base_URL}/resetpassword/${token}`
    
            await forgotpassword(email,resetLink,existingUser.firstname,existingUser.secondname)
            res.status(200).send('reset link send...')
        }
} catch (error) {
    res.status(500).send('Internal server Error')
    console.log(error);
}
}

// updated password

exports.updatedPassword =async(req,res)=>{
    const {token,password} = req.body
    // console.log(password);
    
    try {
        const decodedToken = jwtDecode(token)
    
        const existingUser = await userModel.findById(decodedToken.id)
    
        if(!existingUser){
            return res.status(404).send('User not found')
        }else{
            const saltRounds = 10
            const hashPassword = await bcrypt.hash(password,saltRounds)
            existingUser.password = hashPassword
           await existingUser.save()
            res.status(200).send('password changed now you can login...')
            
        }
    } catch (error) {
        res.status(500).send('Internal server error')
        console.log(error);
    }

}

exports.googleSignIn = async(req,res)=>{
    const {Googletoken} = req.body

    try {
        if(!Googletoken){
            return res.status(400).send({message:"Token is required"})
        }
    
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${Googletoken}`)
    
        if(response.data.aud != process.env.CLINT_ID){
            return res.status(403).send({message:"Invalid Token"})
        }
    
        const firstname = response.data.given_name
        const secondname = response.data.family_name
        const email = response.data.email
        const profilepic = response.data.picture
    
        const existingUser = await userModel.findOne({email})
    
        if(!existingUser){
            const newUser = new userModel({
                firstname,secondname,email,password:'',phonenumber:'',Address:'',gender:'',profilepic,description,licence,otpExpires:'',isVerified:true,otp:''
            })
            await newUser.save()
            const token = jwt.sign({id:newUser._id},'superkey321')
            res.status(200).send({token,user:newUser})
        }
        const token = jwt.sign({id:existingUser._id},'superkey321')
        res.status(200).send({token,user:existingUser})
    } catch (error) {
        res.status(500).send("Internal server error")
        // console.log(error)
    }

}
//get users

exports.getUsersAdmin = async(req,res)=>{
    try{
    const users = await userModel.find({role:'user'})
    res.status(200).send(users)
   }catch(err){
    res.status(500).send('Internal Server  Error')
    console.log(err);
   }
}

//delete user
exports.deleteUser = async(req,res)=>{
    const {id} = req.params

try {
        const users = await userModel.findById(id)
        await users.deleteOne()
    
        res.status(200).send("user deleted..")
} catch (error) {
    res.status(500).send('Internal server error')
}
}


//app review

exports.appReview = async (req,res)=>{
    const {review,username,email} = req.body    
    try {
        if(!review||!username||!email){
            return  res.status(400).send('fill all fileds')
           
        }else{
            const newReview = await reviewModel({
                review,username,email
            })
            await newReview.save()
            res.status(200).send(newReview)
        }
       
    } catch (error) {
        res.status(500).send({message:"Internal server Error"})
        console.log(error) 
    }
}
//get app review

exports.getReview = async(req,res)=>{
    try{
    const users = await reviewModel.find()
    res.status(200).send(users)
   }catch(err){
    res.status(500).send('Internal Server  Error')
    console.log(err);
   }
}

//user profile

exports.userProfile = async(req,res)=>{

    const {id}= req.params
    const {firstname,secondname,phonenumber,Address,gender} = req.body

try {
        const usersUpdate = await userModel.findByIdAndUpdate(id,{
            firstname,
            secondname,
            phonenumber,
            Address,
            gender
        },{new:true})
        res.status(200).send({message:'update successfully',usersUpdate})
} catch (error) {
    res.status(500).send('Internal Server Error')
}

}
