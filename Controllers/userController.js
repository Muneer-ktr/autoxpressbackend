const bcrypt = require('bcrypt')
const userModel = require('../Models/UserModel')
const jwt = require('jsonwebtoken');


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
            const newUser  = await new userModel({
                firstname:fname,
                secondname:sname,
                email,
                password:hashPassword,
                phonenumber:'',
                Address:'',
                gender:'',
                profilepic:'',
                discription:'',
                licence:''
            })
            newUser.save()
            res.status(200).send({message:'New User added',newUser})
        }
    }catch(err){
        res.status(500).send('Internal Server Error')
        console.log(err);
    }
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
                    licence:license
                })
                newDealer.save()
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
