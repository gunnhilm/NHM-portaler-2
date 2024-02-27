const fs = require('fs');
const path = require('path');

// async function checkFilesStartsWith(documentType, fileName, directImagePath) {
//     try {

//     // Select the folder based on the documentType
//     let folder = '';
//     switch (documentType) {
//         case 'illustrations':
//             folder = 'illustrations_files/';
//             break;
//         case 'Dagny Tande Lid':
//             folder = 'illustrations_files/DTL/';
//             break;
//         case 'Botaniske Illustrasjoner':
//             folder = 'illustrations_files/botanical/';
//             break;
//         case 'archive':
//             folder = 'archive_files/';
//             break;
//         case 'fieldNotes':
//             folder = 'fieldNotes_files/';
//             break;
//         case 'Rolf Y. Berg':
//           folder = 'photo_files/RYB/';
//           break;
//         default:
//             throw new Error(`Invalid documentType: ${documentType}`);
//     }

//         const folderPath = path.join(__dirname, '..', '..', '..', 'public', 'archive', folder);
//         const filePath = path.join('archive', folder);

//         const matchingFiles = await searchMatchingFiles(folderPath, fileName, directImagePath);

//         return { filePath, matchingFiles };
//     } catch (error) {
//         // Handle the error
//         console.log('error in line 40, archive_bck');
//         console.error(error);
//         throw error; // Re-throw the error to propagate it to the caller
//     }
// }


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
        default:
            throw new Error(`Invalid documentType: ${documentType}`);
        }
    
        const folderPath = path.join(__dirname, '..', '..', '..', 'public', 'archive', folder);
        return { folder, folderPath };
    } catch (error) {
    console.log('Feil i folderPath: ' + error);            
    }
  }
  
  async function checkFilesStartsWith(documentType, fileName, directImagePath) {
    try {
      const { folder, folderPath } = await getFolderPathAndFile(documentType);
      const matchingFiles = await searchMatchingFiles(folderPath, fileName, directImagePath);
      return { folderPath, matchingFiles };
    } catch (error) {
      // Handle the error
      console.log('error in line 40, archive_bck');
      console.error(error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }
  

async function searchMatchingFiles(folderPath, fileName, directImagePath, subfolder = '') {
    let matchingFiles = [];

    try {
        const files = await fs.promises.readdir(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const fileStat = await fs.promises.stat(filePath);

            if (fileStat.isDirectory() && file !== 'thumb') {
                const newSubfolder = path.join(subfolder, file);
                const subfolderFiles = await searchMatchingFiles(filePath, fileName, directImagePath, newSubfolder);
                matchingFiles = matchingFiles.concat(subfolderFiles);
            } else if (file.startsWith(fileName)) {
                const filePathWithSubfolder = subfolder ? path.join(subfolder, file) : file;
                matchingFiles.push(filePathWithSubfolder);
            }
        }
        // if we have a direct imagePath add it to the match files
        if (typeof directImagePath !== 'boolean') {
            console.log('directImagePath: ' + directImagePath);
            matchingFiles.push(directImagePath);
        }
    } catch (err) {
        console.log(`Error reading folder '${folderPath}': ${err}`);
    }

    return matchingFiles;
}


async function findSubfolder(documentType, folderName) {
    try {
        const filePathObj = await getFolderPathAndFile(documentType)
        const searchPath = path.join(filePathObj.folderPath, folderName);
        if (fs.existsSync(searchPath) && fs.lstatSync(searchPath).isDirectory()) {
        return searchPath;
        } else {
        return "not found";
        }
    } catch (error) {
    console.log('Feil i findSubFolder: ' + error);            
    }
  }

module.exports = { checkFilesStartsWith, findSubfolder };
