const lastSearch = JSON.parse(sessionStorage.getItem('string'))

let locArray = []
// lastSearch.forEach(element => {
//     let coordinates = [parseFloat(element.decimalLatitude), parseFloat(element.decimalLongitude)]
//     //console.log(coordinates)
//     locArray.push(coordinates)
// })



//ikke gøjr en  sjekk for hvert koordinat,  la heller backend plukke opp søket (?) og send array med booleans tilbake...

document.querySelector('#coord-select').addEventListener('change',function(){
    
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
                                    document.querySelector('#coordResult').innerHTML += element.catalogNumber + ' ' +
                                    element.county + ' ' + JSON.parse(data).unparsed + '<br>'
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


