// https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
const readline = require('readline');
const fetch = require('node-fetch')
const fs = require('fs')
const fileListNhm = require('./fileListNhm')
const fileListTmu = require('./fileListTmu')
const fileListUm = require('./fileListUm')
const fileListNbh = require('./fileListNbh')

// logging av søkeord 
const { Console, log } = require("console");

// formate date
const getDate = () => {
    return new Date().toISOString().replace(/\..+/, '')
}

// make a new logger
const myLogger = new Console({
  stdout: fs.createWriteStream("./log/" +  Date.now() + "_normalStdout.txt"),
  stderr: fs.createWriteStream("./log/" +  Date.now() + "_errStdErr.txt"),
});

function makeHeader () {
    myLogger.log('Museum\tcollection\tsearchTerm\tdate\ttype of search');
}

makeHeader()


const getFileList = (museum) => {
    let fileList = ''
    if (museum == 'tmu') {
        fileList = fileListTmu
    } else if (museum == 'um') {
        fileList = fileListUm
    } else if (museum == 'nbh') {
        fileList = fileListNbh
    } else {
        fileList = fileListNhm
    }
    return fileList
}

const fileListObject = (museum) => {
    let fileList = getFileList(museum)
    let fileListObject = fileList
    return fileListObject
}


// orgGroup = botanikk, mykologi, zoologi osv
const setOrgGroups = (museum) => {
    const fileList = getFileList(museum)
    let orgGroups = []
    fileList.forEach(el => {
        if (el.orgGroup) {
            orgGroups.push(el.orgGroup)
        }
    })
    let uniqueOrgGroups = [...new Set(orgGroups)]
    return uniqueOrgGroups
}

const getOrgGroup = (museum, samling) => {
    const fileList = getFileList(museum)
    let orgGroup = ''
    fileList.forEach(element => {
        if (element.name === samling){
            orgGroup = element.orgGroup
        }
    })
    return orgGroup
}

const setSubcollections = (museum, orgGroup) => {
    const fileList = getFileList(museum)
    let coll = []
    fileList.forEach(el => {
        if (el.orgGroup === orgGroup) {
            coll.push(el.name)
        }
    })
    return coll
}

const getAllcollections = (museum) => {
    const fileList = getFileList(museum)
    let coll = []
    fileList.forEach(el => {
            coll.push(el.name)
    })
    // remove null items
    return coll.filter(Boolean)
}

const setCollection = (museum, samling) => {
    const fileList = getFileList(museum)
    let musitFile = ''
    const pathToMuseum = './src/data/' + museum + '/'
    if (samling === 'zooJournaler') {
        musitFile = './src/data/' + museum +'/archive/zooJournaler.txt'  
    } else if (samling === 'palJournaler') {
        musitFile = './src/data/' + museum +'/archive/palJournaler.txt'  
    } else if (samling === 'botJournaler') {
        musitFile = './src/data/' + museum +'/archive/botJournaler.txt'  
    } else if (samling === 'archive') {
        musitFile = './src/data/' + museum +'/archive/archive.txt'  
    }  else if (samling === 'Botaniske Illustrasjoner') {
        musitFile = './src/data/' + museum +'/archive/botaniskeIllustrasjoner.txt'  
    }  else if (samling === 'Dagny Tande Lid') {
        musitFile = './src/data/' + museum +'/archive/DTLIllustrations.txt'         
    } else if (samling === 'fieldNotes') {
        musitFile = './src/data/' + museum +'/archive/fieldNotes.txt'  
    }  else if (samling === 'Rolf Y. Berg') {
        musitFile = './src/data/' + museum +'/archive/Dias_RYB.txt'  
    } else {
        fileList.forEach(element => {
            if (element.name === samling){
                musitFile = pathToMuseum + element.name + element.occurrenceFileSuffix
            }
        })
    }
    return musitFile 
}

const whichFileDb = (museum,collection) => {
    let result = []
    const fileList = getFileList(museum)
    fileList.forEach(element => {
        if(element.name === collection) {
            result.push(element.occurrenceFileSuffix)
            result.push(element.source)
        }
    })

    return result
}


// to figure out wheter collection is in musit or corema
const getSource = (museum,samling) => {
    try {
        const fileList = getFileList(museum)
    
        function findSource(item) {
            if(item.name === samling || item.source === samling){
                return item.source
            }
        }
        const result = fileList.find(findSource);
        return result.source

    } catch (error) {
        return 'NA' 
    }
}

const trimResults = (resultString, museum, samling) => { 
    const source = getSource(museum, samling)
    const resultsArray = resultString.split('\n');
    if (resultsArray.length === 0) return [];
    const headers = resultsArray[0].split('\t');

    if (!['access', 'excel', 'archive', 'journals', 'NA'].includes(source)) {
        // This array defines what data will be returned
        const elementsToKeep = [
            'catalogNumber', 'scientificName', 'identificationQualifier', 'recordedBy',
            'eventDate', 'country', 'county', 'locality', 'decimalLongitude',
            'decimalLatitude', 'habitat', 'basisOfRecord', 'associatedMedia', 'institutionCode',
            'collectionCode', 'coremaBasisOfRecord', 'materialSampleType', 'preparationType', 'scientificNameAuthorship', 'lineNumber'
        ];
        
        // Map headers to their indices if they're in elementsToKeep
        const indicesToKeep = headers
            .map((header, index) => elementsToKeep.includes(header) ? index : -1)
            .filter(index => index !== -1);

        // Create a header string using elementsToKeep adapted to original headers
        const filteredHeaders = indicesToKeep.map(index => headers[index]);

        // Create the filtered results based on indicesToKeep
        const filteredResults = resultsArray.slice(1).map(row => {
            const splitRow = row.split('\t');
            return indicesToKeep.map(index => splitRow[index]);
        });

        // Return an array starting with the headers
        return [filteredHeaders, ...filteredResults];
    } else {
        //make resultsstring into an array
        

        unfilteredResults = []
        for (let i = 0; i < resultsArray.length; i++) {
            const element = resultsArray[i].split('\t');
            unfilteredResults.push(element)
        }
        
        return unfilteredResults
    }
}

const search = (museum, samling, searchTerm, linjeNumber = 0, limit = 20, callback) => {
    
    const date = getDate();
    myLogger.log(`${museum}\t${samling}\t${searchTerm}\t${date}\tsimple search`);
    limit = parseInt(limit); // make limit a number

    const musitFile = setCollection(museum, samling);
 
    if (!fs.existsSync(musitFile)) {
        myLogger.error('File not found');
        throw new Error('File not found');
    }

    searchTerm = searchTerm.trim().toLowerCase();
    const isSingleTerm = searchTerm.split(' ').length === 1;
    const terms = isSingleTerm ? [searchTerm] : searchTerm.split(' ');

    let results = '';
    let count = 0;
    let resultCount = 0;

    const readInterface = readline.createInterface({
        input: fs.createReadStream(musitFile),
        console: false
    });

    readInterface.on('line', function(line) {
        
        count++;
        if (resultCount === limit) {
            readInterface.close();
        } 

        if (count === 1) {
            //headerRow
            results = line + '\tlineNumber';
            
        } else {
            if (isSingleTerm && line.toLowerCase().includes(searchTerm)) {               
                results += `\n${line}\t${count}`;
                resultCount++;
            } else if (terms.every(term => line.toLowerCase().includes(term))) {
                results += `\n${line}\t${count}`;
                resultCount++;
            }
        }
    }).on('close', function() {                      
        results = trimResults(results, museum, samling)
        const resultsAndLine = {results, count};
        callback(undefined, resultsAndLine);
    });
}

// advanced search
const advSearch = (museum, samling, searchSpecies, searchCollector, searchDate, searchCountry, searchCounty, searchMunicipality, searchLocality, searchCollNo, searchTaxType, linjeNumber = 0, limit = 20, hasPhoto, callback) => {
    // velg riktig MUSIT dump fil å lese
    let concatSearchterm = searchSpecies + ' ' + searchCollector + ' ' +  searchDate + ' ' +  searchCountry + ' ' +  searchCounty + ' ' +  searchMunicipality + ' ' +  searchLocality + ' ' +  searchCollNo + ' ' +  searchTaxType
    const date = getDate()
    myLogger.log( museum + '\t' + samling + '\t' + concatSearchterm + '\t' + date + '\tadvsearch');
    musitFile = setCollection(museum,samling)
    if (fs.existsSync(musitFile)) {
        // cleaning the searchterm before making the search so that we get a more precise
        // remove whiteSpace,
        let termsArray = [searchSpecies, searchCollector, searchDate, searchCountry, searchCounty, searchMunicipality, searchLocality, searchCollNo, searchTaxType, hasPhoto]
        for (var i = 0; i < termsArray.length; i++) {
            termsArray[i] = termsArray[i].trim().toLowerCase()
        }
        let results = ''
        const readInterface = readline.createInterface({
            input: fs.createReadStream(musitFile),
            console: false
        })

        let count = 0  // iterates over each line of the current file
        let resultCount = 0
        // array med overskrifter på de kolonnene vi skal søke i
        let headerTerms
        headerTerms = ['scientificName','recordedBy','eventDate','country','stateProvince','county','locality','recordNumber','typeStatus','associatedMedia']
        let headers = []
        readInterface.on('line', function(line) {
            count++
            if (resultCount == limit) {
                readInterface.close()
            }
            if (count === 1) {
                // results = line
                headers = line.split('\t')
                
                 results = line + '\tlineNumber';
            } else {
                let lineArray = line.split('\t')
                if (lineArray[headers.indexOf(headerTerms[0])].toLowerCase().indexOf(termsArray[0]) !== -1) {
                    // Hvis linja inneholder det først søkeordet, sjekk om det også inneholder de andre
                    for(let i = 1; i < termsArray.length; i++){
                        
                        if (headers.indexOf(headerTerms[i]) != -1) {
                            if (i < (termsArray.length - 1)) {
                                if(lineArray[headers.indexOf(headerTerms[i])].toLowerCase().indexOf(termsArray[i]) === -1){
                                // hvis vi ikke får treff så bryter vi loopen (-1 = fant ikke),
                                    break;
                                } 
                            } else if (i === (termsArray.length -1) ) {
                                // check for last searchTerm; associatedMedia
                                if (termsArray[i] === 'hasphoto') {
                                    if (!lineArray[headers.indexOf(headerTerms[i])]) {
                                        break;
                                    } else {
                                        // results =  results +  '\n' + line
                                        // resultCount++  
                                        results += `\n${line}\t${count}`;
                                        resultCount++;
                                    }
                                } else if (termsArray[i] === 'hasnotphoto') {
                                    if (lineArray[headers.indexOf(headerTerms[i])]) {
                                        break;
                                    } else {
                                        // results =  results +  '\n' + line
                                        // resultCount++  
                                        results += `\n${line}\t${count}`;
                                        resultCount++;
                                    }
                                } else {
                                    // results =  results +  '\n' + line
                                    // resultCount++  
                                    results += `\n${line}\t${count}`;
                                    resultCount++;
                                }
                            }
                        }
                    }
                }
            }
        }).on('close', function () {
            // const resulstAndLine = {results, count }
            // callback(undefined, resulstAndLine)
            results = trimResults(results, museum, samling)
            const resultsAndLine = {results, count};
            callback(undefined, resultsAndLine);
        })
       
    } else {
        throw new Error ('File not found ')
    }
}

// object list search, seach for object number or several numbers, searchObjects = one or more object numbers without prefixes, comma or space separated
const objListSearch = (museum, samling, searchObjects, linjeNumber = 0, limit = 20, callback) => {
    const date = getDate()
    myLogger.log( museum + '\t' + samling + '\t' + searchObjects + '\t' + date + '\tnumber search');
    // velg riktig MUSIT dump fil å lese
    musitFile = setCollection(museum,samling)
    if (fs.existsSync(musitFile)) {
        // cleaning the searchterm before making the search so that we get a more precise
        // remove whiteSpace
        searchObjects = searchObjects.trim()
        let objectNumbers = []
        if (searchObjects.includes(',')) {
            objectNumbers = searchObjects.split(',')
        } else if (searchObjects.includes(' ')) {
            objectNumbers = searchObjects.split(' ')
        } else if (searchObjects.includes('..')) {
            let stringArray = []
            if (searchObjects.includes('...')) {
                stringArray = searchObjects.split('...')
            } else {
                stringArray = searchObjects.split('..')
            }
            const a = parseInt(stringArray[0])
            const b = parseInt(stringArray[1])
            for (i=a; i<b+1; i++) {
                objectNumbers.push(i.toString())
            }
        } else {
            objectNumbers.push(searchObjects)
        }
        // check if collection has suffix "/" in catalogNumber
        let suffix
        if (samling === 'moser') {
            suffix = true
        } else if (samling === "sopp" && museum === "tmu") {
            suffix = true
        } else {
            suffix = false
        }
        let results = ''
        const readInterface = readline.createInterface({
            input: fs.createReadStream(musitFile),
            console: false
        })
        let count = 0  // iterates over each line of the current file
        let resultCount = 0
        readInterface.on('line', function(line) {
            count++
            if (resultCount == limit) {
                readInterface.close()
            }
            if (count === 1) {
                headers = line.split('\t')
                results = line + '\tlineNumber';
            } else {
                
                if (objectNumbers.length === 0) {
                    readInterface.close()
                }
                let lineArray = line.split('\t')
                let catNoInFile = lineArray[headers.indexOf('catalogNumber')].toLowerCase().trim()
                let source = getSource(museum, samling)

                for (let i=0;i<objectNumbers.length;i++) {
                    // for collections with suffixes in catNo ('.../1'). When complete suffix is entered in search term, all is good
                    // when complete suffix is entered, but musit-catalog-number has only "/", without number:
                    if (suffix && objectNumbers[i].includes('/') && catNoInFile.length == catNoInFile.indexOf('/')+1) {
                        objectNumbers[i] = objectNumbers[i].substring(0,objectNumbers[i].indexOf('/'))
                        catNoInFile = catNoInFile.substring(0,catNoInFile.indexOf('/'))
                    } else 
                        // when no suffix is included in search term: 
                    if (suffix && !objectNumbers[i].includes('/')) {
                        if(catNoInFile.includes('/')) {
                            catNoInFile = catNoInFile.substring(0,catNoInFile.indexOf('/'))
                        }
                    }
                        // when only '/' is included:
                    else if (suffix && objectNumbers[i].includes('/') && objectNumbers[i].length == objectNumbers[i].indexOf('/')+1) {
                        if(catNoInFile.includes('/')) {
                            catNoInFile = catNoInFile.substring(0,catNoInFile.indexOf('/')+1)
                        }
                    }
                    // remove leading 0's from catalogNumber in dump-file
                    
                    if (String(objectNumbers[i]).charAt(0) != "0") {
                        let match = catNoInFile.match(/^0+/)
                        let level = match ? match[0].length : 0
                        catNoInFile = catNoInFile.substring(level,catNoInFile.length)    
                    }
                   
                    if ( catNoInFile === objectNumbers[i].trim()) {
                        // søk for en match i linja  (line.indexOf(searchTerm) !== -1)
                        // results =  results +  '\n' + line
                        // resultCount++
                        results += `\n${line}\t${count}`;
                        resultCount++;
                    } 
                }
            }
            
        }).on('close', function () {
            // hvis linjen nedenfor er med fungerer ikke ny objektside for corema-post fra musit-post.
            // results = trimResults(results, museum, samling)
            const resultsAndLine = {results, count};
            console.log(resultsAndLine)
            callback(undefined, resultsAndLine);
        })
       
    } else {
        throw new Error ('File not found ')
    }
}

// Show a object based on the linenumber in the musit file
function getLineByNumber(museum, samling, lineNumber, callback) {
    let results = '';
    console.log(museum);
    console.log(samling);
    console.log(lineNumber);
    
    
    
    
    lineNumber = Number(lineNumber);
    if (isNaN(lineNumber) || lineNumber < 1) {
        return callback(new Error('Invalid line number'));
    }

    const musitFile = setCollection(museum, samling); // Assuming this returns a valid file path
    if (!musitFile) {
        return callback(new Error('Invalid collection path'));
    }

    const fileStream = fs.createReadStream(musitFile);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let currentLine = 0;
    let found = false;

    rl.on('line', (line) => {
        currentLine++;
        if (currentLine === 1) {
            results = line;
        }
        if (currentLine === lineNumber) {
            found = true;
            results += `\n${line}`;
            const resultsAndLine = {results, currentLine }
            console.log(resultsAndLine)
            rl.close(); // Stop reading further lines
            callback(null, resultsAndLine); // Call the callback with the line
        }
    });

    rl.on('close', () => {
        if (!found) {
            callback(new Error('Line number out of bounds'));
        }
    });

    rl.on('error', (err) => {
        callback(err);
    });
}

const checkRegion = async (region, lat, long, callback) => {
    // const url = 'https://ws.geonorge.no/' + region + 'info/v1/punkt?ost=' + long + '&nord=' + lat + '&koordsys=4258'
    const url = 'https://api.kartverket.no/' + region + 'info/v1/punkt?ost=' + long + '&nord=' + lat + '&koordsys=4258'
    try {
        const response = await fetch(url);
        const data = await response.json();
        // for å få norskt og ikke samiskt kommunenavn tilbake
        // const url2 = 'https://ws.geonorge.no/kommuneinfo/v1/kommuner/' + data.kommunenummer
        const url2 = 'https://api.kartverket.no/kommuneinfo/v1/kommuner/' + data.kommunenummer
        const response2 = await fetch(url2)
        const data2 = await response2.json();
        callback(undefined, data2.kommunenavnNorsk)
    } catch (error) {
        console.log('checkRegion fuksjonen har feila: ' + error);
        callback(error, undefined)
    }
}
 
module.exports = { 
    search,
    advSearch,
    objListSearch,
    fileListObject,
    setCollection,
    setOrgGroups,
    getOrgGroup,
    setSubcollections,
    whichFileDb,
    checkRegion,
    getAllcollections,
    getLineByNumber
    
 } 

