const readline = require('readline');
const fs = require('fs')
const fsPromises = require('fs').promises;
const {TemplateHandler} = require('easy-template-x')
const path = require('path');

const setCollection = (museum, samling) => {
    console.log(museum + ' and ' + samling);
    if (samling === 'sopp') {
      return musitFile = './src/utils/labels/namesAndSynonymsFungi.json'  
    } if (samling === 'lichens') {
      return musitFile = './src/data/' + museum +'/namesAndSynonymsLichens.json'  
    } else {
      return false
    }
}


async function writeFile(dataArray, outFilepath, templatePath) {
    console.log('writing for names');
    console.log(dataArray.length);
  
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


// async function getValidNames(callback) {
//     try {
//         const museum = 'nhm'
//         const samling = 'fungi'
//         const nameFile = setCollection(museum, samling)
//         let data = await fsPromises.readFile(nameFile,
//         { encoding: 'utf8', flag: 'r' });
//         data = JSON.parse(data)
//         const validNames = []

//         for (let i = 0; i <  data.length; i++) {
//             const element = data[i]["Akseptert navn"];
//             validNames.push(element)
//         }
//         const nameString = JSON.stringify(validNames)
//         callback(undefined, nameString)

//     } catch (error) {
//         callback(error)    
//     }
// }

module.exports = { 
    writeskilleArk,
    getValidNames
 } 
 