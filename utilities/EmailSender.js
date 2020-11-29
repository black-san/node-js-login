var nodemailer = require('nodemailer');

const EMAIL_SERVICE_ADDRESS = 'youremail@gmail.com';
const EMAIL_SERVICE_PASSWORD = 'your password';

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_SERVICE_ADDRESS,
    pass: EMAIL_SERVICE_PASSWORD
  }
});

exports.sendMail = function (task) {

  var mailOptions = {
    from: EMAIL_SERVICE_ADDRESS,
    to: task.owner_email,
    subject: `[Notification] Congratulation! ${task.title} was approved.`,
    html: `
    <h4>******This email is send from NodeJS for Backend_Developer_Test******</h4><br/>
    Dear ${task.owner_email},<br/><br/>

    <p><b>Congratulation!</b> ${task.title} was approved. Please find the task detail in this email.
    <br/>Title: ${task.title}
    <br/>Description: ${task.description}
    <br/>Approved!</p><br/>
    
    Best regards,<br/><br/>
    
    <b>Patawee (Tutor) Dawan</b><br/>
    <h4>******This email is send from NodeJS for Backend_Developer_Test******</h4>`
    
  };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

};

