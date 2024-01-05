const readline = require('readline');
const fs = require('fs')
const fsPromises = require('fs').promises;
const {TemplateHandler} = require('easy-template-x')
const path = require('path');

 
const setCollection = (museum, samling) => {
    if (samling === 'sopp') {
      return musitFile = './src/utils/labels/namesAndSynonymsFungi.json'  
    } if (samling === 'lichens') {
      return musitFile = './src/data/' + museum +'/namesAndSynonymsLichens.json'  
    } else {
      return false
    }
}

async function writeFile(dataArray, outFilepath, templatePath) {
 
    const template = await fsPromises.readFile(templatePath);
    let doc = '';
    const items = { 'loop': [] };
  
    for (let i = 0; i < dataArray.length; i++) {
      const data = dataArray[i];
      const synsArray = [];

      for (let j = 0; j < data.Synonymer.length; j++) {
        const synObj = {};
        const element = data.Synonymer[j];
        synObj.Synonymer = element;
        synsArray.push(synObj);
      }
  
 
      const item = {
        validName: [
          { 'Akseptert navn': data['Akseptert navn'] }
        ],
        synonyms: synsArray,
        'pagebreak': {
          _type: 'rawXml',
          xml: '<w:br w:type="page"/>',
          replaceParagraph: false,
        },
      };
  
      items.loop.push(item);
  
    }
  console.log(items);
    const handler = new TemplateHandler();
    doc = await handler.process(template, items);
  
    await fsPromises.writeFile(outFilepath, doc)
    return outFilepath; 
}

const search = async (searchTerm, museum, samling) => {
    const nameFile = setCollection(museum, samling); // Assuming you have a function setCollection() to determine the filename
    if ( fs.existsSync(nameFile)) {
        return new Promise((resolve, reject) => {
            try {
                searchTerm = searchTerm.trim().toLowerCase();
                const terms = searchTerm.split(' ');
                let results = '';
                let resultCount = 0;
                const readInterface = readline.createInterface({
                    input: fs.createReadStream(nameFile),
                    console: false
                });
                readInterface.on('line', function(line) {
                    const Newline = line.replace(/\|/g, ' ')
                    if (resultCount < 1) {
                        const lowerLine = Newline.toLowerCase();
                        if (terms.length === 1 && lowerLine.includes(terms[0])) {
                          
                            results = Newline;
                            resultCount++;
                        } else if (terms.every(term => lowerLine.includes(term))) {
                          
                            results = Newline;
                            resultCount++;
                        }
                    }
                }).on('close', function() {
                  if (results.startsWith('[')) {
                    results = results.slice(1);
                  }
                  if (results.endsWith(']')) {
                    results = results.slice(0, -1);
                  }
                    results = results.trim().replace(/,\s*$/, '');
                    try {
                        const resultObj = JSON.parse(results);
                        resolve(resultObj);
                    } catch (parseError) {
                        reject('Parsing error in the search function: ' + parseError);
                    }
                });
            } catch (error) {
                reject('Error reading file: ' + error);
            }
        });
    } else {
        throw new Error('File not found');
    }
}

async function writeskilleArk(names, museum, collection) {
  const FileName = `${Date.now()}_skilleArk.doc`;
  const outFilepath = './public/forDownloads/labels/' + FileName;
  const skilleArkTemplatePath = path.join(__dirname, '../labels/templates/SKILLEARK.docx');
    try {
      const dataArray = [];
  
      if (Array.isArray(names)) {
        for (let i = 0; i < names.length; i++) {
          const element = names[i];
          if (element === 'value-1') {
            continue;
          }
          const data = await search(element, museum, collection);
          dataArray.push(data);
        }
      }
  
      await writeFile(dataArray, outFilepath, skilleArkTemplatePath);
      return { FileName, outFilepath };
  
    } catch (error) {
      throw error;
    }
}


  dataArray = 
[
  {names: ['aus', 'bus'], no: true },
  {names: ['cus'], no: true},
  {names: ['cus', 'dus', 'eus', 'fus'], no:false},
  {names: ['Gus aus', 'Gus bus'], no: true },
  {names: ['Gus cus'], no: true},
  {names: ['Gus cus', 'Gus dus', 'eGus us', 'Gus fus'], no:false},
  {names: ['Gus startus', 'Gus dus', 'Gus us', 'Gus fus', 'Gus cus', 'Gus dus', 'Gus us', 'Gus us', 'Gus endus'], no:false},
  {names: ['Gus sixus',  'Gus fus', 'Gus cus', 'Gus dus', 'Gus us', 'Gus endus'], no:false},
  {names: ['Gus sevenus', 'Gus dus', 'Gus us', 'Gus fus', 'Gus cus', 'Gus dus', 'Gus us'], no:false}
]


// make the array with names and styling for the box labels
async function makeBoxNameArray(dataArray) {

const items = { validNames: [] };
let validNameIndex = 1;
let item = {};
let threeItem = {};
for (let i = 0; i < dataArray.length; i++) {
  const element = dataArray[i];
  if (element.names.length === 1) {
    item.xml = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${element.names[0]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/> <w:br/><w:t xml:space="preserve">  No.:</w:t></w:r>`;
  } else if (element.names.length === 2) {
    item.xml = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${element.names[0]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/><w:t xml:space="preserve">  No.: </w:t><w:br/><w:br/><w:br/><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${element.names[1]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/><w:t xml:space="preserve">  No.: </w:t></w:r>`;
  } else if (element.names.length >= 3 && element.names.length <= 7) {
    var namesXml = '';
  
    for (var j = 0; j < element.names.length; j++) {
      namesXml += `${element.names[j]}<w:br/> `;
    }
  
    item.xml = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${namesXml}<w:rPr><w:i w:val="false"/></w:rPr></w:t></w:r>`;
  } else if (element.names.length > 8) {
    const elementLast = element.names[element.names.length - 1];
    item.xml = `<w:r><w:rPr><w:i/></w:rPr><w:t xml:space="preserve">  ${element.names[0]} <w:t xml:space="preserve"> <w:br/>                    --> <w:br/>  ${elementLast}</w:t><w:rPr><w:i w:val="false"/></w:rPr></w:r>`;
  }

  item._type = 'rawXml';
  item.replaceParagraph = false;

  if (validNameIndex === 1) {
    const navn1 = Object.assign({}, item);
    threeItem['navn1'] = navn1;
    validNameIndex += 1;
  } else if (validNameIndex === 2) {
    const navn2 = Object.assign({}, item);
    threeItem['navn2'] = navn2;
    validNameIndex += 1;
  } else if (validNameIndex === 3 || i === dataArray.length - 1) {
    const navn3 = Object.assign({}, item);
    threeItem['navn3'] = navn3;
    items.validNames.push(threeItem);
    validNameIndex = 1;
    threeItem = {};
  
    // Check if it's the last element in the dataArray
    if (i === dataArray.length - 1 && validNameIndex !== 1) {
      items.validNames.push({ navn1: item });
    }
  }
  
  
}
if(validNameIndex !== 1) {
  const remainingValidNames = Object.fromEntries(
    Object.entries(threeItem)
      .filter(([key, value]) => value !== undefined)
  );
  items.validNames.push(remainingValidNames);
}
console.log('her kommer items');
console.log(items);
return items;
}
// const rawxml4 = {
//   _type: 'rawXml',
//   xml: 'hei hei',
//   replaceParagraph: false,
// }

// items.validNames.push(rawxml4);


// const elements = ['aus', 'bus', 'cus', 'dus', 'eus', 'fus', 'gus', 'hus',  'ius', 'jus'] 
// const elementLast = 'sistus'
//   oneName = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${elements[1]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/> <w:br/><w:t xml:space="preserve">  No.:</w:t></w:r>`
//   // '<w:rPr><w:i/></w:rPr> <w:t>hei hei hei</w:t><w:i w:val="false"/></w:rPr>'
//   twoNames = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${elements[1]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/><w:t xml:space="preserve">  No.: </w:t><w:br/><w:br/><w:br/><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${elements[2]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/><w:t xml:space="preserve">  No.: </w:t></w:r>`
//   // '<w:rPr><w:i/></w:rPr> <w:t>name2</w:t><w:rPr><w:i w:val="false"/></w:rPr>'
//   lessThanEightNames = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${elements[1]} <w:br/>  ${elements[2]}<w:br/>  ${elements[3]}<w:br/>  ${elements[4]}<w:br/>  ${elements[5]}<w:br/>  ${elements[6]}<w:br/>  ${elements[7]}<w:br/><w:rPr><w:i w:val="false"/></w:rPr></w:t></w:r>`
//   // '<w:rPr><w:i/></w:rPr> <w:t>name2</w:t><w:rPr><w:i w:val="false"/></w:rPr>'
//   moreThanEightNames = `<w:r><w:rPr><w:i/></w:rPr><w:t xml:space="preserve">  ${elements[1]} <w:t xml:space="preserve"> <w:br/>                    --> <w:br/>  ${elementLast}</w:t><w:rPr><w:i w:val="false"/></w:rPr></w:r>`
 

// const things = {
//   validName: [
//     {
//       'navn1': 'bus', 'navn2': 'cus', 'navn3':'per petterson', 'navn4': 'kåre Anderson', 'AkseptertNavn3': 'gus', 'no1':'Nr.:', 'no2':'Nr.:', 'no3':'Nr.:'
//     },
//     {
//       'AkseptertNavn1': [{'navn1':'per petterson', 'navn2': 'kåre Anderson'}], 'AkseptertNavn2': 'hei på deg', 'AkseptertNavn3': 'nope', 'no1':'Nr.:', 'no2':'Nr.:', 'no3':'Nr.:'

//     },
//     {
//       'AkseptertNavn1': 'gus',
//     },
//   ]

//   ,
//   'rawxml': {
//     _type: 'rawXml',
//     xml: oneName,
//     replaceParagraph: false,
//   },
//   'rawxml2': {
//     _type: 'rawXml',
//     xml: twoNames,
//     replaceParagraph: false,
//   },
//   'rawxml3': {
//     _type: 'rawXml',
//     xml: lessThanEightNames,
//     replaceParagraph: false,
//   },
//   'rawxml4': {
//     _type: 'rawXml',
//     xml: moreThanEightNames,
//     replaceParagraph: false,
//   },
// };




// { validNames: [{ key: 'value' }] }


 
async function writeBoxLabel(names, museum, collection, includeBoxNumbers) {
  let outFilepath = ''
  let FileName = ''
  if(museum === 'nhm' && collection === 'sopp') {
    FileName = `${Date.now()}_boxArk.doc`;
    outFilepath = './public/forDownloads/labels/' + FileName;
  } else {
    throw error;
  }
  const skilleArkTemplatePath = path.join(__dirname, '../labels/templates/BOXARK_with_No.docx');

  try {
    const items = await makeBoxNameArray(names);
  
    const template = await fsPromises.readFile(skilleArkTemplatePath);
    const handler = new TemplateHandler();
    const doc = await handler.process(template, items);

    await fsPromises.writeFile(outFilepath, doc);
    return { FileName, outFilepath };

  } catch (error) {
    throw error;
  }
}


async function getValidNames(museum, collection, labelType) {
  console.log('labelType: ' + labelType);
    try {
        const nameFile = setCollection(museum, collection)
        if(nameFile) {
        let data = await fsPromises.readFile(nameFile, {
            encoding: 'utf8',
            flag: 'r'
        })
        data = JSON.parse(data)

        const validNames = []

        for (let i = 0; i < data.length; i++) {
            const element = data[i]['Akseptert navn'];
            
            validNames.push(element)
        }
        validNames.sort()
        const nameString = JSON.stringify(validNames)
        // console.log(validNames);
        return nameString;
      } else {
        return false
      }
    } catch (error) {
        throw error;
    }
}

async function selectLabel(names, museum, collection, labelType, extraInfo) {
  if (labelType === 'unit') {
    return await writeskilleArk(names, museum, collection);
  }
  else if (labelType === 'box') {
    return await writeBoxLabel(names, museum, collection, extraInfo);
  } 
  else {
    throw new Error('Invalid label type');
  }
}


module.exports = { 
  selectLabel,
  getValidNames
} 
 