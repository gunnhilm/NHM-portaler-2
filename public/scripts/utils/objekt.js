// read string and get the object from localStorage
const loadString = () => {
    const objektJSON = localStorage.getItem('string')

    try {
        return objektJSON ? JSON.parse(objektJSON) : []
    } catch (e) {
        return []
    }
}



//få tak i objektet fra local  storage
const allObjekt = loadString()
// få tak i id'en i url'en
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')

const objekt = allObjekt.results[id]

// to print nice locality-string:
const country = (obj) => {
    if (obj.country === '') {
        return ''
    } else {
        return `${obj.country}, `
    }
}

const stateProvince = (obj) => {
    if (obj.stateProvince === '') {
        return ''
    } else {
        return `${obj.stateProvince}, `
    }
}

const county = (obj) => {
    if (obj.county === '') {
        return ''
    } else {
        return `${obj.county}, `
    }
}
    
const locality = (obj) => {
    if (obj.locality === '') {
        return ''
    } else {
        return `${obj.locality}`
    }
}

const concatLocality = country(objekt) + stateProvince(objekt) + county(objekt) + locality(objekt)

// to print nice coordinates:
const coordinates = (obj) => {
    if (obj.decimalLongitude === '' | obj.decimalLatitude === '') {
        return 'Ingen koordinater'
    } else {
        let longLetter
        let latLetter
        if (obj.decimalLongitude < 0) {
            longLetter = 'W'
        } else {
            longLetter = 'E'
        }
        if (obj.decimalLatitude < 0) {
            latLetter = 'S'
        } else {
            latLetter = 'N'
        }
        return `${Math.abs(obj.decimalLatitude)} ${latLetter}, ${Math.abs(obj.decimalLongitude)} ${longLetter}`
    }
}

// text-elements for view
const regnoEl = `<span>${objekt.institutionCode}-${objekt.collectionCode}-${objekt.catalogNumber}` 
const nameEl = '<span class="bold">Vitenskapelig navn: </span>' + `<span>${objekt.scientificName}</span>`
// to get name properly formatted with itallic, and not-itallic for authors, should use a checklist with  names
const detEl = '<span class="bold">Bestemt av: </span>' + `<span>${objekt.identifiedBy}</span>`
const detDateEl = '<span class="bold">Dato for bestemming: </span>' + `<span>${objekt.dateIdentified}`
const dateEl = '<span class="bold">Innsamlingsdato: </span>' + `<span>${objekt.eventDate}</span>`
const collectorEl = '<span class="bold">Innsamlet av: </span>' + `<span>${objekt.recordedBy}</span>`
const localityEl = '<span class="bold">Lokalitet: </span>' + `<span>${concatLocality}</span>`
const coordinateEl = '<span class="bold">Koordinater: </span>' + `<span>${coordinates(objekt)}</span>`

// put content in html-boxes
document.querySelector("#musit_regno").innerHTML = regnoEl
document.querySelector("#species_box").innerHTML = nameEl  + '<br/>' + detEl + '<br/>' + detDateEl + '<br/>'
document.querySelector('#collectionEvent_box').innerHTML = dateEl + '<br/>' + collectorEl  + '<br/>' + localityEl + '<br/>' + coordinateEl

// photo:
//for å få thumbnail settes width til 150px i styles for img
// og for å kunne klikke opp hele bildet, wrappes img i en <a>
document.getElementById("photo_anchor").href = objekt.associatedMedia
 // change the image type to small from jpeg
let smallImage = objekt.associatedMedia
smallImage = smallImage.replace('jpeg', 'small')
document.getElementById("photo_box").src = smallImage

//map

const coordinatesView = [Number(objekt.decimalLongitude), Number(objekt.decimalLatitude)]

let map

function initialize_map() {
    map = new ol.Map({
    target: 'map',
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

initialize_map()

// rød prikk på kart:

// feature object
const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([Number(objekt.decimalLongitude), Number(objekt.decimalLatitude)]))
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
    source: vectorSource
})

// add this new layer over the map
map.addLayer(vectorLayer)