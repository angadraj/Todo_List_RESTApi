require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports.sendEmail = function sendEmail (data) {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, 
            auth: {
              user: process.env.EMAIL_HOST, 
              pass: process.env.ETHREAL_PASSWORD, 
            },
        });

        let subject = "Welcome User";
        let text = "Thanks for Using Our App";
        let html = "<b>We hope that your life events come in sync after organising them on our platform.<br> Keep Rocking!!</b>";
        
        let { title, description, startDateTime, endDateTime } = data;
        if (title && description && startDateTime && endDateTime) {
            subject = "Task Created!";
            text = "Make sure you complete your task on time";
            html = `<b>here are your details :- <br>${title} <br>${description} <br>${startDateTime} <br>${endDateTime} </b>`
        }
    
        transporter.sendMail({
            from: `AngadRajSingh" <${process.env.EMAIL_HOST}>`,
            to: data.userEmail,
            subject: subject, 
            text: text, 
            html: html

        }).then (function () {
            console.log('mail sent successfully')
        }).catch (function (err) {
            console.log(err)
        })

    } catch (e) {
        console.log(e)
    }
}