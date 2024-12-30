const nodemailer = require('nodemailer')


    const otpSending = async(email,otp)=>{
        try {
        const transporter = nodemailer.createTransport({
            service:'Gmail',
            auth:{
                user: process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        })
    
        const mailOptions = {
            from:process.env.EMAIL,
            to:email,
            subject : 'OTP for Account Verification',
            html: `Your otp for account verification is ${otp}.`
        }
    
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err)
                console.log(err);
        })
} catch (error) {
 console.log(error);  
 throw err 
}
    }

module.exports = otpSending