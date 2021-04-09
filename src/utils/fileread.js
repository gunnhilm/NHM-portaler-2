// https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
const readline = require('readline');
const fs = require('fs')
const fileListNhm = require('./fileListNhm')
const fileListTmu = require('./fileListTmu')
const fileListUm = require('./fileListUm')


const setCollection = (museum, samling) => {
    let fileList
    if (museum == 'tmu') {
        fileList = fileListTmu
    } else if (museum == 'um') {
        fileList = fileListUm
    } else {
        fileList = fileListNhm
    }
    
    let musitFile = ''
    const pathToMuseum = './src/data/' + museum + '/'
    if (samling === 'journaler') {
        musitFile = './src/data/' + museum +'/journaler.txt'
        console.log( 'fileread.js: musit fila: '+  musitFile);
        
    } else {
        fileList.forEach(element => {
            if (element.name === samling){
                console.log('her kommer element: ' + element.name)
                    musitFile = pathToMuseum + element.name + '_occurrence.txt'
            }
        })
    
    }
    return musitFile 
}

const search = (museum, samling, searchTerm, linjeNumber = 0, limit = 20, callback) => {
    // velg riktig MUSIT dump fil å lese
      console.log('her kommer search museum: ' + museum);
    musitFile = setCollection(museum,samling)
    console.log(musitFile)
    if (fs.existsSync(musitFile)) {
        // cleaning the searchterm before making the search so that we get a more precise
        // remove whiteSpace
        searchTerm = searchTerm.trim()
        // Case insensitve search
        searchTerm = searchTerm.toLowerCase()
        console.log( 'Search Term: ' + searchTerm);
        
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

const request = require('request')

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
    checkRegion
 } 

