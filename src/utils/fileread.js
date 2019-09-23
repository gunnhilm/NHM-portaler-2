// https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
const readline = require('readline');
const fs = require('fs')

const readInterface = readline.createInterface({
    input: fs.createReadStream('./src/data/vascular_o.txt'),
    // output: process.stdout,
    console: false
});
let results = ''



const search = (searchTerm) => {
    // cleaning the searchterm before making the search so that we get a more precise
    // remove whiteSpace
    searchTerm = searchTerm.trim()
  
    return new Promise((resolve, reject) => { 
        readInterface.on('line', function(line) {
            if (line.includes(searchTerm)) {
                results = line + results
                console.log(line);
            } 
        }).on('close', function () {
            resolve(results)
            }) 
    })
}

// let searchTerm = 'Tønsberg'
// search(searchTerm).then( () => {
//     console.log('Yes')
//     console.log(results);
// }).catch((error) => {
//     console.log('Error', error)
// })

module.exports = search
