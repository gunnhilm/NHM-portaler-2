// https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
const readline = require('readline');
const fs = require('fs')
const fileList = require('./fileList')


const setCollection = (samling) => {
    let musitFile = ''
    if (samling === 'journaler') {
        musitFile = './src/data/journaler.txt'
    } else {
        fileList.forEach(element => {
            if (element.name === samling){
                musitFile = './src/data/' + element.name + '_occurrence.txt'
            }
        });
    }
    return musitFile 
    }

const search = (samling, searchTerm, linjeNumber = 0, limit = 20, callback) => {
    // velg riktig MUSIT dump fil å lese
      
    musitFile = setCollection(samling)
    if (fs.existsSync(musitFile)) {
        // cleaning the searchterm before making the search so that we get a more precise
        // remove whiteSpace
        searchTerm = searchTerm.trim()
        // Case insensitve search
        searchTerm = searchTerm.toLowerCase()
        console.log( 'Seach Term: ' + searchTerm);
        
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
        throw new Error ('File not found' + musitFile)
    }
}



module.exports = { 
    search,
    setCollection
 } 