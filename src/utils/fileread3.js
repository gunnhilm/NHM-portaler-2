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
    }

    // cleaning the searchterm before making the search so that we get a more precise
    // remove whiteSpace
    searchTerm = searchTerm.trim()
    let results = ''
    const readInterface = readline.createInterface({
        // input: fs.createReadStream('./src/data/vascular_o.txt'),
        input: fs.createReadStream(musitFile),
        // output: process.stdout,
        console: false
    })

    let count = 0  // iterates over each line of the current file
        readInterface.on('line', function(line) {
            count++
            if (count === 1) {
                // header row og legg til et feldt for linje nummer
                results =  line + '\n'

            } else if (line.includes(searchTerm)) {
                results =  results +  line + '\n'
            } 
        }).on('close', function () {
            callback(undefined, results )
            }) 

}

// const getObject = (lineNumber, callback) => {
//     let myObject = ''
//     const readInterface = readline.createInterface({
//         input: fs.createReadStream('./src/data/vascular_o.txt'),
//         // output: process.stdout,
//         console: false
//     })
//     let count = 0  // iterates over each line of the current file
//         readInterface.on('line', function(line) {
//             count++
//             if (count === 1) {
//                 // header row og legg til et feldt for linje nummer
//                 header =  line + '\n'
//             } else if (Number(count) === Number(lineNumber)) {
//                 return myObject =  header + line
//             } 
//         }).on('close', function () {
//             callback(undefined, myObject )
//             }) 
// }

module.exports = { search } 