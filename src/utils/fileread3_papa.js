// https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
const readline = require('readline');
const fs = require('fs')
const parse = require('csv-parse/lib/sync')
const papa = require('papaparse/papaparse')


const search = (searchTerm, callback) => {
    // cleaning the searchterm before making the search so that we get a more precise
    // remove whiteSpace
    searchTerm = searchTerm.trim()
    let results = ''
    const readInterface = readline.createInterface({
        input: fs.createReadStream('./src/data/vascular_o.txt'),
        // output: process.stdout,
        console: false
    });

    let count = 0  // iterates over each line of the current file
        readInterface.on('line', function(line) {
            count++
            
            if (line.includes(searchTerm) || count === 1) {
                results =  results + line + '\n'
                // console.log(line);
            } 
        }).on('close', function () {
    
            

            callback(undefined, results )
            }) 

}



let searchTerm = 'web_hent_bilde.php?id=13306823&type=jpeg'

search(searchTerm, (error, results) => {
    console.log('Inni');
    console.log( 'her skulle det vært noe' + results);
       const parsedResults = papa.parse(results, {
            delimiter: "\t",	// auto-detect
            newline: "+n",	// auto-detect
            quoteChar: '"',
            escapeChar: '"',
            header: true,
        })
        console.log(parsedResults);
        
})


module.exports = search