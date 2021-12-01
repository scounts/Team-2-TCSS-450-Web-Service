const nodemailer = require('nodemailer');
//const GROUP_EMAIL = process.env.AUTH_EMAIL;
const GROUP_PASSWORD = process.env.AUTH_PASSWORD;

let sendEmail = (sender, receiver, subject, message) => {
    //research nodemailer for sending email from node.
    // https://nodemailer.com/about/
    // https://www.w3schools.com/nodejs/nodejs_email.asp
    //create a burner gmail account 
    //make sure you add the password to the environmental variables
    //similar to the DATABASE_URL and PHISH_DOT_NET_KEY (later section of the lab)

    //fake sending an email for now. Post a message to logs. 
    console.log("*********************************************************")
    console.log('To: ' + receiver)
    console.log('From: ' + sender)
    console.log('Subject: ' + subject)
    console.log("_________________________________________________________")
    console.log(message)
    console.log("*********************************************************")

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: GROUP_EMAIL,
          pass: GROUP_PASSWORD
        }
      });

    var mailOptions = {
        from: GROUP_EMAIL,
        to: receiver,
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

module.exports = { 
    sendEmail
}