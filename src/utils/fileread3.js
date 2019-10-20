// https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
const readline = require('readline');
const fs = require('fs')

const search = (samling, searchTerm, callback) => {
    // velg riktig MUSIT dump fil å lese
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

    // cleaning the searchterm before making the search so that we get a more precise
    // remove whiteSpace
    searchTerm = searchTerm.trim()
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
                results =  line + '\n'
            } else if ((terms.length === 1) && (line.indexOf(terms[0]) !== -1)) {
                 // søk for en match i linja  (line.indexOf(searchTerm) !== -1)
                    results =  results +  line + '\n'
            } else if (line.indexOf(terms[0]) !== -1 && line.indexOf(terms[1]) !== -1 ) {
                results =  results +  line + '\n'
            } 
        }).on('close', function () {
            callback(undefined, results )
            })
}

module.exports = { search } 