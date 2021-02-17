let coordinateArray = []
let map
const popup_element = document.getElementById('popup')
const popup_content = document.getElementById('popup-content')
const popup_closer = document.getElementById('popup-closer')

const zoomModal = document.getElementById("zoom-modal")
const zoomModalContent = document.getElementById('zoom-expl-popup')
const largeMapButton = document.getElementById("large-map-button")
const zoomButton = document.getElementById("zoom-button")
const downloadMapButton = document.getElementById("export-png")
const checkedInMap = document.getElementById("checkedInMap")
const span = document.getElementsByClassName("close")[0];

// render map
const drawMap = (parsedData) => {
    // remove old map if any and empty array
    document.getElementById("map-search").innerHTML = "" 
    coordinateArray.length = 0

    try {
        // fill an array with coordinates for the map
        parsedData.forEach(function(item, index) {
            
            if (Number(item.decimalLatitude) < 90 & Number(item.decimalLatitude) > -90 & Number(item.decimalLongitude) < 180 & Number(item.decimalLongitude) > -180) {
                const object = { decimalLatitude: Number(item.decimalLatitude),
                    decimalLongitude: Number(item.decimalLongitude),
                    catalogNumber: item.catalogNumber,
                    index: index }
                coordinateArray.push(object) 
            } 
        })
        
        if (coordinateArray.length === 0) {
            document.querySelector("#map-search").innerHTML = textItems.mapSearchAlt[index]
            console.log('her')
        } else {
            const newArray = []
            coordinateArray.forEach(function(item) {
                if(item.decimalLongitude) {
                    const marker = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([Number(item.decimalLongitude), Number(item.decimalLatitude)])),
                        catalogNumber: item.catalogNumber,
                        index: item.index
                    })
                    newArray.push(marker)
                }
            })
            
            if(!coordinateArray.every(x => x.decimalLatitude === 0)) {
                
                // icon
                const iconStyle = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 7,
                        stroke: new ol.style.Stroke({
                            color: '#000000'   //white
                        }),
                        fill: new ol.style.Fill({
                            color: '#FF0000'    //red
                        })
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
                    source: vectorSource,
                    wrapDateLine: false,
                    sphericalMercator: true,
                    minZoomLevel: 1, 
                    maxZoomLevel: 8
                })
                
                
                const clusterSource = new ol.source.Cluster({
                    source: vectorSource
                })
                
                //indicate several dots on top of each other on exact same location
                let styleCache = {}
                
                const clusterLayer = new ol.layer.Vector({
                    source: clusterSource,
                    style: function(feature) {
                        let size = feature.get('features').length
                        let textInCircle
                        let sameCoordinates = true
                        if (size > 1) {
                            for (i=0; i< size -1; i++) {
                                if (sameCoordinates = true) {
                                    if (feature.get('features')[i].values_.geometry.flatCoordinates == feature.get('features')[i+1].values_.geometry.flatCoordinates) {
                                        sameCoordinates = true
                                    } else {
                                        sameCoordinates = false
                                    } 
                                }
                            }
                            if (sameCoordinates = true) {
                                textInCircle = size.toString()
                            } else { textInCircle = ''}
                        } else { textInCircle = ''}
                
                        let style = styleCache[size]
                        if (!style) {
                            style = [new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 7,
                                    stroke: new ol.style.Stroke({
                                        color: '#000000'   //white
                                    }),
                                    fill: new ol.style.Fill({
                                        color: '#FF0000'    //red
                                    })
                                }),
                                text: new ol.style.Text({
                                    text: textInCircle,
                                    fill: new ol.style.Fill({
                                        color: '#fff'   //white
                                    })
                                })
                            })]
                            styleCache[size] = style
                        }
                        return style
                      
                    }
                })


                map = new ol.Map({
                    target: 'map-search',
                    layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    }),
                    vectorLayer,
                    clusterLayer
                    ],
                    controls: ol.control.defaults({
                        attributionOptions:
                        ({
                            collapsible: false
                        })
                    }),
                })    
                
                const extent = vectorSource.getExtent()
                
                // // to make extent of map larger than exactly where  the points are
                map.getView().fit(extent, {padding: [30, 30, 30, 30], minResolution: 30})
                
                // // popups
                
                
                const popup = new ol.Overlay({
                    element: popup_element,
                    positioning: 'bottom-center',
                    autoPan: true,
                    stopEvent: true, // true here enables clickable link in popup
                    offset: [0,0]
                })
            
                map.addOverlay(popup)
                
                //display popup on a click
                map.on('singleclick', function(evt) {
                    popup_content.innerHTML = ''
                    const feature = map.forEachFeatureAtPixel(evt.pixel,
                    function(feature) {
                        return feature
                    })
                    if (feature) {
                        const coordinates = feature.getGeometry().getCoordinates()
                        let cfeatures = feature.get('features')
                        
                        try {
                            let museumURLPath
                            if (window.location.href.includes('/um')) { 
                                museumURLPath = urlPath + "/um"
                            } else if (window.location.href.includes('tmu')) {
                                museumURLPath = urlPath + "/tmu"
                            } else {
                                museumURLPath = urlPath + "/nhm"
                            }

                            
                            if (cfeatures.length > 1) {
                                
                                if( cfeatures.length > 10 ) {
                                    popup_element.setAttribute("style","width:300px") // size is set 
                                }
                                for (i=0; i < cfeatures.length; i++) {
                                    popup_content.innerHTML += `<a id="object-link"  href="${museumURLPath}/object/?id=${cfeatures[i].get('catalogNumber')}"> ${cfeatures[i].get('catalogNumber')}</a>`
                                    if (i < cfeatures.length-1) {
                                        popup_content.innerHTML += ', '
                                    }
                                }
                            }
                            if (cfeatures.length == 1) {
                                popup_content.innerHTML =  `<a id="object-link" style="white-space: nowrap" href="${museumURLPath}/object/?id=${cfeatures[0].get('catalogNumber')}"> ${cfeatures[0].get('catalogNumber')} </a>`
                            }
                            popup.setPosition(coordinates)
                        } catch (error) {
                            zoomModal.style.display = "block"
                            zoomModalContent.innerHTML = textItems.zoomToClickText[index]
                        }
                    } 
                    
                })  
                
                
                popup_closer.onclick = function() {
                    popup.setPosition(undefined);
                    popup_closer.blur();
                    popup_element.setAttribute("style","width:auto"),
                    map.getView().fit(extent, {padding: [30, 30, 30, 30], minResolution: 30})
                    return false;
                }
            } else {
                document.querySelector("#map-search").innerHTML = textItems.mapSearchAlt[index]
            }
        }  
    
                 
        // // Show the button that opens the modal
        if(zoomButton && map) {
            zoomButton.style.display = "block"
            largeMapButton.style.display = "block"
            downloadMapButton.style.display = "block"
            checkedInMap.style.display = "block"
            
            // When the user clicks on the button, open the modal
            zoomButton.onclick = function() {
                zoomModal.style.display = "block"
                zoomModalContent.innerHTML = textItems.mapHelpContent[index]
            }
        }
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0]

        
    } catch (error) {
        console.error(error)
        errorMessage.innerHTML = textItems.mapError[index]
        //reject(error);
    }

    //document.getElementById("large-map-button").style.display = "block"

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        zoomModal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == zoomModal) {
            zoomModal.style.display = "none";
        } 
    }
}




////// map object page

const drawMapObject = (object) => {
    const coordinatesView = [Number(object.decimalLongitude), Number(object.decimalLatitude)]

    function initialize_map() {
        map = new ol.Map({
            target: 'map-object',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat(coordinatesView),
                zoom: 9
            })
        })
    }

    if (object.decimalLatitude & object.decimalLongitude) {

        initialize_map()
        
        if (!location.href.includes('mapObject') && map) {
            console.log('her da')
            document.getElementById('zoom-button').style.display = "inline-block"
            document.getElementById('large-map-object-button').style.display = "inline-block"
            // document.getElementById('export-png').style.display = "inline-block"
        }
        
        // red dot on map:

        // feature object
        const marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([Number(object.decimalLongitude), Number(object.decimalLatitude)]))
        })



        // icon...
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
            })
        })

        marker.setStyle(iconStyle)


        // source object for this feature
        const vectorSource = new ol.source.Vector({
            features: [marker]
        })

        // add this object to a new layer
        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
        })

        // add this new layer over the map
        map.addLayer(vectorLayer)
    } else {
        if (document.querySelector('#language').value === "Norwegian") {
            document.querySelector("#map-object").innerHTML = "Kart ikke tilgjengelig"
        } else {
            document.querySelector("#map-object").innerHTML = "Map not available"
        }
        document.getElementById('large-map-object-button').style.display = "none"
        document.getElementById('zoom-button').style.display = "none"
        //document.getElementById('export-png').style.display = "none"
        //document.getElementById('checkedInMap').style.display = "none"

    }


    // modal (pop-up) with explanation for zoom in map
    // Get the modal
//    var zoomModal = document.getElementById("zoom-modal");

    // Get the button that opens the modal
  //  var zoomButton = document.getElementById("zoom-button");

    // Get the <span> element that closes the modal
    
    // When the user clicks on the button, open the modal
    if (zoomButton) {
        zoomButton.onclick = function () {
            zoomModal.style.display = "block";
            if (location.href.includes('object')) {
                zoomModalContent.innerHTML = textItems.mapHelpContentObjPage[index]
            } else {zoomModalContent.innerHTML = textItems.mapHelpContent[index]}
        }
         // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            zoomModal.style.display = "none";
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == zoomModal) {
                zoomModal.style.display = "none";
            }
        }
    }

    
}


