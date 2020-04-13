const fs = require('fs')

const getStatData = (samling, callback) => {
fs.readFile('./src/data/statData.json',  'utf8', (err, data) => {
    if (err) {
    console.log('File read error');
    }
    callback(undefined, data)
  });
}

module.exports = { getStatData }