// decides which language is rendered
if (sessionStorage.language) {
    language = sessionStorage.getItem('language')
} else {
    language = document.querySelector('#language').value
    sessionStorage.setItem('language', language)
}

// read string and get the object from sessionStorage
const loadString = () => {
    const objectJSON = sessionStorage.getItem('string')

    try {
        return objectJSON ? JSON.parse(objectJSON) : []
    } catch (e) {
        return []
    }
}



//get the object from session storage
const allObject = loadString()
// get the id from the url
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')

const object = allObject[id]

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

const concatLocality = country(object) + stateProvince(object) + county(object) + locality(object)

// to print nice coordinates:
const coordinates = (obj) => {
    if (obj.decimalLongitude === '' | obj.decimalLatitude === '') {
        if (document.querySelector('#language').value = "Norwegian") {
            return 'Ingen koordinater'
           
        } else {
            return 'No coordinates'
        }
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

// to print nice musit regno
const regnoEl = `<span>${object.institutionCode}-${object.collectionCode}-${object.catalogNumber}` 

// data only displayed if existing
let headArtsobs = ''
let artsobsID = ''
if( object.ArtObsID ) {
    artsobsID = `<span>${object.ArtObsID}</span>`
} 

let headHabitat = ''
let habitat = ''
if (object.habitat ) {
    habitat = `<span>${object.habitat}</span>`
}

// put content in html-boxes
renderText(language)
document.querySelector("#musit-regno").innerHTML = regnoEl
document.querySelector("#species-name").innerHTML = `<span class="italic">${object.scientificName}</span>`
document.querySelector("#det").innerHTML =  `<span>${object.identifiedBy}</span>`
document.querySelector("#det-date").innerHTML = `<span>${object.dateIdentified}</span>`

document.querySelector("#coll-date").innerHTML = `<span>${object.eventDate}</span>`
document.querySelector("#coll").innerHTML = `<span>${object.recordedBy}</span>`
document.querySelector("#locality").innerHTML = `<span>${concatLocality}</span>`
document.querySelector("#coordinates").innerHTML = `<span>${coordinates(object)}</span>`
document.querySelector("#habitat").innerHTML = habitat
document.querySelector("#artsobsID").innerHTML = artsobsID


// photo:
//to get a thumbnail width is set to 150px in styles for img
// and to to enable large photo by clicking, img is wrapped in a <a>
document.getElementById("photo-anchor").href = object.associatedMedia
 // change the image type to small from jpeg
let smallImage = object.associatedMedia
smallImage = smallImage.replace('jpeg', 'small')
document.getElementById("photo-box").src = smallImage

//map

const coordinatesView = [Number(object.decimalLongitude), Number(object.decimalLatitude)]

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


if(object.decimalLatitude & object.decimalLongitude) {
    
    initialize_map()
    
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
        source: vectorSource
    })

    // add this new layer over the map
    map.addLayer(vectorLayer)
} else {
    if (document.querySelector('#language').value = "Norwegian") {
        document.querySelector("#map").innerHTML = "Kart ikke tilgjengelig"
       
    } else {
        document.querySelector("#map").innerHTML = "Map not available"
    }
}

