const nodemailer = require('nodemailer')

const EMAIL = 'weatherdashboard00@gmail.com'
const EMAIL_PASSWORD = 'jjyg tmoz quxh aksx'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    }
});

exports.sendEmail = async (recipient, subject, message) => {
    const mailOptions = {
        from: EMAIL,
        to: recipient,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}