const readline = require('readline');
const fs = require('fs')
const {TemplateHandler} = require('easy-template-x')
const path = require('path');
const { unparse } = require('papaparse');

// write skilleark
async function writeFile(data, outFilepath, templatePath)  {
    const template = fs.readFileSync(templatePath);
    const synsArray = []
    
    for (let i = 0; i < data.Synonymer.length; i++) {
        const synObj = {}
        const element = data.Synonymer[i];
        console.log(element);
        synObj.Synonymer = element
        synsArray.push(synObj)
        console.log(synsArray);
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
  
    fs.writeFileSync(outFilepath, doc)
    return outFilepath
  }

const setCollection = (museum, samling) => {
    if (samling === 'fungi') {
        musitFile = './src/utils/labels/namesAndSynonymsFungi.json'  
    } else if (samling === 'lichens') {
        musitFile = './src/data/' + museum +'/namesAndSynonymsLichens.json'  
    }
    // console.log(musitFile);
    return musitFile 
}

const search = async (searchTerm, museum, samling) => {
    // velg riktig synonym fil å lese
    const nameFile = setCollection(museum, samling)
    console.log(nameFile);
    if (fs.existsSync(nameFile)) {   
        return new Promise((resolve, reject) => {
            try {                
                // cleaning the searchterm before making the search so that we get a more precise
                // remove whiteSpace
                searchTerm = searchTerm.trim()
                // Case insensitve search
                searchTerm = searchTerm.toLowerCase()
                terms = searchTerm.split(' ')
                let results = ''
                const readInterface = readline.createInterface({
                    input: fs.createReadStream(nameFile),
                    console: false
                })

                let count = 0  // iterates over each line of the current file
                let resultCount = 0
                readInterface.on('line', function(line) {
                    count++
                    if(resultCount < 1) {
                        if (terms.length === 1){
                            if (line.toLowerCase().indexOf(terms[0]) !== -1) {
                                // søk for en match i linja  (line.indexOf(searchTerm) !== -1)
                                results =  line
                                resultCount++
                            } 
                        }
                        // Loope igjennom alle søkeordene og sjekke om de fins i linja
                        else if (line.toLowerCase().indexOf(terms[0]) !== -1) {
                            // Hvis linja inneholder det først søkeordet, sjekk om det også inneholder de andre
                            for(let i = 1; i < terms.length; i++){
                                if(line.toLowerCase().indexOf(terms[i]) === -1){
                                // hvis vi ikke får treff så bryter vi loopen (-1 = fant ikke)
                                    break;
                                }
                                // hvis alle runden med søk har gått bra så lagrer vi resultatet (må trekke fra 1 da arrayet er null basert)
                                if (i === (terms.length -1) ) {
                                    results =  line
                                    resultCount++
                                }
                            }
                        }
                    }
                }).on('close', function () {
                results = results.trim()
                results = results.slice(0, -1);
                if(results.endsWith(',')){
                    results = results.slice(0, -1);
                }
                    const resultObj = JSON.parse(results);
                    resolve(resultObj)
                })
            } catch (error) {
                reject('error')
            }
        });
        
    } else {
        throw new Error ('File not found ')
    }
}

async function writeskilleArk(name, callback){
    const outFilepath = path.join(__dirname, '../labels/out/skilleArk.doc')
    const skilleArkTemplatePath = path.join(__dirname, '../labels/templates/SKILLEARK.docx')
    try {
        data = await search(name, 'nhm', 'fungi')
        // data = await search('Cyathus olla', 'nhm', 'fungi')
        const labelFile = await writeFile(data, outFilepath, skilleArkTemplatePath) 
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

        for (let i = 0; i < data.length; i++) {
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
 