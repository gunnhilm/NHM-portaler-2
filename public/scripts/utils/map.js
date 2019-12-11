let coordinateArray = []
let map
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

