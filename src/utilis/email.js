const nodemailer = require('nodemailer');

exports.sendEmail = async() =>{
    const transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST ,
        port: process.env.EMAIL_PORT ,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        } 
    })
    const mailOptions = {
        from: 'Your_Email@example.com',
        to: 'User_Email@example.com',
        subject: 'Reset Password',
        text: 'Click on the following link to reset your password: http://localhost:3000/reset-password/token'
    }

    await transporter.sendMail(mailOptions)
}