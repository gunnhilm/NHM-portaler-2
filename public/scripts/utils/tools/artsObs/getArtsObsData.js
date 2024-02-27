const searchForm = document.querySelector('form') 

collectionObject = {
    nhm: {
        entomologi: 'NHMO-ENT',
        alger: 'O-A',
        karplanter: 'O-V',
        lav: 'O-L',
        moser: 'O-B',
        sopp: 'O-F'
    },
    tmu: {
        entomologi: 'X',
        marine: 'X',
        karplanter: 'TROM-V',
        lav: 'TROM-L',
        moser: 'TROM-B',
        sopp: 'TROM-F' 
    },
    um: {
        entomologi: 'X',
        marine: 'ZMBN-EVERT',
        karplanter: 'BG-S',
        lav: 'BG-L',
        moser: 'BG-B',
        sopp: 'BG-F' 
    },
    nbh: {
        alger: 'KMN-A',
        karplanter: 'KMN-V',
        moser: 'KMN-B'
    }, 
    vm: {
        entomologi: 'X',
        marine: 'X',
        alger: 'THR-A',
        karplanter: 'THR-V',
        lav: 'THR-L',
        moser: 'THR-B',
        sopp: 'THR-F'
    }
}

const papaParseConfig = {
	delimiter: "",	// auto-detect
	newline: "",	// auto-detect
	quoteChar: '"',
	escapeChar: '"',
	header: false,
	transformHeader: undefined,
	dynamicTyping: false,
	skipEmptyLines: 'greedy',
	delimitersToGuess: [ ' ',',', '\t', '|', ';']
}

function headerMap() {
     const transelateKeyMap = new Map();
    transelateKeyMap.set('Museum', 'museumCollection');
    transelateKeyMap.set('Løpenummer', 'dbNumbers');
    transelateKeyMap.set('Artsobservasjon nr.', 'catalogNumber');
    transelateKeyMap.set('Vitenskapelig navn', 'scientificName');
    transelateKeyMap.set('Administrativt sted/kommune', 'municipality');
    transelateKeyMap.set('Lokalitet', 'locality');
    transelateKeyMap.set('Datum', 'geodeticDatum');
    transelateKeyMap.set('Koordinater', 'latLongCoords');
    transelateKeyMap.set('Koordinat-presisjon (m)', 'coordinateUncertaintyInMeters');
    transelateKeyMap.set('Økologi', 'habitat');
    transelateKeyMap.set('Innsamlere', 'recordedBy');
    transelateKeyMap.set('Innsamlingsdato', 'eventDate');
    transelateKeyMap.set('Bestemmere', 'identifiedBy');
    transelateKeyMap.set('Bestemmelsesdato', 'dateIdentified');
    transelateKeyMap.set('Prosjektnavn', 'datasetName');
    transelateKeyMap.set('Kommentar fra innsamler', 'fieldNotes');

    const valgtSamling = document.getElementById('collection-select').value

    const soppHeaders = ['Museum','Løpenummer','UUID','Artsobservasjon nr.','Navn_Usikkerhet','Vitenskapelig navn','Vert','Kommentar (bestemmelse)','Administrativt sted/kommune','Lokalitet','Datum','Koordinater','Koordinat - usikker','Koordinater bestemt i ettertid','Koordinat-presisjon (m)','Økologi','Kartblad','Høyde over havet (m)','Høyde - usikker','Innsamlere','Innsamlingsdato','Innsamlingsnummer','Bestemmere','Bestemmelsesdato','Kommentar fra innsamler','Dubletter','Prosjektnavn','Litteratur (objekt)','Datasett','Litteratur (bestemmelse)','Kommentar (adm)','Voucher']
    const karplanteHeaders = ['Museum','Løpenummer','UUID','Artsobservasjon nr.','Navn_Usikkerhet','Vitenskapelig navn','Vert','Kommentar (bestemmelse)','Administrativt sted/kommune','Lokalitet','Datum','Koordinater','Koordinat - usikker','Koordinater bestemt i ettertid','Koordinat-presisjon (m)','Økologi','Kartblad','Høyde over havet (m)','Høyde - usikker','Innsamlere','Innsamlingsdato','Innsamlingsnummer','Bestemmere','Bestemmelsesdato','Kommentar fra innsamler','Dubletter','Prosjektnavn','Litteratur (objekt)','Datasett','Litteratur (bestemmelse)','Kommentar (adm)','Voucher']
    const moseHeaders = ['Museum','Løpenummer','UUID','Artsobservasjon nr.','Navn_Usikkerhet','Vitenskapelig navn','Vert','Kommentar (bestemmelse)','Administrativt sted/kommune','Lokalitet','Datum','Koordinater','Koordinat - usikker','Koordinater bestemt i ettertid','Koordinat-presisjon (m)','Økologi','Kartblad','Høyde over havet (m)','Høyde - usikker','Innsamlere','Innsamlingsdato','Innsamlingsnummer','Bestemmere','Bestemmelsesdato','Kommentar fra innsamler','Dubletter','Prosjektnavn','Litteratur (objekt)','Datasett','Litteratur (bestemmelse)','Kommentar (adm)','Voucher']
    const lavHeaders = ['Museum','Løpenummer','UUID','Artsobservasjon nr.','Navn_Usikkerhet','Vitenskapelig navn','Vert','Kommentar (bestemmelse)','Administrativt sted/kommune','Lokalitet','Datum','Koordinater','Koordinat - usikker','Koordinater bestemt i ettertid','Koordinat-presisjon (m)','Økologi','Kartblad','Høyde over havet (m)','Høyde - usikker','Innsamlere','Innsamlingsdato','Innsamlingsnummer','Bestemmere','Bestemmelsesdato','Kommentar fra innsamler','Dubletter','Prosjektnavn','Litteratur (objekt)','Datasett','Litteratur (bestemmelse)','Kommentar (adm)','Voucher']
    const insektHeaders = ['Museum','Løpenummer','UUID','SubCollection','Barcode','Navn_Usikkerhet','Vitenskapelig navn','Bestemmere','Bestemmelsesdato','Kjønn','Antall','Estimert','Livsstadium','Kommentar (bestemmelse)','Administrativt sted/kommune','Lokalitet','Datum','Koordinater ','Koordinat - usikker','Koordinater bestemt i ettertid','Koordinat-presisjon (m)','Koordinatkilde','Høyde over havet (m)','Innsamlingsdato 1','Innsamlingsdato 2','Innsamlere','Innsamlings-metode','Kommentar fra innsamler','Habitat','Prosjektnavn','Tilhørende preparat','Original etikettekst','Kasse','Godkjent','Voucher','Datasett','Prepareringsmetode','EIS','RegionKode','Kommentar (adm)','Owner','Registrert av','Undernummer']
    const marineInvertebraterHeaders = ['Museum','Løpenummer','UUID','SubCollection','Navn_Usikkerhet','Barcode','Vitenskapelig navn','Kasse','Kjønn','Livsstadium','Antall','Estimert','Vert','Aksesjonsnummer vert','Preparattype','Administrativt sted/kommune','Lokalitet','Økologi','Prøvenummer','Datum','Koordinater','Koordinatkilde','Høyde over havet (m)','Dyp','Habitat','Prosjektnavn','Stasjon','Fartøy','Innsamlingsdato 1','Innsamlingsdato 2','Innsamlere','Innsamlings-metode','Kommentar fra innsamler','Bestemmelsesdato','Bestemmere','Kommentar (bestemmelse)','Typestatus','Datasett','Litteratur (objekt)','Godkjent','Registrert av','Registreringsdato','Kommentar (adm)','Voucher','Original etikettekst','Prepareringsmetode','infraspecificEpithet','scientificNameAuthorship','SedimenthDepth','Koordinat-presisjon (m)','Water temperature','Salinity','pH','Kingdom','Phylum','Class','Order','Family','Genus','specificEpithet','Undernummer']
    const algerHeaders =['Museum','Løpenummer','UUID','Aksesjonsnummer','Navn_Usikkerhet','Barcode','Vitenskapelig navn','Kasse','Kjønn','Livsstadium','Antall','Vert','Aksesjonsnummer vert','Preparattype','Administrativt sted/kommune','Lokalitet','Datum','Koordinater','Koordinat - usikker','Koordinater bestemt i ettertid','Høyde over havet (m)','Dyp','Habitat','Prosjektnavn','Innsamlingsdato','Innsamlere','Innsamlings-metode','Kommentar fra innsamler','Bestemmelsesdato','Bestemmere','Kommentar (bestemmelse)','Typestatus','Litteratur (objekt)','Registrert av','Registreringsdato','Kommentar (adm)','Original etikettekst','Prepareringsmetode','Datasett']

    if (valgtSamling === 'karplanter') {
        headerArray = karplanteHeaders
    } else if (valgtSamling === 'alger') {
        headerArray = algerHeaders
    } else if (valgtSamling === 'lav') {
        headerArray = lavHeaders
    } else if (valgtSamling === 'moser') {
        headerArray = moseHeaders
    } else if (valgtSamling === 'entomologi') {
        headerArray = insektHeaders
    }  else if (valgtSamling === 'marine invertebrater') {
        headerArray = marineInvertebraterHeaders
    } else {
        headerArray = soppHeaders
    } 
    
    const headerMap = new Map();
    try {
        // headerArray = insektHeaders
        for (let i = 0; i < headerArray.length; i++) {
            if(transelateKeyMap.get(headerArray[i])){
                headerMap.set(transelateKeyMap.get(headerArray[i]), headerArray[i]);
            } else {
                headerMap.set(`Dummy${i}` , headerArray[i]);
            }
        }
        return headerMap
    } catch (error) {
        console.log(error);
        return  maketranselateKeyMap
    }
}

const addMuseum = () => {
    const valgtMuseum = document.getElementById('museum-select').value
    const valgtSamling = document.getElementById('collection-select').value
    let museumstring = ''
    //set museum
    if (valgtMuseum === 'nhm'){
        if(valgtSamling === 'entomologi'){
            museumstring= 'NHMO'
        } else {
            museumstring = 'O'
        }
    } else if (valgtMuseum === 'tmu') {
        if(valgtSamling === 'entomologi' || valgtSamling === 'marine invertebrater'){
            museumstring = ''
        } else {
            museumstring = 'TROM'
        }

    }  else if (valgtMuseum === 'um') {
        if(valgtSamling === 'entomologi' || valgtSamling === 'marine invertebrater'){
            museumstring = ''
        } else {
            museumstring = 'BG'
        }
    }  else if (valgtMuseum === 'vm') {
        if(valgtSamling === 'entomologi' || valgtSamling === 'marine invertebrater'){
            museumstring = ''
        } else {
            museumstring = 'TRH'
        }
    } else if (valgtMuseum === 'nbh') {
        museumstring = 'KMN'
    } else {
        museumstring = ''
    }
    return museumstring
}

// Function to toggle the display of the "Please Wait" image based on the input variable, true or false
function togglePleaseWait(showImage) {
    const pleaseWaitImage = document.getElementById("please-wait");
    pleaseWaitImage.style.display = showImage ? "inline" : "none";
  }


const getMUSITNumber = () => {
    let MUSITNo = document.getElementById('musit-Numbers').value
    MUSITNo = Number(MUSITNo)
    if (Number.isFinite(MUSITNo)) {
        return MUSITNo
    } else {
        MUSITNo = false
        return MUSITNo
    }
}

// sends request to backend to fetch data
// is called by getArtsObsData()
async function getKommuneData  () {
    try {
        const url =  urlPath + '/tools/artsObs/?kommune=true'
        data = await (await fetch(url)).json();
        data = JSON.parse(data.unparsed)
        return data
    } catch (error) {
        console.log(error);
    }
}    

function fixAdmPlace (kommuneObj, municipality, county) {
    let input = municipality
    let admPlace = ''
    if (municipality.indexOf(' ')){
        municipality = municipality.slice(0,municipality.indexOf(' '))
    }
    try {
        // Ål (kommune i Viken) [4506] 
        admPlace = municipality + ' (kommune i ' + county +') [' + kommuneObj[county][municipality].HierarchPlaceId + ']'
        return admPlace
    } catch (error) {
        return input
    }
}

const fixUserInput = (artsObsNumbers) => {
    // replace all lineshifts with comma
    let arrayOfNumbers = Papa.parse(artsObsNumbers, papaParseConfig)

    let flatNumbers = arrayOfNumbers.data.flat()
    arrayOfNumbers.length = 0
    // Fjern tomme felter i array
    flatNumbers = flatNumbers.filter(Boolean)
    return flatNumbers
}

function reverseCollectors(fullname) {
    var names = fullname.split(' ');
    if (names.length > 2) {
        output = names[names.length - 1] + ', ' + names[0] + ' ' + names.slice(1, -1).join(' ')
      }
      else if (names.length < 2) {
        output = names[0]
      }
      else {
        output = names[names.length - 1] + ', ' + names[0]
      }
return output
}

function fixScientificName(scientificName) {
    if (scientificName.includes(',')) {
        return scientificName.substring(0, scientificName.lastIndexOf(','))
    } else {
        return scientificName
    }
}

const getArtsObsData = async (artsObsNumber, MUSITNo) => {
    const valgtSamling = document.getElementById('collection-select').value;
    // 'https://api.gbif.org/v1/occurrence/search?dataset_Key=b124e1e0-4755-430f-9eab-894f25a9b59c&catalogNumber=21957795'
    const url = `https://api.gbif.org/v1/occurrence/search?dataset_Key=b124e1e0-4755-430f-9eab-894f25a9b59c&catalogNumber=${artsObsNumber}`;
    let resultString = '';
  
    try {
        const response = await fetch(url);
        const obj = await response.json();
      
        if (!obj.results || obj.results.length === 0) {
            throw new Error(`Fant ikke følgende nummer hos artsdatabanken: ${artsObsNumber}`);
        }
      
        const resultObj = obj.results[0];
      
        // Fix ArtsObs entries
        resultObj.latLongCoords = `${resultObj.decimalLatitude}N ${resultObj.decimalLongitude}E`;
        if (resultObj.eventDate.includes('T')) { resultObj.eventDate = resultObj.eventDate.substring(0, resultObj.eventDate.indexOf('T')); }
        resultObj.dateIdentified = resultObj.dateIdentified || resultObj.eventDate;
      
        // Fix collector
        const collArray = resultObj.recordedBy.split('|').map(element => reverseCollectors(element.trim()));
        resultObj.recordedBy = collArray.join('; ');
        resultObj.identifiedBy = resultObj.identifiedBy || resultObj.recordedBy;
      
        // Fix scientificName for 'sopp' collection
        if (valgtSamling === 'sopp') {
            resultObj.scientificName = fixScientificName(resultObj.scientificName);
        }
      
        const kommuneObj = await getKommuneData();
        const transelateKeyMap = headerMap();
      
        for (const [key] of transelateKeyMap) {
            if (key === 'museumCollection') {
                resultString += addMuseum() + '\t';
            } else if (key === 'dbNumbers') {
                resultString += MUSITNo + '\t';
            } else if (key.includes('#D')) {
                resultString += '\t';
            } else if (key in resultObj) {
                if (key === 'municipality') {
                    const admPlace = fixAdmPlace(kommuneObj, resultObj[key], resultObj['county']);
                    resultString += admPlace + '\t';
                } else {
                    resultString += resultObj[key] + '\t';
                }
            } else {
                resultString += '\t';
            }
        }
      
        return resultString;
    } catch (error) {
        console.log('Feil med dataene fra GBif:');
        console.log(error);
        return false
    }
};


// download search-result to file
// in: filename(string, name of outputfile)
// in: text (string, the text that goes into the file, that is, the search result)
// out: downloaded tab-separated txt-file
async function download(filename, text) {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}


// "https://www.artsobservasjoner.no/MediaLibrary/2021/12/22a283c1-d274-4c0f-9ef4-131932598777_image.jpg"
const downloadImage = async (url) => {
    url = 'museum/tools/artsObsImage/?url=' + url
    const response = await fetch(url);
    const blob = await response.blob();
    togglePleaseWait(false)
    return blob
};
  
const downloadMany = urls => {
    return Promise.all(urls.filter(Boolean).map(url => downloadImage(url)));
}

const downloadAndZip = async (mediaObj, allResults) => {
    console.log('downloadAndZip');
    try {
        document.getElementById("please-wait").style.display = "block";
        const valgtMuseum = document.getElementById('museum-select').value;
        const valgtSamling = document.getElementById('collection-select').value;
        let akronym = '';

        try {
            akronym = collectionObject[valgtMuseum][valgtSamling] + '-';
        } catch (error) {
            akronym = '';
        }

        const zip = new JSZip();
        const txtBlob = new Blob([allResults], { type: 'text/plain' });
        zip.file('data.txt', txtBlob);

        let no = 1;

        for (const [key, value] of Object.entries(mediaObj)) {
            try {
                const blobs = await downloadMany(value);
                blobs.forEach((blob) => {
                    zip.file(`${akronym}${key}-0${no}.jpg`, blob);
                    no++;
                });
            } catch (error) {
                console.log(`Error downloading ${key} media:`, error);
                // Handle error (e.g., display error message, continue with other media)
                continue;
            }
            no = 1;
        }

        const currentDate = new Date().getTime();
        const zipFile = await zip.generateAsync({ type: 'blob' });
        const fileName = `combined-${currentDate}.zip`;

        document.getElementById("please-wait").style.display = "none";
        togglePleaseWait(false);

        saveAs(zipFile, fileName);
    } catch (error) {
        console.log('Unexpected error:', error);
        // Handle unexpected error (e.g., display generic error message)
    }
};


async function getImageUrls(keyObj) {
    try {
      const mediaObj = {};
      const onlyCCBY = !document.querySelector('#lisens').checked;
  
      for (const [key, value] of Object.entries(keyObj)) {
        // 'https://api.gbif.org/v1/occurrence/search?dataset_Key=b124e1e0-4755-430f-9eab-894f25a9b59c&catalogNumber=27783344'
        const url = `https://api.gbif.org/v1/occurrence/search?dataset_Key=b124e1e0-4755-430f-9eab-894f25a9b59c&catalogNumber=${key}`;
        const obj = await (await fetch(url)).json();
  
        if (obj.results[0]) {
          const tempObj = obj.results[0].extensions["http://rs.gbif.org/terms/1.0/Multimedia"];
  
          try {
            if ((onlyCCBY && tempObj[0]?.["http://purl.org/dc/terms/license"] === 'CC BY 4.0') || !onlyCCBY) {
              const imageUrls = tempObj.map(element => element["http://purl.org/dc/terms/identifier"]);
              mediaObj[value] = [...imageUrls];
            }
          } catch (error) {
            continue;
          }
        }
      }
      return mediaObj;
    } catch (error) {
      console.error('feil i getImageUrls:', error);
      return false;
    }
  }
  

async function main() {
    try {
        togglePleaseWait(true);

        let singelResult = '';
        let allResults = '';
        let MUSITNo = null;

        const keyObj = {};
        const museum = document.getElementById('museum-select').value;
        const samling = document.getElementById('collection-select').value;
        const Numbers = document.getElementById('artsObs-Numbers').value;

        if (!Numbers) {
            throw new Error('Du må skrive inn artsobsnumre'); // Throw an error if Numbers is empty
        }

        const artsObsNumbers = fixUserInput(Numbers);

        // Fix MUSIT number
        MUSITNo = getMUSITNumber();

        if (document.querySelector('#overskrift').checked) {
            const transelateKeyMap = headerMap();

            for (const [key, value] of transelateKeyMap) {
                allResults += value + '\t';
            }
        }

        for (const element of artsObsNumbers) {
            singelResult = await getArtsObsData(element, MUSITNo);
            keyObj[element] = MUSITNo;
            MUSITNo++;

            if (singelResult) {
                if (allResults) {
                    allResults += '\n' + singelResult;
                } else {
                    allResults = singelResult;
                }
            } else {
                allResults += '\n' + 'Fant ikke: ' + element;
            }
        }

        if (document.querySelector('#images-check').checked) {
            console.log('laster ned bilder');
            const mediaObj = await getImageUrls(keyObj);
            downloadAndZip(mediaObj, allResults);
            togglePleaseWait(false);
        } else {
            download("artsObsData.txt", allResults);
            togglePleaseWait(false);
        }
    } catch (error) {
        console.log('An error occurred:', error.message); // Output a more descriptive error message
        togglePleaseWait(false);
    }
}


// when somebody clicks submit-button
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()  
    main()
});


// when somebody clicks Vis-kolonne-button
document.getElementById("Vis-kolonne").addEventListener('click', (e) => {
    e.preventDefault()  
    try { 
        const transelateKeyMap = headerMap()
        let totValue = ''
        for (const [key, value] of transelateKeyMap) {
            totValue = totValue + value + '\t' 
        }
        download("Headers.txt", totValue)
    } catch (error) {
          console.log(error);  
    }
});


// console.log(getArtsObsData(21574795));
//21574795 28215006 2213006 28215007 27783443 27680409 25396524 27783344 27561102
// https://www.artsobservasjoner.no/Sighting/27783344