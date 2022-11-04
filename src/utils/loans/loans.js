const credentials = require('./credentials') 
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(data) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.uio.no",
    port: 465,
    secure: true,
    auth: {
      user: credentials.credentials.username, 
      pass: credentials.credentials.password, 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Eirik Rindal" <eirik.rindal@nhm.uio.no>', // sender address
    to: "eirik.rindal@nhm.uio.no", // list of receivers
    subject: "Hello ✔", // Subject line
    text: data.cname, // plain text body
    html: "<b>Hello world? </b>" +data, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

const requestLoan = (data) => {
    console.log('i lån på server');
    console.log(data.cname);
    main(data).catch(console.error);
}

module.exports = {requestLoan}