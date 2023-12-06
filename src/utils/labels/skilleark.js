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
                    
                    if (resultCount < 1) {
                        const lowerLine = line.toLowerCase();

                        if (terms.length === 1 && lowerLine.includes(terms[0])) {
                            results = line;
                            resultCount++;
                        } else if (terms.every(term => lowerLine.includes(term))) {
                            results = line;
                            resultCount++;
                        }
                    }
                }).on('close', function() {
                    results = results.trim().replace(/,\s*$/, '');
                    try {
                        const resultObj = JSON.parse(results);
                        resolve(resultObj);
                    } catch (parseError) {
                        reject('Parsing error');
                    }
                });
            } catch (error) {
                reject('Error reading file');
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

async function makeBoxNameArray(dataArray) {

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


  let oneName = '';
  let twoNames = '';
  let lessThanEightNames = '';
  let moreThanEightNames = '';

  const items = { validNames: [] };
  let validNameIndex = 1;
  let threeItem = [];
  let item = {};

  // for (let i = 0; i < dataArray.length; i++) {
  //   const element = dataArray[i];

  //   if (element.names.length === 1) {
  //     oneName = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${element.names[0]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/> <w:br/><w:t xml:space="preserve">  No.:</w:t></w:r>`;
  //     item = {
  //       _type: 'rawXml',
  //       xml: oneName,
  //       replaceParagraph: false,
  //     };
  //   } else if (element.names.length === 2) {
  //     twoNames = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${element.names[0]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/><w:t xml:space="preserve">  No.: </w:t><w:br/><w:br/><w:br/><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${element.names[1]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/><w:t xml:space="preserve">  No.: </w:t></w:r>`;
  //     item = {
  //       _type: 'rawXml',
  //       xml: twoNames,
  //       replaceParagraph: false,
  //     };
  //   } else if (element.names.length >= 3 && element.names.length <= 7) {
  //     lessThanEightNames = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${element.names[0]} <w:br/>  ${element.names[1]}<w:br/>  ${element.names[2]}<w:br/>  ${element.names[3]}<w:br/>  ${element.names[4]}<w:br/>  ${element.names[5]}<w:br/>  ${element.names[6]}<w:br/><w:rPr><w:i w:val="false"/></w:rPr></w:t></w:r>`;
  //     item = {
  //       _type: 'rawXml',
  //       xml: lessThanEightNames,
  //       replaceParagraph: false,
  //     };
  //   } else if (element.names.length > 8) {
  //     const elementLast = element.names[element.names.length - 1];
  //     moreThanEightNames = `<w:r><w:rPr><w:i/></w:rPr><w:t xml:space="preserve">  ${element.names[0]} <w:t xml:space="preserve"> <w:br/>                    --> <w:br/>  ${elementLast}</w:t><w:rPr><w:i w:val="false"/></w:rPr></w:r>`;
  //     item = {
  //       _type: 'rawXml',
  //       xml: moreThanEightNames,
  //       replaceParagraph: false,
  //     };
  //   } 

  for (let i = 0; i < dataArray.length; i++) {
    const element = dataArray[i];

    if (element.names.length === 1) { // If element has only one name
        item.xml = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${element.names[0]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/> <w:br/><w:t xml:space="preserve">  No.:</w:t></w:r>`;
    } else if (element.names.length === 2) { // If element has two names
        item.xml = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${element.names[0]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/><w:t xml:space="preserve">  No.: </w:t><w:br/><w:br/><w:br/><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${element.names[1]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/><w:t xml:space="preserve">  No.: </w:t></w:r>`;
    } else if (element.names.length >= 3 && element.names.length <= 7) { // If element has three to seven names
        item.xml = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${element.names[0]} <w:br/>  ${element.names[1]}<w:br/>  ${element.names[2]}<w:br/>  ${element.names[3]}<w:br/>  ${element.names[4]}<w:br/>  ${element.names[5]}<w:br/>  ${element.names[6]}<w:br/><w:rPr><w:i w:val="false"/></w:rPr></w:t></w:r>`;
    } else if (element.names.length > 8) { // If element has more than eight names
        const elementLast = element.names[element.names.length - 1]; // Access the last name in the element
        item.xml = `<w:r><w:rPr><w:i/></w:rPr><w:t xml:space="preserve">  ${element.names[0]} <w:t xml:space="preserve"> <w:br/>                    --> <w:br/>  ${elementLast}</w:t><w:rPr><w:i w:val="false"/></w:rPr></w:r>`;
    }

    item._type = 'rawXml';
    item.replaceParagraph = false;
}

console.log(item);

  //   // Create the object with a specific name
  //   let objectName = `name${validNameIndex}`;

  //   let name . validNameIndex = {
  //     _type: item._type,
  //     xml: item.xml,
  //     replaceParagraph: item.replaceParagraph,
  //   };
    
  //   delete item;
  //   threeItem.push(objectName);
  //   validNameIndex++;

  //   if (validNameIndex > 3 || dataArray.length === i + 1) {
  //     validNameIndex = 1;
  //     items.validNames.push(threeItem);
  //     threeItem = [];
  //   }
  //}

  let transformedItems = {
    validNames: items.validNames.map(subArray => Object.assign({}, ...subArray)),
  };
  return transformedItems;
}

//   const things = {
//     validName: [
//       {
//         'navn1': 'bus', 'navn2': 'cus', 'navn3':'per petterson', 'navn4': 'kåre Anderson', 'AkseptertNavn3': 'gus', 'no1':'Nr.:', 'no2':'Nr.:', 'no3':'Nr.:'
//       },
//       {
//         'AkseptertNavn1': [{'navn1':'per petterson', 'navn2': 'kåre Anderson'}], 'AkseptertNavn2': 'hei på deg', 'AkseptertNavn3': 'nope', 'no1':'Nr.:', 'no2':'Nr.:', 'no3':'Nr.:'

//       },
//       {
//         'AkseptertNavn1': 'gus',
//       },
//     ]
//     ,
//     'rawxml': {
//       _type: 'rawXml',
//       xml: oneName,
//       replaceParagraph: false,
//     },
//     'rawxml2': {
//       _type: 'rawXml',
//       xml: twoNames,
//       replaceParagraph: false,
//     },
//     'rawxml3': {
//       _type: 'rawXml',
//       xml: lessThanEightNames,
//       replaceParagraph: false,
//     },
//     'rawxml4': {
//       _type: 'rawXml',
//       xml: moreThanEightNames,
//       replaceParagraph: false,
//     },
// };

  // oneName = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${elements[1]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/> <w:br/><w:t xml:space="preserve">  No.:</w:t></w:r>`
  // // '<w:rPr><w:i/></w:rPr> <w:t>hei hei hei</w:t><w:i w:val="false"/></w:rPr>'
  // twoNames = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${elements[1]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/><w:t xml:space="preserve">  No.: </w:t><w:br/><w:br/><w:br/><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${elements[2]} <w:rPr><w:i w:val="false"/></w:rPr><w:br/><w:t xml:space="preserve">  No.: </w:t></w:r>`
  // // '<w:rPr><w:i/></w:rPr> <w:t>name2</w:t><w:rPr><w:i w:val="false"/></w:rPr>'
  // lessThanEightNames = `<w:r><w:rPr><w:i/></w:rPr><w:r><w:t xml:space="preserve">  ${elements[1]} <w:br/>  ${elements[2]}<w:br/>  ${elements[3]}<w:br/>  ${elements[4]}<w:br/>  ${elements[5]}<w:br/>  ${elements[6]}<w:br/>  ${elements[7]}<w:br/><w:rPr><w:i w:val="false"/></w:rPr></w:t></w:r>`
  // // '<w:rPr><w:i/></w:rPr> <w:t>name2</w:t><w:rPr><w:i w:val="false"/></w:rPr>'
  // moreThanEightNames = `<w:r><w:rPr><w:i/></w:rPr><w:t xml:space="preserve">  ${elements[1]} <w:t xml:space="preserve"> <w:br/>                    --> <w:br/>  ${elementLast}</w:t><w:rPr><w:i w:val="false"/></w:rPr></w:r>`
 

 
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


async function getValidNames(museum, collection) {
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
            const element = data[i]["Akseptert navn"];
            validNames.push(element)
        }

        const nameString = JSON.stringify(validNames)
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
 