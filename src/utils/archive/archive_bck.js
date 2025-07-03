const { log } = require('console');
const fs = require('fs');
const path = require('path');

async function getFolderPathAndFile(documentType) {
    try {
        let folder = '';
        switch (documentType) {
        case 'illustrations':
            folder = 'illustrations_files/';
            break;
        case 'Dagny Tande Lid':
            folder = 'illustrations_files/DTL/';
            break;
        case 'Botaniske Illustrasjoner':
            folder = 'illustrations_files/botanical/';
            break;
        case 'archive':
            folder = 'archive_files/';
            break;
        case 'fieldNotes':
            folder = 'fieldNotes_files/';
            break;
        case 'Rolf Y. Berg':
            folder = 'photo_files/RYB/';
            break;
        case 'scans':
            folder = 'scans';
            break;
        default:
            throw new Error(`Invalid documentType: ${documentType}`);
        }
    
        const filePath = path.join(__dirname, '..', '..', '..', 'public',  'archive', 'nhm', folder);
        const folderPath = path.join('archive', 'nhm', folder);
        return { folderPath, filePath};
    } catch (error) {
    console.log('Feil i filePath: ' + error);            
    }
  }
  
//get image files
async function checkFilesStartsWith(documentType, fileName, directImagePath) {
    try {
        const {folderPath, filePath} = await getFolderPathAndFile(documentType);
        const matchingFiles = await searchMatchingFiles(filePath, fileName, directImagePath);
        const matchingScans = await getScansLinks(fileName)
        // scansObj.matchingFiles
        const mediaObject = {}
        mediaObject.folderPath = folderPath
        mediaObject.filePath = filePath
        mediaObject.matchingFiles = matchingFiles
        mediaObject.matchingScans = {}
        mediaObject.matchingScans.files = matchingScans.matchingFiles
        mediaObject.matchingScans.scanFolderPath = matchingScans.folderPath

        return { mediaObject };
    } catch (error) {
        // Handle the error
        console.log('error in line 40, archive_bck');
        console.error(error);
        throw error; // Re-throw the error to propagate it to the caller
    }
}
  
async function searchMatchingFiles(filePath, fileName, directImagePath, subfolder = '') {
    let matchingFiles = [];
    try {
        const files = await fs.promises.readdir(filePath);
        for (const file of files) {
            const fileFullPath = path.join(filePath, file);
            const fileStat = await fs.promises.stat(fileFullPath);  

            if (fileStat.isDirectory() && file !== 'thumb') {
                
                const newSubfolder = path.join(subfolder, file);
                const subfolderFiles = await searchMatchingFiles(fileFullPath, fileName, directImagePath, newSubfolder);
                matchingFiles = matchingFiles.concat(subfolderFiles);
            } else if (file.startsWith(fileName)) {               
                const filePathWithSubfolder = subfolder ? path.join(subfolder, file) : file;
                matchingFiles.push(filePathWithSubfolder);
            }
        }
        
        // if we have a direct imagePath add it to the match files
        if (typeof directImagePath !== 'boolean') {

            matchingFiles.push(directImagePath);
        }
    } catch (err) {
        console.log(`from searchMatchingFiles(): Error reading folder '${filePath}': ${err}`);
        console.log(err.stack);
    }

    return matchingFiles;
}

function formatFileName(fileName) {
    // Check the length of the fileName variable
    switch (fileName.length) {
        case 1:
            return 'B-000' + fileName;
        case 2:
            return 'B-00' + fileName;
        case 3:
            return 'B-0' + fileName;
        case 4:
            return 'B-' + fileName;
        default:
            return 'B-' + fileName; // If length is not 1, 2, 3, or 4, return fileName unchanged
    }
}

// get scanns of box contences
async function getScansLinks (fileName) {
    const {folderPath, filePath} = await getFolderPathAndFile('scans');
    let matchingFiles = [];   
    fileName = formatFileName(fileName)

    try {
        const files = await fs.promises.readdir(filePath);
        for (const file of files) {
            if (file.startsWith(fileName)) {                 
                    matchingFiles.push(file);
                }     
        }
    } catch (err) {
        console.log(`from getScansLinks(): Error reading folder '${filePath}': ${err}`);
        console.log(err.stack);
    }
    const scansObj = {}
    scansObj.folderPath = folderPath
    scansObj.matchingFiles = matchingFiles
    return scansObj
}
 


async function findSubfolder(documentType, folderName) {
    try {
        const filePathObj = await getFolderPathAndFile(documentType)
        const searchPath = path.join(filePathObj.filePath, folderName);
        const folderPath = path.join(filePathObj.folderPath, folderName)
        if (fs.existsSync(searchPath) && fs.lstatSync(searchPath).isDirectory()) {
        return folderPath;
        } else {
        return "not found";
        }
    } catch (error) {
    console.log('Feil i findSubFolder: ' + error);            
    }
  }

module.exports = { checkFilesStartsWith, findSubfolder };
