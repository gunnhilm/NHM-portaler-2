console.log('client side javascript is loaded')


// names for DOM elements (?) for search

// on page initially
const samling = document.querySelector('#collection-select') //engelsk
const searchForm = document.querySelector('form') //// bruk konsekvent querySelector eller get elementbyid?
const search = document.querySelector('input')

// rendered with result table (used in function resultTable())
const resultHeader = document.getElementById("resultHeader")
const antall = document.querySelector('#antall-treff') //engelsk
const nbHits = document.getElementById("nbHits")
const table = document.getElementById("myTable")

// rendered with result table, in footer
const oppdatert = document.querySelector('#sist-oppdatert') //engelsk

// decides which language is rendered
language = document.querySelector('#language').value

// render result table
const resultTable = (data) => {
    if (language === "Norwegian") {
        index = 0
    } else if (language === "English") {
        index = 1
    }
    sessionStorage.clear() 
    stringData = JSON.stringify(data)
    sessionStorage.setItem('string', stringData)    // Save searchresult to local storage
    
    const antallTreff = data.length
    antall.textContent = antallTreff
    
    resultHeader.innerHTML = textItems.searchResultHeadline[index]
    nbHits.innerHTML = textItems.nbHitsText[index]

    table.innerHTML = "";
    for (i = -1; i < antallTreff; i++) {
        const row = table.insertRow(-1)

        const cell1 = row.insertCell(0)
        const cell2 = row.insertCell(1)
        const cell3 = row.insertCell(2)
        const cell4 = row.insertCell(3)
        const cell5 = row.insertCell(4)
        const cell6 = row.insertCell(5)
        const cell7 = row.insertCell(6)
        if (i === -1) {
            // header row
            cell1.innerHTML = 'MUSIT-ID'.bold()
            cell2.innerHTML = textItems.headerTaxon[index].bold()
            cell3.innerHTML = textItems.headerCollector[index].bold()
            cell4.innerHTML = textItems.headerDate[index].bold()
            cell5.innerHTML = textItems.headerCountry[index].bold()
            cell6.innerHTML = textItems.headerMunicipality[index].bold()
            cell7.innerHTML = textItems.headerLocality[index].bold()

        } else {
            cell1.innerHTML =  `<a id="objekt-link" href="http://localhost:3000/object/?id=${i}"> ${data[i].catalogNumber} </a>`
            cell2.innerHTML = data[i].scientificName
            cell3.innerHTML = data[i].recordedBy
            cell4.innerHTML = data[i].eventDate
            cell5.innerHTML = data[i].country
            cell6.innerHTML = data[i].county
            cell7.innerHTML = data[i].locality

            // gir de klassen resultTable så de kan styles
            cell1.className = 'row-1 row-ID';
            cell2.className = 'row-2 row-name';
            cell3.className = 'row-3 row-innsamler';
            cell4.className = 'row-4 row-dato';
            cell5.className = 'row-5 row-land';
            cell6.className = 'row-6 row-kommune';
            cell7.className = 'row-7 row-sted';


        }
    }    
}

// download search-result to file
function download(filename, text) {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)
    
    element.style.display = 'none'
    document.body.appendChild(element)
   
    element.click()
    
    document.body.removeChild(element)
}

// render download button and functionality for this
const downloadFunction = () => {
  
    // make button
    const lastNed = document.createElement("BUTTON");
    lastNed.setAttribute("id", "downloadButtonId")
    lastNed.innerHTML = textItems.downloadLink[index]
    document.getElementById('downloadButton').appendChild(lastNed)

    // when download-button is clicked
    lastNed.addEventListener('click', (e) => {
        e.preventDefault()
        const searchTerm = search.value
        const valgtSamling = samling.value
        
        const url = 'http://localhost:3000/download/?search=' + searchTerm +'&samling=' + valgtSamling
        fetch(url).then((response) => {
                
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {
                    const downloadData = JSON.parse(data).unparsed
                    // Start file download.
                    download("download.txt", downloadData)
                }
            })
        })
    })
}

// render map
const drawMap = (parsedData) => {
    // remove old map if any and empty array
    document.getElementById("map").innerHTML = "" 
    coordinateArray.length = 0
      
    // fyll en array med koordinater for kartet
    parsedData.forEach(function(item, index) {
        if (item.decimalLatitude & item.decimalLongitude) {
            const object = { decimalLatitude: Number(item.decimalLatitude),
                decimalLongitude: Number(item.decimalLongitude),
                catalogNumber: item.catalogNumber,
                index: index }
            coordinateArray.push(object) 
        } 
    })

    if (coordinateArray.length === 0) {
         document.querySelector("#map").innerHTML = 'Objektet/-ene har ikke koordinater registrert og kart kan derfor ikke vises'
    } else {
        // call map-function to draw map
        //mapWithAllHits(coordinateArray)
        const newArray = []
        let latitudeSum
        let longitudeSum
        coordinateArray.forEach(function(item) {
            if(item.decimalLongitude) {
                const marker = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([Number(item.decimalLongitude), Number(item.decimalLatitude)])),
                    catalogNumber: item.catalogNumber,
                    index: item.index
                })
                newArray.push(marker)
                latitudeSum = latitudeSum + Number(item.decimalLatitude) // tror ikke dissse har funksjon, noe her virker uansett ikke
                longitudeSum = longitudeSum + Number(item.decimalLongitude) // tror ikke dissse har funksjon, noe her virker uansett ikke
            }
        })

                    
        // icon
        const iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
            })
        })
            

        newArray.forEach(function(item) {
            item.setStyle(iconStyle)
        })
    
        // source object for this feature
        const vectorSource = new ol.source.Vector({
            features: newArray
        })
 
        // add this object to a new layer
        const vectorLayer = new ol.layer.Vector({
            source: vectorSource
        })

        map = new ol.Map({
            target: 'map',
            layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            vectorLayer
            ]       
        })
    
        const extent = vectorSource.getExtent()

        // to make extent of map larger than exactly where  the points are
        map.getView().fit(extent, {padding: [50, 50, 50, 50]})
        
        // popups
        const element = document.getElementById('popup')
        const content = document.getElementById('popup-content')

        const popup = new ol.Overlay({
            element: element,
            positioning: 'bottom-center',
            stopEvent: true, // true here enables clickable link in popup
            offset: [0,0]
        })
    
        map.addOverlay(popup)

        //display popup on a click
        map.on('singleclick', function(evt) {
            const feature = map.forEachFeatureAtPixel(evt.pixel,
                function(feature) {
                    return feature
                })
            if (feature) {
                const coordinates = feature.getGeometry().getCoordinates()
                popup.setPosition(coordinates)
                content.innerHTML =  `<a id="objekt-link" href="http://localhost:3000/object/?id=${feature.get('index')}"> ${feature.get('catalogNumber')} </a>`
            } 
        })  
    }
}



let map
let coordinateArray = []

// når noen trykker på søk knappen 
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = search.value
    const valgtSamling = samling.value
    // empty table
    table.innerHTML = ""
    resultHeader.innerHTML = ""
    antall.textContent = ""
    nbHits.innerHTML = ""
    // Show please wait
    document.getElementById("pleaseWait").style.display = "block"
    // mustChoose
    if (language === "Norwegian") {
        index = 0
    } else if (language === "English") {
        index = 1
    }
    
    if (!valgtSamling) {
        resultHeader.innerHTML = textItems.mustChoose[index]
        document.getElementById("pleaseWait").style.display = "none"
    } else {
        const url = 'http://localhost:3000/search/?search=' + searchTerm +'&samling=' + valgtSamling
        fetch(url).then((response) => {
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                    resultHeader.innerHTML = "Server Feil, prøv nytt søk"
                } else {
                    const JSONdata = JSON.parse(data) 
                    
                        const parsedResults = Papa.parse(JSONdata.unparsed, {
                        delimiter: "\t",
                        newline: "\n",
                        quoteChar: '',
                        header: true,
                        }) 
                    //check if there are any hits from the search
                    if ( parsedResults.data === undefined || parsedResults.data.length === 0 ) {
                        resultHeader.innerHTML = "Ingen treff, prøv nytt søk"
                    } else {
                        resultTable(parsedResults.data)
                        drawMap(parsedResults.data)
                        downloadFunction() // render download button and functionality for this
                    }
                }
            })
            document.getElementById("pleaseWait").style.display = "none"
        })    
    }
  })


// når noe velger en samling vil det sendes en forespørsel til server om dato på MUSIT-dump fila
samling.addEventListener('change', (e) => {
    e.preventDefault()
    const url = 'http://localhost:3000/footer-date/?&samling=' + e.target.value
        fetch(url).then((response) => {
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {
                    data = JSON.parse(data)
                    StistOppdatert = 'Dataene ble sist oppdatert: ' + data.date
                    oppdatert.textContent = StistOppdatert
                    
                }
            })
        })
})