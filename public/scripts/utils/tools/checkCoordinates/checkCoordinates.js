const lastSearch = JSON.parse(sessionStorage.getItem('string'))
const rareKommuner = []
 
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
    const url = 'https://api.kartverket.no/kommuneinfo/v1/kommuner'
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
        // console.error('Error:', error);
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
    const url = 'https://api.kartverket.no/kommuneinfo/v1/kommuner/' + kommuneNummer + '/nabokommuner'
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
    const table = document.querySelector('#coord-results')
    const row = table.insertRow(-1)
    const cell1 = row.insertCell(0)
    cell1.innerHTML = "No more errors".bold()
}
function createObjectLink(element, museumURLPath, museum, prefix) {
      if (element.catalogNumber.includes('J')) {
        element.catalogNumber = element.catalogNumber.substring(2);
      }
      if (element.catalogNumber.includes('/')) {
        let strippedCatNo = element.catalogNumber.substring(0, element.catalogNumber.indexOf('/'));
        return `<a id="object-link" target="_blank" href="${museumURLPath}/object/?id=${element.catalogNumber}&samling=${sessionStorage.getItem('chosenCollection')}&museum=${museum}&lang=${sessionStorage.getItem('language')}"> ${prefix}${strippedCatNo} </a>`;
      } else {
        return `<a id="object-link" target="_blank" href="${museumURLPath}/object/?id=${element.catalogNumber}&samling=${sessionStorage.getItem('chosenCollection')}&museum=${museum}&lang=${sessionStorage.getItem('language')}"> ${prefix}${element.catalogNumber} </a>`;
      }
  }


  function getPrefix(element) {
    let organismGroup = sessionStorage.getItem('organismGroup');
    let chosenCollection = sessionStorage.getItem('chosenCollection');
    let prefix;
  
    if (organismGroup.includes('paleontologi')) {
      prefix = 'PMO ';
    } else if (chosenCollection.includes('fisk')) {
      prefix = 'NHMO-J-';
    } else if (element.institutionCode && !(/[a-zA-Z]/).test(element.catalogNumber.charAt(0))) {
      prefix = element.institutionCode + '-' + element.collectionCode + '-';
    } else {
      prefix = '';
    }
  
    return prefix;
  }


async function callAPI(element, table, museum, museumURLPath) {

    if(element.stateProvince === 'Svalbard' || element.country !== 'Norway' || element.county === '' ) {
        return
    }
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
                                    let isNeighbors = 'Nei'
                                    if(neighbors){
                                        for (let i = 0; i < neighbors.length; i++) {
                                            if(data.unparsed === neighbors[i]) {
                                                isNeighbors = 'Ja'
                                            }
                                        }
                                    }
                                    const row1 = table.insertRow(1)
                                    const cell_1 = row1.insertCell(0)
                                    const cell_2 = row1.insertCell(1)
                                    const cell_3 = row1.insertCell(2)
                                    const cell_4 = row1.insertCell(3)
                                    // to get prefix to catalognumber right
                                    let prefix = getPrefix(element)
                                    if (element.catalogNumber) {
                                        cell_1.innerHTML = createObjectLink(element, museumURLPath, museum, prefix);
                                    }
                    
                                    cell_2.innerHTML = element.county
                                    cell_3.innerHTML = data.unparsed
                                    cell_4.innerHTML = isNeighbors
                                }
                    }
                    catch (error) {
                        rareKommuner.push(element);
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

function updateRareKommunerTable(rareKommuner, museumURLPath, museum) {
    let divContainer = document.getElementById('avik');
    let table = document.getElementById('rare-kommuner');
  
    if (!table) {
      table = document.createElement('table');
      table.id = 'rare-kommuner';
      divContainer.appendChild(table);
    }
  
    // Clear existing table content
    table.innerHTML = '';
  
    // Create table header row if it doesn't exist
    if (table.getElementsByTagName('thead').length === 0) {
      let header = table.createTHead();
      let hRow = header.insertRow();
  
      let katalognummerHeader = document.createElement('th');
      katalognummerHeader.textContent = 'Katalognummer';
      hRow.appendChild(katalognummerHeader);
  
      let kommuneHeader = document.createElement('th');
      kommuneHeader.textContent = 'Kommune';
      hRow.appendChild(kommuneHeader);
    }
  
    // Sort the rareKommuner array based on the Kommune column (column 2)
    rareKommuner.sort(function(a, b) {
      return a.county.localeCompare(b.county);
    });
  
    // Populate table with sorted data
    for (let obj of rareKommuner) {
      let row = table.insertRow();
      const prefix = getPrefix(obj)
  
      let katalognummerCell = row.insertCell();
      katalognummerCell.innerHTML = createObjectLink(obj, museumURLPath, museum, prefix);
  
      let kommuneCell = row.insertCell();
      kommuneCell.textContent = obj.county;
    }
  }
  

let kommuneListe = ''
const main = async () => {
    await getMunicipalityList().then((data) =>kommuneListe = data)
    await checkCoords()
    endTable()
    if (rareKommuner.length > 0) {
        let museum = sessionStorage.getItem('museum')
        const museumURLPath = getMuseumPath()
        
        updateRareKommunerTable(rareKommuner, museumURLPath, museum);
        document.getElementById("rare-kommuner-text").style.display = "block";
    }
}



main()
