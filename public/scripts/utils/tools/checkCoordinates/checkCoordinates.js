const lastSearch = JSON.parse(sessionStorage.getItem('string'))

let locArray = []
// lastSearch.forEach(element => {
//     let coordinates = [parseFloat(element.decimalLatitude), parseFloat(element.decimalLongitude)]
//     //console.log(coordinates)
//     locArray.push(coordinates)
// })





//ikke gøjr en  sjekk for hvert koordinat,  la heller backend plukke opp søket (?) og send array med booleans tilbake...

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

