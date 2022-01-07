const fetch = require('node-fetch');


// Hovedfunksjon
// download the files and zip them
// mediaObj er et objekt med mmusit nummer som key og url til artsdatabankes bilder i en array som value, ie. {452200: ["https://www.artsobservasjoner.no/MediaLibrary/2021/12/22a283c1-d274-4c0f-9ef4-131932598777_image.jpg", "https://www.artsobservasjoner.no/MediaLibrary/2021/12/9478b5b6-7b1a-4059-be37-a999e70bf7c3_image.jpg"]}
async function downloadImage (mediaObj, callback) {
   try { 
         const response = await fetch(mediaObj)
         const buffer = await response.buffer();
         console.log(response);
         callback(undefined, buffer)
   } catch (error) {
         console.log(error);
   }
}
     
   module.exports = { downloadImage } 