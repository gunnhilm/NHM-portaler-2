// backend: functions used in both DNAbarcodes.js (table with barcoded species) and bcSpecies.js (page for single species)
const urlParamsTop = new URLSearchParams(window.location.search)
const adbFilePath = './src/data/adb/'

// reads excel-overview-based-file for fungi
const getOverview = () => {
    return  new Promise(resolve => {
        const url = urlPath + '/getFungiOverview/'
        fetch(url).then((response) => {
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {
                    try {
                        data = JSON.parse(data)
                        // console.log(data.unparsed)
                        resolve(data.unparsed)
                    } catch (error) {
                        console.log(error)
                    }
                }
            })
        })
    })
}

// fetches data from fasta-file with sequences from BOLD
// out: array with objects, one object per species, containing all specimens sequenced and their sequences
const getFastaData = () => {
    return new Promise(resolve => {
        const url =   urlPath + `/DNAbarcodes/?getFasta=true&coll=${bcColl}`
        fetch(url).then((response) => { 
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {          
                    try {
                        data = JSON.parse(data)
                        // console.log(data)
                        resolve(data)
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        })
    })
}

const getCandidates = () => {
    return new Promise(resolve => {
        const url =   urlPath + `/getCandidates/?candidateFile=${adbFilePath}candidates_${bcColl}.txt`
        fetch(url).then((response) => { 
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {          
                    try {
                        data = JSON.parse(data)
                        resolve(data)
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        })  
    })
}
