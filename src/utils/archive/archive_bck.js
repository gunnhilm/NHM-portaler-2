const fs = require('fs');
const path = require('path');

async function checkFilesStartsWith(documentType, fileName) {
    try {
        

    // Select the folder based on the documentType
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
        default:
            throw new Error(`Invalid documentType: ${documentType}`);
    }

        const folderPath = path.join(__dirname, '..', '..', '..', 'public', 'archive', folder);
        const filePath = path.join('archive', folder);

        const matchingFiles = await searchMatchingFiles(folderPath, fileName);

        return { filePath, matchingFiles };
    } catch (error) {
        // Handle the error
        console.log('error in line 40, archive_bck');
        console.error(error);
        throw error; // Re-throw the error to propagate it to the caller
    }
}

async function searchMatchingFiles(folderPath, fileName, subfolder = '') {
    let matchingFiles = [];

    try {
        const files = await fs.promises.readdir(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const fileStat = await fs.promises.stat(filePath);

            if (fileStat.isDirectory()) {
                const newSubfolder = path.join(subfolder, file);
                const subfolderFiles = await searchMatchingFiles(filePath, fileName, newSubfolder);
                matchingFiles = matchingFiles.concat(subfolderFiles);
            } else if (file.startsWith(fileName)) {
                const filePathWithSubfolder = subfolder ? path.join(subfolder, file) : file;
                matchingFiles.push(filePathWithSubfolder);
            }
        }
    } catch (err) {
        console.log(`Error reading folder '${folderPath}': ${err}`);
    }

    return matchingFiles;
}

module.exports = { checkFilesStartsWith };
