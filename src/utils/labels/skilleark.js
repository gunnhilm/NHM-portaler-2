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

// write skilleark
async function writeFile(dataArray, outFilepath, templatePath)  {
    console.log('writing for names'); 
    const template = fs.readFileSync(templatePath);
    for (let i = 0; i < dataArray.length; i++) {
        const data = dataArray[i];          
        const synsArray = []
        for (let i = 0; i < data.Synonymer.length; i++) {
            const synObj = {}
            const element = data.Synonymer[i];
            synObj.Synonymer = element
            synsArray.push(synObj)
        }
        console.log(synsArray);
        const items = {
        validName: [
            { 'Akseptert navn': data['Akseptert navn']}
        ],
        synonyms: synsArray,
        };
        const handler = new TemplateHandler();
        const doc = await handler.process(template, items);
    }
    fs.writeFileSync(outFilepath, doc)
    return outFilepath
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

async function writeskilleArk(names, museum, collection, callback){
    const outFilepath = path.join(__dirname, '../labels/out/skilleArk.doc')
    const skilleArkTemplatePath = path.join(__dirname, '../labels/templates/SKILLEARK.docx')
    try {
        dataArray = []
        if(Array.isArray(names)) {
            for (let i = 0; i < names.length; i++) {
                const element = names[i];
                if(element === 'value-1') {
                    continue
                }
                data = await search(element, museum, collection)
                dataArray.push(data)
            }
        }    
            const labelFile = await writeFile(dataArray, outFilepath, skilleArkTemplatePath) 
            console.log('labelfile: ' + labelFile);
            callback(undefined, labelFile)
    
    } catch (error) {
        callback(error)
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
 