const parse = require('csv-parse/lib/sync')
// const assert = require('assert')
const readline = require('readline');
const fs = require('fs')




// const input = `
// "key_1","key_2"
// "value 1","value 2"
// `


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
            // if (count === 1) {
            //     // console.log('stop')
            //     // console.log(line);
                
            //     results = line
            // }
            if (line.includes(searchTerm) || count === 1) {
                results =  results + line + '\n'
                // console.log(line);
            } 
        }).on('close', function () {
            console.log('Ferdig');
            
            callback(undefined, results)
            }) 

}




let searchTerm = 'web_hent_bilde.php?id=13306823&type=jpeg'

search(searchTerm, (error, results) => {
    console.log( 'her skulle det vært noe' + results);
    const recordsJson = parse(results, {
        columns: true,
        quoting: false,
        delimiter: '\t',
        skip_empty_lines: true,
        header: true
      })
    console.log('Resultser i json:');
    
    console.log( recordsJson);

})



// assert.deepEqual(records, [{ key_1: 'value 1', key_2: 'value 2' }])