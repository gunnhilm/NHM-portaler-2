const fs = require('fs')
const fileRead = require('./fileread')

const getFileUpdatedDate = (samling, callback) => {
    musitFile = fileRead.setCollection(samling)
    fs.stat(musitFile, function(err, stats) {
        let time = stats.mtime.getDate() + '/' + stats.mtime.getMonth() + '-' + stats.mtime.getFullYear()
        callback(undefined, time)
    })
}

  module.exports = { getFileUpdatedDate }