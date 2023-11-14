const folderPath = 'src/utils/archive/'
const fs = require('fs');

async function readArchiveFile (arvhiveFile) {
    try {
      const data = await fs.promises.readFile(folderPath + musitGeoFil, 'utf8');
      return data;
    } catch (err) {
      console.log('File read error in readArchiveFile');
      return undefined;
    }
  }

module.exports = { readArchiveFile }