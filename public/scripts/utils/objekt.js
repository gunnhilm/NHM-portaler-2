
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

// putt i tabell i stedet
//const preName = `<span class="bold" id="name"></span>`
//const name1 = `<span class="italic">${objekt.scientificName}</span>`

//const detLine = '<span class="bold" id="det"></span>'
//const det1 = `<span>${objekt.identifiedBy}</span>`

// text-elements for view
const regnoEl = `<span>${objekt.institutionCode}-${objekt.collectionCode}-${objekt.catalogNumber}` 
//const nameEl = `<span class="bold" id="name"></span>` + `<span class="italic">${objekt.scientificName}</span>`
// to get name properly formatted with itallic, and not-itallic for authors, should use a checklist with  names
//const detEl = '<span class="bold" id="det"></span>' + `<span>${objekt.identifiedBy}</span>`
//const detDateEl = '<span class="bold" id="detDate"></span>' + `<span>${objekt.dateIdentified}`
//const dateEl = '<span class="bold" id="collDate"></span>' + `<span>${objekt.eventDate}</span>`
//const collectorEl = '<span class="bold" id="coll"></span>' + `<span>${objekt.recordedBy}</span>`
//const localityEl = '<span class="bold" id="locality"></span>' + `<span>${concatLocality}</span>`
//const coordinateEl = '<span class="bold" id="coordinates"></span>' + `<span>${coordinates(objekt)}</span>`

// new things added 23.oct
let artsobsName = ''
let artsobs1 = ''
if( objekt.ArtObsID ) {
    artsobsName = '<span class="bold" id="artsobs"></span>' 
    artsobs1 = `<span>${objekt.ArtObsID}</span>`
} 

let habitatName = ''
let habitat1 = ''
if (objekt.habitat ) {
    habitatName = '<span class="bold" id="habitat">Habitat: </span>' 
    habitat1 = `<span>${objekt.habitat}</span>`
}

// put content in html-boxes
document.querySelector("#musit_regno").innerHTML = regnoEl
document.querySelector("#preName").innerHTML = `<span class="bold" id="name"></span>`
document.querySelector("#name1").innerHTML = `<span class="italic">${objekt.scientificName}</span>`
document.querySelector("#detLine").innerHTML = '<span class="bold" id="det"></span>'
document.querySelector("#det1").innerHTML =  `<span>${objekt.identifiedBy}</span>`
document.querySelector("#detDateLine").innerHTML = '<span class="bold" id="detDate"></span>'
document.querySelector("#detDate").innerHTML = `<span>${objekt.dateIdentified}</span>`

document.querySelector("#dateName").innerHTML = '<span class="bold" id="collDate"></span>'
document.querySelector("#date1").innerHTML = `<span>${objekt.eventDate}</span>`
document.querySelector("#collectorName").innerHTML = '<span class="bold" id="coll"></span>'
document.querySelector("#collector1").innerHTML = `<span>${objekt.recordedBy}</span>`
document.querySelector("#localityName").innerHTML = '<span class="bold" id="locality"></span>'
document.querySelector("#locality1").innerHTML = `<span>${concatLocality}</span>`
document.querySelector("#coordinatesName").innerHTML = '<span class="bold" id="coordinates"></span>'
document.querySelector("#coordinates1").innerHTML = `<span>${coordinates(objekt)}</span>`
document.querySelector("#habitatName").innerHTML = habitatName
document.querySelector("#habitat1").innerHTML = habitat1
document.querySelector("#artsobsName").innerHTML = artsobsName
document.querySelector("#artsobs1").innerHTML = artsobs1
//document.querySelector("#species_box").innerHTML = nameEl  + '<br/>' + detEl + '<br/>' + detDateEl + '<br/>'

//document.querySelector('#collectionEvent_box').innerHTML = dateEl + '<br/>' + collectorEl  + '<br/>' + localityEl + '<br/>' + coordinateEl + '<br/> <br/>' + ArtObsIdEl + '<br/>' + habitatEl

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
}
