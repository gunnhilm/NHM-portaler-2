const fs = require('fs')
const fileRead = require('./fileread')

const getFileUpdatedDate = (museum, samling, callback) => {
    try {
            musitFile = fileRead.setCollection(museum, samling)
            if (fs.existsSync(musitFile)) {
                fs.stat(musitFile, function(err, stats) {
                    let time = stats.mtime
                    // .getDate() + '/' + stats.mtime.getMonth() + '-' + stats.mtime.getFullYear()

                    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                    // const event = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
                    console.log(time);
                    
                    time = time.toLocaleString('NO', options)
                    console.log(time);

                    callback(undefined, time)
                })
            } 
    } catch (error) {
    console.log('Error in footerdate');      
    }
}

module.exports = { getFileUpdatedDate }