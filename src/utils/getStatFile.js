const fs = require('fs')

const getStatData = (samling, museum, callback) => {
  fs.readFile('./src/data/' + museum + '/statData.json',  'utf8', (err, data) => {
    if (err) {
    console.log('File read error i getstatfile');
    }
    callback(undefined, data)
  });
}

module.exports = { getStatData }