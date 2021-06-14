// https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
const readline = require('readline');
const request = require('request')
const fs = require('fs')
const fileListNhm = require('./fileListNhm')
const fileListTmu = require('./fileListTmu')
const fileListUm = require('./fileListUm')
const fileListNbh = require('./fileListNbh')

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

const setOrgGroups = (museum) => {
    const fileList = getFileList(museum)
    let orgGroups = []
    fileList.forEach(el => {
        if (!el.filMetadata) {
            orgGroups.push(el.orgGroup)
        }
    })
    let uniqueOrgGroups = [...new Set(orgGroups)]
    return uniqueOrgGroups
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

const setCollection = (museum, samling) => {
    const fileList = getFileList(museum)
    let musitFile = ''
    const pathToMuseum = './src/data/' + museum + '/'
    if (samling === 'journaler') {
        musitFile = './src/data/' + museum +'/journaler.txt'  
    } else {
        fileList.forEach(element => {
            if (element.name === samling){
                    musitFile = pathToMuseum + element.name + '_occurrence.txt'
            }
        })
    
    }
    return musitFile 
}

const search = (museum, samling, searchTerm, linjeNumber = 0, limit = 20, callback) => {
    // velg riktig MUSIT dump fil å lese
    musitFile = setCollection(museum,samling)
    if (fs.existsSync(musitFile)) {
        // cleaning the searchterm before making the search so that we get a more precise
        // remove whiteSpace
        searchTerm = searchTerm.trim()
        // Case insensitve search
        searchTerm = searchTerm.toLowerCase()
        terms = searchTerm.split(' ')
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
                // header row 
                results =  line
            } else {         //if (count > linjeNumber) {
                if (terms.length === 1){
                    if (line.toLowerCase().indexOf(terms[0]) !== -1) {
                        // søk for en match i linja  (line.indexOf(searchTerm) !== -1)
                        results =  results +  '\n' + line
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
                            results =  results +  '\n' + line
                            resultCount++
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
//         let results = ''
//         const readInterface = readline.createInterface({
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

const checkRegion = (region, lat, long, callback) => {
    const url = 'https://ws.geonorge.no/' + region + 'info/v1/punkt?ost=' + long + '&nord=' + lat + '&koordsys=4258'
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to geonorge.', undefined)
        } else if (body.error) {
            callback('Unable to find location.', undefined)
        } else {
            callback(undefined, body.kommunenavn)
        }
    })
}

 
module.exports = { 
    search,
    setCollection,
    setOrgGroups,
    setSubcollections,
    checkRegion
 } 

