
// read string and get the object from sessionStorage
const loadString = () => {
    const objektJSON = sessionStorage.getItem('string')

    try {
        return objektJSON ? JSON.parse(objektJSON) : []
    } catch (e) {
        return []
    }
}



//få tak i objektet fra session  storage
const allObjekt = loadString()
// få tak i id'en i url'en
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')

const objekt = allObjekt[id]

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
        if (document.querySelector('#language').value = "Norwegain") {
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
const regnoEl = `<span>${objekt.institutionCode}-${objekt.collectionCode}-${objekt.catalogNumber}` 

// data only displayed if existing
let headArtsobs = ''
let artsobsID = ''
if( objekt.ArtObsID ) {
    artsobsID = `<span>${objekt.ArtObsID}</span>`
} 

let headHabitat = ''
let habitat = ''
if (objekt.habitat ) {
    habitat = `<span>${objekt.habitat}</span>`
}

// put content in html-boxes
document.querySelector("#musit-regno").innerHTML = regnoEl
document.querySelector("#species-name").innerHTML = `<span class="italic">${objekt.scientificName}</span>`
document.querySelector("#det").innerHTML =  `<span>${objekt.identifiedBy}</span>`
document.querySelector("#det-date").innerHTML = `<span>${objekt.dateIdentified}</span>`

document.querySelector("#coll-date").innerHTML = `<span>${objekt.eventDate}</span>`
document.querySelector("#coll").innerHTML = `<span>${objekt.recordedBy}</span>`
document.querySelector("#locality").innerHTML = `<span>${concatLocality}</span>`
document.querySelector("#coordinates").innerHTML = `<span>${coordinates(objekt)}</span>`
document.querySelector("#habitat").innerHTML = habitat
document.querySelector("#artsobsID").innerHTML = artsobsID


// photo:
//for å få thumbnail settes width til 150px i styles for img
// og for å kunne klikke opp hele bildet, wrappes img i en <a>
document.getElementById("photo-anchor").href = objekt.associatedMedia
 // change the image type to small from jpeg
let smallImage = objekt.associatedMedia
smallImage = smallImage.replace('jpeg', 'small')
document.getElementById("photo-box").src = smallImage

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

if(objekt.decimalLatitude & objekt.decimalLongitude) {
    
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
} else {
    if (document.querySelector('#language').value = "Norwegain") {
        document.querySelector("#map").innerHTML = "Kart ikke tilgjengelig"
       
    } else {
        document.querySelector("#map").innerHTML = "Map not available"
    }
}
