console.log('client side javascript is loaded');

// når noen trykker på søk
const searchForm = document.querySelector('form')
const search = document.querySelector('input')
const antall = document.querySelector('#antall-treff')
const samling = document.querySelector('#collection-select')
const oppdatert = document.querySelector('#sist-oppdatert')

const resultTable = (data) => {
    
    localStorage.clear() 
    localStorage.setItem('string', data)    // Save searchresult to local storage
    data = JSON.parse(data)
    
    const antallTreff = data.results.length
    antall.textContent = antallTreff
    
    const resultHeader = document.getElementById("resultHeader")
    resultHeader.innerHTML = "Resultat"
    const nbHits = document.getElementById("nbHits")
    nbHits.innerHTML = "Antall treff: "


    const table = document.getElementById("myTable")
    table.innerHTML = "";
    for (i = -1; i < antallTreff; i++) {
        const row = table.insertRow(-1)

        const cell1 = row.insertCell(0)
        const cell2 = row.insertCell(1)
        const cell3 = row.insertCell(2)
        const cell4 = row.insertCell(3)
        if (i === -1) {
            // header row
            cell1.innerHTML = 'MUSIT nummer'.bold()
            cell2.innerHTML = 'Takson'.bold()
            cell3.innerHTML = 'Land'.bold()
            cell4.innerHTML = 'Innsamler'.bold()
        } else {
            cell1.innerHTML =  `<a id="objekt-link" href="http://localhost:3000/object/?id=${i}"> ${data.results[i].catalogNumber} </a>`
            cell2.innerHTML = data.results[i].scientificName
            cell3.innerHTML = data.results[i].country
            cell4.innerHTML = data.results[i].recordedBy
        }
    }    
}


let map
let coordinateArray = []

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = search.value
    const valgtSamling = samling.value
    // empty table
    document.getElementById("myTable").innerHTML = ""
    resultHeader.innerHTML = ""
    antall.textContent = ""
    document.getElementById("nbHits").innerHTML = ""
    // Show please wait
    document.getElementById("pleaseWait").style.display = "block"
    
    if (!valgtSamling) {
        resultHeader.innerHTML = "Du må velge samling før du kan søke"
        document.getElementById("pleaseWait").style.display = "none"
    } else {
        const url = 'http://localhost:3000/search/?search=' + searchTerm +'&samling=' + valgtSamling
        fetch(url).then((response) => {
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {
                                        
                    // remove old map if any and empty array
                    document.getElementById("map").innerHTML = ""
                    
                    const JSONdata = JSON.parse(data)
                    
                    //check if there are any hits from the search
                    if ( JSONdata.results === undefined || JSONdata.results.length === 0 ) {
                        resultHeader.innerHTML = "Ingen treff, prøv nytt søk"
                    } else {
                        resultTable(data)
                        
                        // fyll en array med koordinater for kartet
                        coordinateArray.length = 0
                        JSONdata.results.forEach(function(item, index) {
                            const object = { decimalLatitude: Number(item.decimalLatitude),
                                         decimalLongitude: Number(item.decimalLongitude),
                                         catalogNumber: item.catalogNumber,
                                         index: index }
                            coordinateArray.push(object) 
                        })

                        // call map-function to draw map
                        mapWithAllHits(coordinateArray)  
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
  

// initializeMap and  red dots for each item in searchlist on map, on one function:
 const mapWithAllHits = function(array) {
    const newArray = []
    let latitudeSum
    let longitudeSum
    array.forEach(function(item) {
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

    // calculate center and find extreme points

    // tror ikke denne har noen funksjon, noe her virker uansett ikke
    const center = {
        longitude: longitudeSum / array.length,
        latitude: latitudeSum / array.length,
        maxLongitude: Math.max(...array)
    }
    
                    
    // icon
    var iconStyle = new ol.style.Style({
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
    
    // dummy-array to get map-view larger than to exact cover the points/markers
   /*  const dummyNewArray =  */

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
        ]/* ,        
        view: new ol.View({
            center: center
        }) */
    })
    
    const extent = vectorSource.getExtent()

    // // to make extent of map larger than exactly where  the points are
    map.getView().fit(extent, {padding: [50, 50, 50, 50]})
    
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
    // code copied from different examples, doing things differently. I think one could use either jquery (as in $(element))
    // OR innerhtml...
    
    map.on('singleclick', function(evt) {
        
        const feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature) {
                return feature
            })
        if (feature) {
            const coordinates = feature.getGeometry().getCoordinates()
            popup.setPosition(coordinates);
           /*  $(element).popover({
                placement: 'top',
                html:  true,
                content:  feature.get('catalogNumber')
            }) */
           /*  content.innerHTML = feature.get('catalogNumber') */
            content.innerHTML =  `<a id="objekt-link" href="http://localhost:3000/object/?id=${feature.get('index')}"> ${feature.get('catalogNumber')} </a>`
            $(element).popover('show')
        } else {
            $(element).popover('destroy')
        }
    })
   
} 


