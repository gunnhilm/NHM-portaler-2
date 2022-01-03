const searchForm = document.querySelector('form') 



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


const transelateKeyMap = new Map();
transelateKeyMap.set('museumCollection', 'Museum');
transelateKeyMap.set('dbNumbers', 'Løpenummer');
transelateKeyMap.set('#Dummy3', 'UUID');
transelateKeyMap.set('catalogNumber', 'Artsobservasjon nr.');
transelateKeyMap.set('#Dummy4', 'Navn_Usikkerhet');
transelateKeyMap.set('acceptedScientificName', 'Vitenskapelig navn');
transelateKeyMap.set('#Dummy5', 'Norsk navn');
transelateKeyMap.set('#Dummy6', 'Kommentar (bestemmelse)');
transelateKeyMap.set('municipality', 'Administrativt sted/kommune');
transelateKeyMap.set('locality', 'Lokalitet');
transelateKeyMap.set('geodeticDatum', 'Datum');
transelateKeyMap.set('latLongCoords', 'Koordinater');
transelateKeyMap.set('#Dummy7', 'Koordinat - usikker');
transelateKeyMap.set('#Dummy8', 'Koordinater bestemt i ettertid');
transelateKeyMap.set('coordinateUncertaintyInMeters', 'Koordinat-presisjon (m)');
transelateKeyMap.set('habitat', 'Økologi');
transelateKeyMap.set('#Dummy9', 'Kartblad');
transelateKeyMap.set('#Dummy10', 'Høyde over havet (m)');
transelateKeyMap.set('#Dummy11', 'Høyde - usikker');
transelateKeyMap.set('recordedBy', 'Innsamlere');
transelateKeyMap.set('eventDate', 'Innsamlingsdato');



const addMuseum = () => {
    const valgtMuseum = document.getElementById('museum-select').value
    const valgtSamling = document.getElementById('collection-select').value
    let museumString = ''
    if (valgtMuseum === 'nhm'){
        if(valgtSamling === 'entomologi'){
            museumString = 'NHMO'
        } else {
            museumString = 'O'
        }
    } else {
        museumString = ''
    }
    return museumString
}

const getMUSITNumber = () => {
    let MUSITNo = document.getElementById('musit-Numbers').value
    MUSITNo = Number(MUSITNo)
    if (Number.isFinite(MUSITNo)) {
        console.log('is number');
        return MUSITNo
    } else {
        MUSITNo = false
        return MUSITNo
    }
}


const fixUserInput = () => {
    let artsObsNumbers = document.getElementById('artsObs-Numbers').value
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

const getArtsObsData = async (artsObsNumber, MUSITNo)=> {
    try{
    // 'https://api.gbif.org/v1/occurrence/search?dataset_Key=b124e1e0-4755-430f-9eab-894f25a9b59c&catalogNumber=21957795'
    let url = 'https://api.gbif.org/v1/occurrence/search?dataset_Key=b124e1e0-4755-430f-9eab-894f25a9b59c&catalogNumber=' + artsObsNumber; 
    let obj = null;
    let resultObj = null
    let resultString = ''
    let collArray = []
    let tempColl = ''
    let collString = null
    let museumCollection = ''
    obj = await (await fetch(url)).json();
        resultObj = obj.results[0]
        obj = null

        // fix ArtsObs entries
        let Koordinater = resultObj.decimalLatitude + 'N ' + resultObj.decimalLongitude + 'E'
        resultObj.latLongCoords = Koordinater

        // fix Museum & collection
        museumCollection = addMuseum()


        // fix dato, fjern alt etter T
        let fixedDate = resultObj.eventDate
        fixedDate = fixedDate.substring(0,fixedDate.search('T'))
        resultObj.eventDate = fixedDate

        // fix collector
        let fixedColl = resultObj.recordedBy
        if (fixedColl.indexOf('|')) {
            collArray = fixedColl.split('|')
        } else {
            collArray = [resultObj.recordedBy]
        }
        collArray.forEach((element) => {

            tempColl = reverseCollectors(element)
            if (collString){
            collString = collString + '; ' + tempColl
            } else {
                collString = tempColl
            }
        })
        collString = collString.trim()
        resultObj.recordedBy = collString
        for (const [key] of transelateKeyMap) {
            if (key === 'museumCollection') {
                resultString = resultString + museumCollection + '\t' 
            } else if (key === 'dbNumbers') {
                resultString = resultString + MUSITNo + '\t'
            } else if (key.includes('#D')) {
                resultString = resultString + '' + '\t'
            }else if (key in resultObj) {
                resultString = resultString + resultObj[key] + '\t'
            } else {
                resultString = resultString + '' + '\t'
            }
        }
        return resultString
    } catch (error) {
        console.log(error);
        alert('Fant ikke følgende nummer hos artsdatabanken: ' + artsObsNumber)
        console.log('feil med resultater fra artsobs');
    }
}


// download search-result to file
// in: filename(string, name of outputfile)
// in: text (string, the text that goes into the file, that is, the search result)
// out: downloaded tab-separated txt-file
function download(filename, text) {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)
    
    element.style.display = 'none'
    document.body.appendChild(element)
   
    element.click()
    
    document.body.removeChild(element)
}


// https://huynvk.dev/blog/download-files-and-zip-them-in-your-browsers-using-javascript
const downloadImage = async (url) => {
    return fetch(url).then(resp => resp.blob());
  };
  
  const downloadMany = urls => {
    return Promise.all(urls.map(url => downloadImage(url)))
  }

//   const urls = []
//   const catalogNo = []
// download images
const downloadAndZip = async (urls, catalogNo) => {
    document.getElementById("please-wait").style.display = "block"
    return downloadMany(urls).then(blobs =>{
        const zip = JSZip();
        blobs.forEach((blob, i) => {
        //   zip.file(`file-${i}.jpg`, blob);
          zip.file(`${catalogNo[i]}.jpg`, blob);
        });
        zip.generateAsync({type: 'blob'}).then(zipFile => {
          const currentDate = new Date().getTime();
          const fileName = `combined-${currentDate}.zip`;
          document.getElementById("please-wait").style.display = "none"
          return saveAs(zipFile, fileName);
        });
    } );
  }

async function main() {
    try{
        let singelResult = ''
        let allResults = ''
        let MUSITNo = null

            let artsObsNumbers = fixUserInput() 
            // fix MUSIT number
            MUSITNo = getMUSITNumber()
 
            for (const element of artsObsNumbers) {
                singelResult = await getArtsObsData(element, MUSITNo)
                MUSITNo = ++MUSITNo
                if (singelResult) {
                    if (allResults){
                        allResults = allResults + '\n' + singelResult
                    } else {
                        allResults = singelResult
                    } 
                } else {
                    allResults = allResults + '\n' + 'Fant ikke: ' + element
                }
            }

    download("download.txt", allResults)
    } catch (error) {
        console.log(error);
    }
}

// when somebody clicks submit-button
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()  
    main()


}) 
// console.log(getArtsObsData(21574795));
//21574795 28215006 2213006 28215007