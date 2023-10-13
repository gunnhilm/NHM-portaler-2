const readline = require('readline');
const fs = require('fs')
const {TemplateHandler} = require('easy-template-x')
const path = require('path');

const setCollection = (museum, samling) => {
    console.log(museum + ' and ' + samling);
    if (samling === 'fungi') {
        musitFile = './src/utils/labels/namesAndSynonymsFungi.json'  
    } else if (samling === 'lichens') {
        musitFile = './src/data/' + museum +'/namesAndSynonymsLichens.json'  
    }
    // console.log(musitFile);
    return musitFile 
}

// // write skilleark
// async function writeFile(dataArray, outFilepath, templatePath)  {
//     console.log('writing for names'); 
//     console.log(dataArray.length);
//     let doc = ''
//     const template = fs.readFileSync(templatePath);
//     for (let i = 0; i < dataArray.length; i++) {
//         const data = dataArray[i];          
//         const synsArray = []
//         for (let i = 0; i < data.Synonymer.length; i++) {
//             const synObj = {}
//             const element = data.Synonymer[i];
//             synObj.Synonymer = element
//             synsArray.push(synObj)
//         }
//         console.log(synsArray);
//         const items = {
//             'loop': [
//                 {
//                 validName: [
//                     { 'Akseptert navn': data['Akseptert navn']}
//                 ],
//                 synonyms: synsArray,
//                 'pagebreak': {
//                     _type: 'rawXml',
//                     xml: '<w:br w:type="page"/>',
//                     replaceParagraph: false,  // Optional - should the plugin replace an entire paragraph or just the tag itself
//                 },
//             }]
//         };
//         const handler = new TemplateHandler();
//         doc = await handler.process(template, items);
//     }
//     /*
//     const items =  {
//         'loop': [
//             {
//             'Akseptert navn': 'første navn',
//             'Synonymer' : 'første synonym',
//             'pagebreak': {
//                     _type: 'rawXml',
//                     xml: '<w:br w:type="page"/>',
//                     replaceParagraph: false,  // Optional - should the plugin replace an entire paragraph or just the tag itself
//                 },
//             },{'Akseptert navn': 'andre navn',
//             'Synonymer' : 'andre synonym',
//             'pagebreak': {
//                     _type: 'rawXml',
//                     xml: '<w:br w:type="page"/>',
//                     replaceParagraph: false,  // Optional - should the plugin replace an entire paragraph or just the tag itself
//                 }
//             }
//         ]
//     }
//     */
//     // const handler = new TemplateHandler();
//     // doc = await handler.process(template, items);
//     fs.writeFileSync(outFilepath, doc)
//     return outFilepath
//   }

/*
async function writeFile(dataArray, outFilepath, templatePath) {
    console.log('writing for names');
    console.log(dataArray.length);
  
    const template = fs.readFileSync(templatePath);
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
  
      console.log(synsArray);
  
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
  
    const handler = new TemplateHandler();
    doc = await handler.process(template, items);
  
    fs.writeFileSync(outFilepath, doc);
    return outFilepath;
  }
*/  

async function writeFile(dataArray, outFilepath, templatePath) {
    console.log('writing for names');
    console.log(dataArray.length);
  
    const template = fs.readFileSync(templatePath);
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
  
      console.log(synsArray);
  
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
  
      if (i === dataArray.length - 1) {
        delete item.pagebreak;
      }
  
      items.loop.push(item);
  
    }
  
    const handler = new TemplateHandler();
    doc = await handler.process(template, items);
  
    fs.writeFileSync(outFilepath, doc);
    return outFilepath;
  }
  


const search = async (searchTerm, museum, samling) => {
    const nameFile = setCollection(museum, samling); // Assuming you have a function setCollection() to determine the filename
    if (fs.existsSync(nameFile)) {
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
    const outFilepath = path.join(__dirname, '../labels/out/skilleArk.doc');
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
  
      const labelFile = await writeFile(dataArray, outFilepath, skilleArkTemplatePath);
      console.log('labelfile: ' + labelFile);
  
      return labelFile;
  
    } catch (error) {
      throw error;
    }
  }



function getValidNames(callback) {
    try {
        const museum = 'nhm'
        const samling = 'fungi'
        const nameFile = setCollection(museum, samling)
        let data = fs.readFileSync(nameFile,
        { encoding: 'utf8', flag: 'r' });
        data = JSON.parse(data)
        const validNames = []

        for (let i = 0; i <  10; i++) {// data.length; i++) {
            const element = data[i]["Akseptert navn"];
            validNames.push(element)
        }
        const nameString = JSON.stringify(validNames)
        callback(undefined, nameString)

    } catch (error) {
        callback(error)    
    }
}

module.exports = { 
    writeskilleArk,
    getValidNames
 } 
 