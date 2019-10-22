const fs = require('fs')
const fileRead = require('./fileread')

const getFileUpdatedDate = (samling, callback) => {
    musitFile = fileRead.setCollection(samling)
    fs.stat(musitFile, function(err, stats) {
        const mtime = stats.mtime;
        time = stats.mtime.getDate() + '/' + stats.mtime.getMonth() + '-' + stats.mtime.getFullYear()
           console.log(time);
        callback(undefined, time)
    })
}

  module.exports = { getFileUpdatedDate }