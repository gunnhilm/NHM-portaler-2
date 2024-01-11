// https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
const readline = require('readline');
const fetch = require('node-fetch')
const fs = require('fs')
const fileListNhm = require('./fileListNhm')
const fileListTmu = require('./fileListTmu')
const fileListUm = require('./fileListUm')
const fileListNbh = require('./fileListNbh')

// logging av søkeord 
// get the Console class
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
    let fileList
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

// to figure out wheter collection is in musit or corema
// is called in...
const getSource = (museum,samling) => {
    return(getFileList(museum).find(el => el.name === samling).source)
    
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
    // console.log(coll);
    // const filtered = result.filter(Boolean)
    // return filtered 
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
    } 

    
    else {
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


// const search = (museum, samling, searchTerm, linjeNumber = 0, limit = 20, callback) => {
//     // velg riktig MUSIT dump fil å lese
//     const date = getDate()
//     myLogger.log( museum + '\t' + samling + '\t' + searchTerm + '\t' + date + '\tsimple search');
//    console.log(samling)
//     musitFile = setCollection(museum,samling)
//     if (fs.existsSync(musitFile)) {
//         // cleaning the searchterm before making the search so that we get a more precise
//         // remove whiteSpace
//         searchTerm = searchTerm.trim()
//         // Case insensitve search
//         searchTerm = searchTerm.toLowerCase()
//         terms = searchTerm.split(' ')
//         let results = ''
//         const readInterface = readline.createInterface({
//             input: fs.createReadStream(musitFile),
//             console: false
//         })

//         let count = 0  // iterates over each line of the current file
//         let resultCount = 0
//         readInterface.on('line', function(line) {
//             count++
//             if (resultCount == limit) {
//                 readInterface.close()
//             } 
//             if (count === 1) {
//                 // header row 
//                 results =  line
//             } else {         //if (count > linjeNumber) {
//                 if (terms.length === 1){
//                     if (line.toLowerCase().indexOf(terms[0]) !== -1) {
//                         // søk for en match i linja  (line.indexOf(searchTerm) !== -1)
//                         results =  results +  '\n' + line
//                         resultCount++
//                     } 
//                 }
//                 // Loope igjennom alle søkeordene og sjekke om de fins i linja
//                 else if (line.toLowerCase().indexOf(terms[0]) !== -1) {
//                     // Hvis linja inneholder det først søkeordet, sjekk om det også inneholder de andre
//                     for(let i = 1; i < terms.length; i++){
//                         if(line.toLowerCase().indexOf(terms[i]) === -1){
//                         // hvis vi ikke får treff så bryter vi loopen (-1 = fant ikke)
//                             break;
//                         }
//                         // hvis alle runden med søk har gått bra så lagrer vi resultatet (må trekke fra 1 da arrayet er null basert)
//                         if (i === (terms.length -1) ) {
//                             results =  results +  '\n' + line
//                             resultCount++
//                         }
//                     }
//                 }
//             }
            
//         }).on('close', function () {
//             const resulstAndLine = {results, count }
//             callback(undefined, resulstAndLine)
//         })
       
//     } else {
//         myLogger.error('File not found');
//         throw new Error ('File not found ');
        
//     }
// }


const search = (museum, samling, searchTerm, linjeNumber = 0, limit = 20, callback) => {
    const date = getDate();
    myLogger.log(`${museum}\t${samling}\t${searchTerm}\t${date}\tsimple search`);
    console.log(samling);
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
            results = line;
        } else {
            if (isSingleTerm && line.toLowerCase().includes(searchTerm)) {
                results += `\n${line}`;
                resultCount++;
            } else if (terms.every(term => line.toLowerCase().includes(term))) {
                results += `\n${line}`;
                resultCount++;
            }
        }
    }).on('close', function() {
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
        // for advanced search in utad and bulk:
        // if (samling === 'utad') {
        //     headerTerms = ['vernacularName','scientificName','basisOfRecord']
        // } else if (samling = 'bulk') {
        //     headerTerms = ['scientificName','recordedBy','eventDate','country','stateProvince','county','locality','preparations']
        // } else {
        headerTerms = ['scientificName','recordedBy','eventDate','country','stateProvince','county','locality','recordNumber','typeStatus','associatedMedia']
        // }
        let headers = []
        readInterface.on('line', function(line) {
            count++
            if (resultCount == limit) {
                readInterface.close()
            }
            if (count === 1) {
                results = line
                headers = line.split('\t')
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
                                        results =  results +  '\n' + line
                                        resultCount++  
                                    }
                                } else if (termsArray[i] === 'hasnotphoto') {
                                    if (lineArray[headers.indexOf(headerTerms[i])]) {
                                        break;
                                    } else {
                                        results =  results +  '\n' + line
                                        resultCount++  
                                    }
                                } else {
                                    results =  results +  '\n' + line
                                    resultCount++  
                                }
                            }
                        }
                    }
                }
            }
        }).on('close', function () {
            const resulstAndLine = {results, count }
            callback(undefined, resulstAndLine)
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
                results = line
                headers = line.split('\t')
            } else {
                
                
                if (objectNumbers.length === 0) {
                    readInterface.close()
                }
                let lineArray = line.split('\t')
                let catNoInFile = lineArray[headers.indexOf('catalogNumber')].toLowerCase().trim()
                let source = getSource(museum, samling)
                
                // console.log('linje ' + count)
                // console.log(objectNumbers.length + ' lengde')
                // for (let el of objectNumbers) {
                for (let i=0;i<objectNumbers.length;i++) {
                    // console.log(objectNumbers[i])
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
                        results =  results +  '\n' + line
                        resultCount++
                    } 
                }
            }
            
        }).on('close', function () {
            const resultsAndLine = {results, count }
            callback(undefined, resultsAndLine)
        })
       
    } else {
        throw new Error ('File not found ')
    }
}


// const checkRegion = (museum, samling, searchTerm, linjeNumber = 0, limit = 20, callback) => {
//     // velg riktig MUSIT dump fil å lese
//       console.log('her kommer search museum: ' + museum);
//     musitFile = setCollection(museum,samling)
//     console.log(musitFile)
//     if (fs.existsSync(musitFile)) {
//         // cleaning the searchterm before making the search so that we get a more precise
//         // remove whiteSpace
//         searchTerm = searchTerm.trim()
//         // Case insensitve search
//         searchTerm = searchTerm.toLowerCase()
//         console.log( 'Search Term: ' + searchTerm);
        
//         terms = searchTerm.split(' ')
//         let results = 'readInterface = readline.createInterface({
//             input: fs.createReadStream(musitFile),
//             console: false
//         })

//         let count = 0  // iterates over each line of the current file
//         let resultCount = 0
//         let masterCoordArray = []
//         readInterface.on('line', function(line) {
//             count++
//             if (resultCount == limit) {
//                 readInterface.close()
//             } 
//             if (count === 1) {
//                 // header row 
//                 results =  line
                
//             } else {         //if (count > linjeNumber) {
//                 if (terms.length === 1){
//                     if (line.toLowerCase().indexOf(terms[0]) !== -1) {
//                         // søk for en match i linja  (line.indexOf(searchTerm) !== -1)
//                         results =  results +  '\n' + line
//                         resultCount++
//                     } 
//                     let array = line.split('\t')
//                     let coordArray = []
//                     coordArray.push(array[25])
//                     coordArray.push(array[27])
//                     coordArray.push(array[28])
//                     //console.log(coordArray)

//                     const url = 'https://ws.geonorge.no/kommuneinfo/v1/punkt?ost=' + array[27] + '&nord=' + array[28] + '&koordsys=4258'
//                     request({ url, json: true }, (error, {body}) => {
                        
//                         if (error) {
//                             callback('Unable to connect to geonorge.', undefined)
//                         } else if (body.error) {
//                             callback('Unable to find location.', undefined)
//                         } else {
                            
//                             //console.log(body)
//                             coordArray.push(body.kommunenavn)
//                             masterCoordArray.push(coordArray)
//                             console.log(masterCoordArray[0])
//                             //callback(undefined, masterCoordArray)
//                         }
//                     })
                    
//                 }
                
//             }
            
//         }).on('close', function () {
            
//             const resulstAndLine = {results, count }
            
//             callback(undefined, resulstAndLine)
//         })
       
//     } else {
//         throw new Error ('File not found ')
//     }
// }


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
    getAllcollections
    
 } 

