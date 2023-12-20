const folderPath = 'src/utils/archive/'
const fs = require('fs');
const path = require('path');

async function checkFilesStartsWith(documentType, fileName) {
    // Select the folder based on the documentType
    let folder = '';
    switch (documentType) {
      case 'illustrations':
        folder = 'illustrations_files/';
        break;
      case 'archive':
        folder = 'archive_files/';
        break;
      case 'fieldNotes':
        folder = 'fieldNotes_files/';
        break;
      default:
        console.log(`Invalid documentType: ${documentType}`);
        return;
    }
  const folderPath = path.join(__dirname, '..', '..', '..', 'public', 'archive', folder);
  console.log(folderPath);
  const filePath = path.join('archive', folder);
  console.log('filepath: ' + filePath);
  try {
    const files = await fs.promises.readdir(folderPath);
    const matchingFiles = files.filter(file => file.startsWith(fileName));
    return { filePath, matchingFiles };
  } catch (err) {
    console.log(`Error reading folder '${folder}': ${err}`);
    return [];
  }
}

module.exports = { checkFilesStartsWith }