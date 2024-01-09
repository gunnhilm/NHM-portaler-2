const lastSearch = JSON.parse(sessionStorage.getItem('string'))
 
let locArray = []

const getMuseum = () => {
    const path = window.location.pathname
    const  museum = path.split('/')
    return museum[2]
}

const getFileList = () => {
    const museum = getMuseum()
    // hent lista over feilfiler fra server
    const url = 'checkCoord?museum=' + museum 
        fetch(url).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.text()
            }
        }).then ((data) => {
            data = JSON.parse(data)
            addCollectionsToSelect(data.results)
        })
}

const addCollectionsToSelect = (errorList) => {
    for (const [key, value] of Object.entries(errorList)) {
        elOption = document.createElement("option")
        elOption.text = key
        elOption.value = key
        elOption.id = value
        document.querySelector('#error-filer-list').add(elOption)
    }
}

const getMunicipalityList = async () => {
return new Promise((resolve, reject) => {
    const url = 'https://ws.geonorge.no/kommuneinfo/v1/kommuner'
    const norskeKommuner = []
    let options = ''
    fetch(url, {
        headers: {
            'Accept': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
          for (let i = 0; i < data.length; i++) {
              norskeKommuner.push(data[i].kommunenavnNorsk)
          }
          norskeKommuner.sort()
          for (let j = 0; j < norskeKommuner.length; j++) {
            options += '<option value="' +norskeKommuner[j] + '" />' 
          }
          document.getElementById('norske-kommuner-list').innerHTML = options;
          resolve(data)
      })
      .catch((error) => {
        console.error('Error:', error);
        reject(error)
      });
    })
}

const getNeighbors = async (valgtLKommune) => {
    return new Promise((resolve, reject) => {
        let kommuneNummer = ''
        for (let i = 0; i < kommuneListe.length; i++) {
            if(kommuneListe[i].kommunenavnNorsk === valgtLKommune)
            {
                kommuneNummer = kommuneListe[i].kommunenummer
            }   
        }
    const url = 'https://ws.geonorge.no/kommuneinfo/v1/kommuner/' + kommuneNummer + '/nabokommuner'
    const naboKommuner = []
    fetch(url, {
        headers: {
            'Accept': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
            
            for (let j = 0; j < data.length; j++) {
                naboKommuner.push(data[j].kommunenavnNorsk)
            }
        resolve(naboKommuner)
      })
      .catch((error) => {
        console.error('Error:', error);
        reject(error)
      });
})
}

const visNaboer = (naboKommuner) => {
    document.querySelector("#naboer").innerHTML = '<p>Nabo kommuner</p>'.bold()
    for (let i = 0; i < naboKommuner.length; i++) {
        const element = naboKommuner[i] + '<br>'
        document.querySelector("#naboer").innerHTML += element
    }
}

function getMuseumPath(){
    let museumURLPath = ''
    if (window.location.href.includes('/um')) { 
        museumURLPath = urlPath + "/um"
    } else if (window.location.href.includes('tmu')) {
        museumURLPath = urlPath + "/tmu"
    } else if (window.location.href.includes('nbh')) {
        museumURLPath = urlPath + "/nbh"
    } else {
        museumURLPath = urlPath + "/nhm"
    }
    return museumURLPath
}

const endTable = async () =>   {
    console.log('endTable');
    const table = document.querySelector('#coord-results')
    const row = table.insertRow(-1)
    const cell1 = row.insertCell(0)
    cell1.innerHTML = "No more errors".bold()
}

// async function callAPI(element, table, museum, museumURLPath) {
//     return new Promise((resolve,reject) => {
//         const regionType = 'kommune'
//         if (element.decimalLatitude && element.decimalLongitude) {
//             lat = parseFloat(element.decimalLatitude)
//             long = parseFloat(element.decimalLongitude)
//             const url = urlPath + '/checkRegion/?regionType=' + regionType + '&lat=' + lat + '&long=' + long
//             fetch(url).then((response) => {
//                     try {
//                         response.text().then(async (data) => {
//                                 if (element.county === JSON.parse(data).unparsed) {
//                                 } else {
//                                     const neighbors = await getNeighbors(element.county)
//                                     let neighborsString = ""
//                                     let isNeighbors = 'Nei / No'
//                                     if(neighbors){
//                                         for (let i = 0; i < neighbors.length; i++) {
//                                             if(JSON.parse(data).unparsed === neighbors[i]) {
//                                                 isNeighbors = 'Ja / Yes'
//                                             }
//                                         }
//                                     }
//                                     const row1 = table.insertRow(1)
//                                     const cell_1 = row1.insertCell(0)
//                                     const cell_2 = row1.insertCell(1)
//                                     const cell_3 = row1.insertCell(2)
//                                     const cell_4 = row1.insertCell(3)
//                                     cell_1.innerHTML =  `<a id="object-link" target="_blank" href="${museumURLPath}/object/?id=${element.catalogNumber}&samling=${sessionStorage.getItem('chosenCollection')}&museum=${museum}&lang=${sessionStorage.getItem('language')}"> ${element.catalogNumber} </a>`
//                                     cell_2.innerHTML = element.county
//                                     cell_3.innerHTML = JSON.parse(data).unparsed
//                                     cell_4.innerHTML = isNeighbors
//                                 }
//                         }).then(() => {
//                             console.log('resolve');
//                             resolve(true)
//                         })
//                     }
//                     catch (error) {
//                         console.error(error)
//                         reject(error);
//                     }
//             })
//             .catch((error) => {
//                 console.log('her er koord-feil ' + error);
//                 //errorMessage.innerHTML = textItems.serverError[index]
//             })
//         }
//     })
// }


async function callAPI(element, table, museum, museumURLPath) {
        const regionType = 'kommune'
        if (element.decimalLatitude && element.decimalLongitude) {
            lat = parseFloat(element.decimalLatitude)
            long = parseFloat(element.decimalLongitude)
            const url = urlPath + '/checkRegion/?regionType=' + regionType + '&lat=' + lat + '&long=' + long
            const response = await fetch(url)
            const data = await response.json()
                    try {
                                if (element.county !== data.unparsed) {
                                    const neighbors = await getNeighbors(element.county)
                                    let neighborsString = ""
                                    let isNeighbors = 'Nei / No'
                                    if(neighbors){
                                        for (let i = 0; i < neighbors.length; i++) {
                                            if(data.unparsed === neighbors[i]) {
                                                isNeighbors = 'Ja / Yes'
                                            }
                                        }
                                    }
                                    const row1 = table.insertRow(1)
                                    const cell_1 = row1.insertCell(0)
                                    const cell_2 = row1.insertCell(1)
                                    const cell_3 = row1.insertCell(2)
                                    const cell_4 = row1.insertCell(3)
                                    // to get prefix to catalognumber right
                                    let prefix
                                    if (sessionStorage.getItem('organismGroup').includes('paleontologi')) {
                                        prefix = 'PMO '
                                    } else if (sessionStorage.getItem('chosenCollection').includes('fisk')) {
                                        prefix = 'NHMO-J-'
                                    } else if (element.institutionCode && !(/[a-zA-Z]/).test(element.catalogNumber.charAt(0))) {
                                        prefix = element.institutionCode + '-' + element.collectionCode + '-'    
                                    } else {
                                        prefix = ''
                                    }
                               
                                    if (element.catalogNumber) {
                                        if (element.catalogNumber.includes('J')) { element.catalogNumber = element.catalogNumber.substring(2)}
                                        if (element.catalogNumber.includes('/')) { // mose-data
                                            let strippedCatNo = element.catalogNumber.substring(0,element.catalogNumber.indexOf('/'))
                                            cell_1.innerHTML =  `<a id="object-link" target="_blank" href="${museumURLPath}/object/?id=${element.catalogNumber}&samling=${sessionStorage.getItem('chosenCollection')}&museum=${museum}&lang=${sessionStorage.getItem('language')}"> ${prefix}${strippedCatNo} </a>`
                                        } else {
                                            console.log(prefix)
                                            cell_1.innerHTML =  `<a id="object-link" target="_blank" href="${museumURLPath}/object/?id=${element.catalogNumber}&samling=${sessionStorage.getItem('chosenCollection')}&museum=${museum}&lang=${sessionStorage.getItem('language')}"> ${prefix}${element.catalogNumber} </a>`
                                        }
                                    }
                    
                                    cell_2.innerHTML = element.county
                                    cell_3.innerHTML = data.unparsed
                                    cell_4.innerHTML = isNeighbors
                                }
                    }
                    catch (error) {
                        console.error(error)
                       return false;
                    }
        }
        return true
}

// sjekk kommuner og koordinater
async function checkCoords() {
    // return new Promise((resolve,reject) => {
        const table = document.querySelector('#coord-results')
        const row = table.insertRow(0)
        row.style = "border: solid"
        const cell1 = row.insertCell(0)
        const cell2 = row.insertCell(1)
        const cell3 = row.insertCell(2)
        const cell4 = row.insertCell(3)
        cell1.innerHTML = "Katalognummer".bold()
        cell2.innerHTML = "Kommune i musit".bold()
        cell3.innerHTML = "Kommune koordinatene havner i iflg. geonorge.no".bold()
        cell4.innerHTML = "Nabokommuner".bold()

        const lastSearch = JSON.parse(sessionStorage.getItem('string'))
        console.log(lastSearch)
        let museum = sessionStorage.getItem('museum')
        const museumURLPath = getMuseumPath()
        await Promise.all(lastSearch.map(async (element) => {
            await callAPI(element, table, museum, museumURLPath)
        }))
}



document.getElementById('norske-kommuner').addEventListener('change',function(){
    const valgtLKommune = document.getElementById('norske-kommuner').value
    getNeighbors(valgtLKommune).then((data) => visNaboer(data))
})



let kommuneListe = ''
const main = async () => {
    await getMunicipalityList().then((data) =>kommuneListe = data)
    await checkCoords()
    endTable()

}



main()
