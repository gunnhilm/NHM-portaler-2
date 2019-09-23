// import { Map, View, Feature } from 'ol'
// import TileLayer from 'ol/layer/Tile'
// import OSM from 'ol/source/OSM'
// import { fromLonLat, transform  } from 'ol/proj'
// import VectorSource from 'ol/source/Vector'
// import Vector from 'ol/layer/Vector'
// import Point from 'ol/geom/Point'
// import Style from  'ol/style/Style'
// import Icon from 'ol/style/Icon'

//map

// fix: if ingen kooridnater, no map

const coordinatesView = [Number(objekt.decimalLongitude), Number(objekt.decimalLatitude)]

let map

function initialize_map() {
    map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
        // try add url
      })
    ],
    view: new View({
      center: fromLonLat(coordinatesView),
      zoom: 9
    })
  })
}

initialize_map()


// rød prikk på kart:

// feature object
const marker = new Feature({
    geometry: new Point(fromLonLat([Number(objekt.decimalLongitude), Number(objekt.decimalLatitude)]))
    })


// icon...
var iconStyle = new Style({
    image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
    })
})

marker.setStyle(iconStyle)

// source object for this feature
const vectorSource = new VectorSource({
    features: [marker]
})

// add this object to a new layer
const vectorLayer = new Vector({
    source: vectorSource
})

// add this new layer over the map
map.addLayer(vectorLayer)