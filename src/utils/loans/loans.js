const credentials = require('./credentials') 
const nodemailer = require("nodemailer");
const {TemplateHandler} = require('easy-template-x')
const fs = require('fs')
const path = require('path')
const templatePath = path.join(__dirname, '../loans/templates/PROFORMA_INVOICE.docx')
const template = fs.readFileSync(templatePath);
const outFilePath =  path.join(__dirname, '../loans/temps/proforma_invoice.docx')

function parseLoanData(data) {
  let lenderInfo = '<p> <h3>Lender Information </h3></p>'
  for (const [key, value] of Object.entries(data.lenderInfo)) {
    lenderInfo = lenderInfo + '<b>' + key + '</b>: ' + value + '<br>'
  }

  let specimenData = '<tr><th>CatalogNummer</th> <th>Scienfific Name</th> <th>Country</th> <th>Locality</th> <th>Collection date</th> <th>Collector</th></tr>'
  for (let i = 0; i < Object.keys(data.items).length; i++) {
    specimenData = specimenData + '<tr><td>' + data.items[i].catalogNumber + '</td> <td>' + data.items[i].scientificName + '</td> <td>' + data.items[i].country + '</td> <td>' + data.items[i].locality + '</td> <td>' +data.items[i].eventDate + '</td> <td>' + data.items[i].recordedBy + '</td> </tr>'
  }

  parsedData = '<p>' + lenderInfo + '</p><br><br>' + '<table>' + specimenData + '</table>'
  return parsedData
}

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
    subject: "Loan reguest", // Subject line
    // text: data.cname, // plain text body
    html: data, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

// write proforma invoice

async function writeInvoice(fields)  {
  console.log('skrive template');
  console.log(fields.lenderInfo.cname);
  const data = {
    reciverAdress: [
        { 'cname': fields.lenderInfo.cname, 'Institution': fields.lenderInfo.Institution }
    ]
  };
  const handler = new TemplateHandler();
  const doc = await handler.process(template, data);

  fs.writeFileSync(outFilePath, doc)
}

const requestLoan = (data) => {

    // writeInvoice(data)
   const parsedData =  parseLoanData(data)
    main(parsedData).catch(console.error);
}

module.exports = {requestLoan}