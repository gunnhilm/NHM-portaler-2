const folderPath = 'src/utils/artsobs/'
const fs = require('fs');

function readMUSITgeoFile (musitGeoFil, callback) {
    fs.readFile(folderPath + musitGeoFil,  'utf8', (err, data) => {
        if (err) {
        console.log('File read error i getstatfile');
        }
        callback(undefined, data)
      });
}
   

module.exports = { readMUSITgeoFile }