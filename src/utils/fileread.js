// https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
const readline = require('readline');
const fs = require('fs')

const setCollection = (samling) => {
    let musitFile = ''
    if (samling === 'karplanter') {
        musitFile = './src/data/vascular_o.txt'
    } else if (samling === 'sopp') {
        musitFile = './src/data/fungus_o.txt'
    } else if (samling === 'moser') {
        musitFile = './src/data/moss_o.txt'
    } else if (samling === 'lav') {
        musitFile = './src/data/lichens_o.txt'
    } else if (samling === 'alger') {
        musitFile = './src/data/algae_o.txt'
    } else if (samling === 'entomologi') {
        musitFile = './src/data/entomology_nhmo.txt'
    }
    return musitFile
}


const search = (samling, searchTerm, callback) => {
    // velg riktig MUSIT dump fil å lese
    
    musitFile = setCollection(samling)
    if (fs.existsSync(musitFile)) {
        // cleaning the searchterm before making the search so that we get a more precise
        // remove whiteSpace
        searchTerm = searchTerm.trim()
        // Case insensitve search
        searchTerm = searchTerm.toLowerCase()
        console.log(searchTerm);
        
        terms = searchTerm.split(' ')
        let results = ''
        const readInterface = readline.createInterface({
            input: fs.createReadStream(musitFile),
            console: false
        })

        let count = 0  // iterates over each line of the current file
        readInterface.on('line', function(line) {
            count++
            if (count === 1) {
                // header row og legg til et feldt for linje nummer
                results =  line
            } else if (terms.length === 1){
                if (line.toLowerCase().indexOf(terms[0]) !== -1) {
                    // søk for en match i linja  (line.indexOf(searchTerm) !== -1)
                    results =  results +  '\n' + line
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
                    // hvis alle runden med søk har gått bra så lagrer vi resultatet (må trekke fra 1 da arryet er null basert)
                    if (i === (terms.length -1) ) {
                results =  results +  '\n' + line
                    }
                }
            }
        }).on('close', function () {
            callback(undefined, results )
        })
    } else {
        throw new Error ('throwing error in fileread')
    }
}

module.exports = { 
    search,
    setCollection
 } 