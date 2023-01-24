const fetch = require('node-fetch');

async function getADBnames(taxonNb) {
    let url = 'https://www.artsdatabanken.no/Api/Taxon/Scientificname?taxonRank=species&higherClassificationID=' + taxonNb

    try {
        obj =await  (await fetch(url)).json()
        console.log(obj[0])
        
    } catch(e) {
        console.log(e);
        console.log('feil feil');
}
}
getADBnames(325)

