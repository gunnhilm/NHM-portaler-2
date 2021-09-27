const fs = require('fs');
const errorFolder = '/geoError/';

const makePath = (url) => {
    const museum = url.split('/')
    folderPath = 'src/data/' + museum[1] + errorFolder
  return folderPath
}

const getFileList = (folderPath) => {
    const fileObj = {}
    fs.readdirSync(folderPath).forEach(file => {
        let currentFile = file.split('_')
        if(currentFile.length > 3) {
            const twoPartName = currentFile[1] + '_' + currentFile[2]
            fileObj[twoPartName] = file
        } else {
            fileObj[currentFile[1]] = file
        } 
      });
    return fileObj
}


const startUp = (req, callback) => {
   const path = makePath(req.path)
   let fileObj =  getFileList(path)
   callback(undefined, fileObj)
}

const getCoordErrors = () => {

}


module.exports = { getCoordErrors, startUp }