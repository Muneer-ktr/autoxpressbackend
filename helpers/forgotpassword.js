const nodemailer = require('nodemailer')


const forgotpassword = async(email,link,fname,lname)=>{

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
            subject : 'Reset password',
            html: `<p>Hi ${fname} ${lname},
            This is your account reset password link clik to reset your password. ${link}`
        }
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err)
                console.log(err);
        })
} catch (error) {
    console.log(error);
    throw error
}
}

module.exports = forgotpassword