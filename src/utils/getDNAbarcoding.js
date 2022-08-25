const fs = require('fs')
const fasta = require('bionode-fasta')
var Fasta = require('biojs-io-fasta');

const readFasta = (callback) => {
    
    fs.readFile('./src/data/nhm/fasta.fas', 'utf8', (err, data) => {
        if (err) {
            console.log('File read error in getDNAbarcoding')
        }
        callback(undefined, data)
    })
}

const readFasta2 = () => {
    fasta.obj('./src/data/nhm/fasta.fas', function(data) {
        console.log(data)
    })
    
}

const readFasta3 = () => {
    Fasta.read('./src/data/nhm/fasta.fas', function(seqs) { 
        console.log(seqs)
    })
}
    

// response.on('end', function () {
//     console.log(req.data);
//     console.log(str);
//     // your code here if you want to use the results !
//   });

// fasta({objectMode: true}, './input.fasta')
// .on('data', console.log)

module.exports = { readFasta, readFasta2 }
    

const getStatData = (samling, museum, callback) => {
    fs.readFile('./src/data/' + museum + '/statData.json',  'utf8', (err, data) => {
        if (err) {
            console.log('File read error i getstatfile');
        }
        callback(undefined, data)
    });
}
