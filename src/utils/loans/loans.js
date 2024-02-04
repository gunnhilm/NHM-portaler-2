const credentials = require('./credentials') 
const nodemailer = require("nodemailer");
const {TemplateHandler} = require('easy-template-x')
const fs = require('fs')
const path = require('path')
const invoiceTemplatePath = path.join(__dirname, '../loans/templates/PROFORMA_INVOICE.docx')
const outFilePath =  path.join(__dirname, '../loans/temps/proforma_invoice.docx')
const shippingDocumentationFilePath = path.join(__dirname, '../loans/temps/Shipping_documentation.docx')
const shippingDocTemplatePath = path.join(__dirname, '../loans/templates/Shipping_documentation.docx')
// Include Express Validator Functions
const  validation = require('validator');




// sanatizing the input
const keysToBeValidated = ['country', 'email', 'Institution', 'responsible-person', 'contact-person', 'other-person','post-address', 'street-address','phone','purpose', 'Special-documents']
const validateInput = (formData) => {
  for (const [key, value] of Object.entries(formData)) {
    if (keysToBeValidated.includes(key)) 
    {
      formData[key] = validation.escape(value).trim(value)
    }
  }
}

function parseLoanData(data) {
  let loanee = '<p> <h3>Lender Information </h3></p>'
  for (const [key, value] of Object.entries(data.loaneeInfo)) {
    loanee = loanee + '<b>' + key + '</b>: ' + value + '<br>'
  }

  let specimenData = '<tr><th>CatalogNummer</th> <th>Scienfific Name</th> <th>Country</th> <th>Locality</th> <th>Collection date</th> <th>Collector</th></tr>'
  for (let i = 0; i < Object.keys(data.items).length; i++) {
    specimenData = specimenData + '<tr><td>' + data.items[i].catalogNumber + '</td> <td>' + data.items[i].scientificName + '</td> <td>' + data.items[i].country + '</td> <td>' + data.items[i].locality + '</td> <td>' +data.items[i].eventDate + '</td> <td>' + data.items[i].recordedBy + '</td> </tr>'
  }

  parsedData = '<p>' + loanee + '</p><br><br>' + '<table>' + specimenData + '</table>'
  return parsedData
}
async function emailReceipt(data, loanee, lenderInfo) {

  try {
    data = '<p> You have sent the following request for loan (see below). If there are any errors, please respond to this email. </p>' + data;
    
    let transporter;
    
    // create reusable transporter object using the default SMTP transport
    if (process.platform === 'win32') {
      transporter = nodemailer.createTransport({
        host: "smtp.uio.no",
        port: 465,
        secure: true,
        auth: {
          user: credentials.credentials.username,
          pass: credentials.credentials.password,
        },
      });
    } else if (process.platform === 'linux') {
      transporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
      });
    } else {
      console.log('No mail is sent');
      return;
    }
    
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: lenderInfo, // sender address
      to: loanee.email, // list of receivers
      subject: "Automated response: Receipt for Loan request", // Subject line
      html: data, // html body
    });

    console.log("Receipt Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  } catch (error) {
    console.log('Emailing Receipt failed: ' + error);
  }
}


async function email(data, fileName, shippingDocumentationFileName, loanee) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter;
    
    // create reusable transporter object using the default SMTP transport
    if (process.platform === 'win32') {
      transporter = nodemailer.createTransport({
        host: "smtp.uio.no",
        port: 465,
        secure: true,
        auth: {
          user: credentials.credentials.username,
          pass: credentials.credentials.password,
        },
      });
    } else if (process.platform === 'linux') {
      transporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
      });
    } else {
      console.log('No mail is sent');
      return;
    }
    // send mail with defined transport object
    let info = await transporter.sendMail({
      // from: '"Eirik Rindal" <eirik.rindal@nhm.uio.no>', // sender address
      from: loanee.email, // sender address
      
      to: "eirik.rindal@nhm.uio.no", // list of receivers
      subject: "Loan reguest", // Subject line
      // text: data.cname, // plain text body
      html: data, // html body
      attachments: [
        {   // file on disk as an attachment
          filename: 'proforma_invoice.docx',
          path: fileName // stream this file
        }
      ],
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  } catch (error) {
    console.log('emaling failed' + error);   
  }
}

// write proforma invoice
async function writeFile(data, lenderInfo, itemData, outFilepath, templatePath)  {
  const template = fs.readFileSync(templatePath);
  const toDay = new Date().toISOString().slice(0,10)

  const items = {
    Adress: [
        { 'contact-person': data.loaneeInfo['contact-person'], 'Institution': data.loaneeInfo.Institution, 'country':data.loaneeInfo.country, 'post-address':data.loaneeInfo['post-address'], 'date': toDay, 'sender-name': lenderInfo.senderName, 'sender-email': lenderInfo.senderEmail }
    ],
    header: [ 
      {'collection': lenderInfo.collection, 'sender-name': lenderInfo.senderName, 'emailToCollection': lenderInfo.emailToCollection, 'ulrToCollection':lenderInfo.ulrToCollection}
    ],
    items: [
      {'noOfSpecimens': itemData.numberOfItems , 'value': itemData.singelValue, 'totalValue': itemData.totalValue, 'catalogNumbers': itemData.catalogNumbers.join(', ')}
    ],
  };
  const handler = new TemplateHandler();
  const doc = await handler.process(template, items);

  fs.writeFileSync(outFilepath, doc)
  return outFilepath
}


function getCorrectInfo (data) {
  let lenderInfo = require('./lenderInfo')
  const collection = data.admin.collection
  const museum = data.admin.museum
  lenderInfo = lenderInfo.lenderInfo[museum][collection]
  lenderInfo.museum = museum
  lenderInfo.collection = collection
  return lenderInfo

}

function getItemData(items) {
  const numberOfItems =Object.keys(items).length
  const catalogNumbers = []
  for (const [key, value] of Object.entries(items)) {
    const item = value
    for (const [key, value] of Object.entries(item)) {
      if(key === 'catalogNumber') {
        catalogNumbers.push(value)
      }
    }
  }

  const singelValue = Math.round(50/numberOfItems)
  const totalValue = singelValue*numberOfItems
  const itemData = {}
  itemData.singelValue = singelValue
  itemData.totalValue = totalValue
  itemData.numberOfItems = numberOfItems
  itemData.catalogNumbers = catalogNumbers
  return itemData
}

function getFormData (formData) {
  const loanInfo = {}
  loanInfo.loaneeInfo = {}
  let tempVar = formData.loanInfo
  delete formData.loanInfo
  tempVar = JSON.parse(tempVar)
    for (const pair of Object.entries(formData)) {
        loanInfo.loaneeInfo[pair[0]] = pair[1]
  }
  loanInfo.admin = tempVar.admin
  loanInfo.items = tempVar.items
  tempVar = ''
  return loanInfo
} 


async function  requestLoan (formData, fileData) {

  validateInput(formData)
  const data = getFormData(formData)
  const lenderInfo = getCorrectInfo(data)
  
  const itemData = getItemData(data.items)
  console.log(data.loaneeInfo);
  const invoiceFileName = await writeFile(data, lenderInfo, itemData, outFilePath, invoiceTemplatePath)
  const shippingDocumentationFileName = await writeFile(data, lenderInfo, itemData, shippingDocumentationFilePath, shippingDocTemplatePath )
  const parsedData =  parseLoanData(data)
  // email the collection with the request
  email(parsedData, invoiceFileName, shippingDocumentationFileName, data.loaneeInfo).catch(console.error);
  // email recite to customer
  emailReceipt(parsedData, data.loaneeInfo, lenderInfo.senderEmail).catch(console.error);
}

module.exports = {requestLoan}