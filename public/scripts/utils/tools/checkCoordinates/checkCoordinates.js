const lastSearch = JSON.parse(sessionStorage.getItem('string'))
 

let locArray = []
// lastSearch.forEach(element => {
//     let coordinates = [parseFloat(element.decimalLatitude), parseFloat(element.decimalLongitude)]
//     //console.log(coordinates)
//     locArray.push(coordinates)
// })
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

const getNeighbors = (valgtLKommune) => {
    return new Promise((resolve, reject) => {
        console.log('valget er: ' +  valgtLKommune);
        let kommuneNummer = ''
        for (let i = 0; i < kommuneListe.length; i++) {
            if(kommuneListe[i].kommunenavnNorsk === valgtLKommune)
            {
                kommuneNummer = kommuneListe[i].kommunenummer
                console.log(kommuneNummer);
            }   
        }
        console.log(kommuneNummer);

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

// Hvis noe velger en fil med feil
document.querySelector('#error-filer-list').addEventListener('click',function(e){
    const dd =  document.getElementById("error-filer-list")
    const file = dd.options[dd.selectedIndex].id
    const item = dd.options[dd.selectedIndex].value
    console.log(file);
    console.log(item);
    const museum = getMuseum()
    const url = 'checkCoord?museum=' + museum + '&download=' + file
    fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        } else {
            console.log('her kommer fila');
            console.log(response);
            // window.open(response);
            // return response
        }
    })
})

//ikke gjør en  sjekk for hvert koordinat,  la heller backend plukke opp søket (?) og send array med booleans tilbake...

document.querySelector('#coord-select').addEventListener('change',function(){

    const table = document.querySelector('#coord-results')
    const row = table.insertRow(0)
    row.style = "border: solid"
    const cell1 = row.insertCell(0)
    const cell2 = row.insertCell(1)
    const cell3 = row.insertCell(2)
    cell1.innerHTML = "Katalognummer".bold()
    cell2.innerHTML = "Kommune i musit".bold()
    cell3.innerHTML = "Kommune koordinatene havner i iflg. geonorge.no".bold()

    const array = []
    const lastSearch = JSON.parse(sessionStorage.getItem('string'))
    //const url = urlPath + '/checkRegion/?string=' + lastSearch
    const searchTerm = sessionStorage.getItem('searchTerm')
    let museum = sessionStorage.getItem('museum')
    console.log(museum)
    
//     const chosenCollection = sessionStorage.getItem('chosenCollection')
//     const limit = sessionStorage.getItem('limit')
//     const url = urlPath + '/checkRegion/?search=' + searchTerm + '&museum=' + museum + '&samling=' + chosenCollection + '&linjeNumber=0' + '&limit=' + limit // normal search
        
    
    
//     fetch(url).then((response) => {
//         if (!response.ok) {
//             throw 'noe galt i koordinat-sjekk, respons ikke ok'
//         } else {
//             try {
//                 response.text().then((data) => {
//                     if(data.error) {
//                         return console.log(data.error)
//                     } else {
//                         console.log(data)
//                     }
//                 })
//             } catch (error) {
//                 console.error(error)
//                 reject(error);
//             }
//         } 
//     }).catch((error) => {
//         console.log('her er koord-feil ' + error);
//         //errorMessage.innerHTML = textItems.serverError[index]
//     })

// })
    lastSearch.forEach(element => {
        regionType = 'kommune'
        if (element.decimalLatitude && element.decimalLongitude) {
            lat = parseFloat(element.decimalLatitude)
            long = parseFloat(element.decimalLongitude)
            const url = urlPath + '/checkRegion/?regionType=' + regionType + '&lat=' + lat + '&long=' + long
            fetch(url).then((response) => {
                if (!response.ok) {
                    throw 'noe går galt med koordinat-sjekk, respons ikke ok'
                } else {
                    try {
                        response.text().then((data) => {
                            if(data.error) {
                            // errorMessage.innerHTML = textItems.serverError[index]
                                return console.log(data.error)
                            } else {
                                if (element.county === JSON.parse(data).unparsed) {
                                   
                                } else {
                                    // document.querySelector('#coordResult').innerHTML += element.catalogNumber + ' ' +
                                    // element.county + ' ' + JSON.parse(data).unparsed + '<br>'
                                    const row1 = table.insertRow(1)
                                    const cell_1 = row1.insertCell(0)
                                    const cell_2 = row1.insertCell(1)
                                    const cell_3 = row1.insertCell(2)
                                    cell_1.innerHTML = element.catalogNumber
                                    cell_2.innerHTML = element.county
                                    cell_3.innerHTML = JSON.parse(data).unparsed

                                    
                                }
                            }
                        })
                    }
                    catch (error) {
                        console.error(error)
                        reject(error);
                    }
                }
                
            }).catch((error) => {
                console.log('her er koord-feil ' + error);
                //errorMessage.innerHTML = textItems.serverError[index]
            })
        }
        
    })

       
    //document.querySelector('#coordResult').innerHTML += 'sjekk ferdig'
    
})

document.querySelector('#checkCoordMap').addEventListener('click',function(){
    console.log('map')
    
})



document.getElementById('norske-kommuner').addEventListener('change',function(){
    const valgtLKommune = document.getElementById('norske-kommuner').value
    getNeighbors(valgtLKommune).then((data) => visNaboer(data))
})

let kommuneListe = ''
const main = async () => {
    await getMunicipalityList().then((data) =>kommuneListe = data)
}
getFileList()
main()

