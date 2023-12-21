const fs = require('fs');
const path = require('path');

async function checkFilesStartsWith(documentType, fileName) {
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
            console.log(`Invalid documentType: ${documentType}`);
            return;
    }

    const folderPath = path.join(__dirname, '..', '..', '..', 'public', 'archive', folder);
    const filePath = path.join('archive', folder);

    const matchingFiles = await searchMatchingFiles(folderPath, fileName);

    return { filePath, matchingFiles };
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
