const fs = require('fs')
const fileRead = require('./fileread')

const getFileUpdatedDate = (samling, callback) => {
    musitFile = fileRead.setCollection(samling)
    if (fs.existsSync(musitFile)) {
        fs.stat(musitFile, function(err, stats) {
            let time = stats.mtime.getDate() + '/' + stats.mtime.getMonth() + '-' + stats.mtime.getFullYear()
            callback(undefined, time)
        })
    } else {
        throw new Error('feil i footerDate.js')
    }
}

module.exports = { getFileUpdatedDate }