// decides which language is rendered
if (sessionStorage.language) {
    language = sessionStorage.getItem('language')
} else {
    language = document.querySelector('#language').value
    sessionStorage.setItem('language', language)
}

// read string and get the object from sessionStorage
const loadString = () => {
    let objectJSON = ''
    //if( sessionStorage.getItem('databaseSearch') === 'musit' ) {
        objectJSON = sessionStorage.getItem('string')
    //} else if (sessionStorage.getItem('databaseSearch') === 'corema') {
    //    objectJSON = sessionStorage.getItem('coremaString')
    //}
    try {
        return objectJSON ? JSON.parse(objectJSON) : []
    } catch (e) {
        return []
    }
}

//hide next-photo-button, only in use when more than one photo
document.getElementById("next-photo").style.display = "none"

//get the object from session storage
const allObject = loadString()

// get the id from the url
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')

const object = allObject.find(x => x.catalogNumber === id)

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
        if (document.querySelector('#language').value === "Norwegian") {
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
let justCatalogNumber = object.catalogNumber

const indexOfNumber = justCatalogNumber.search(/\d/) // sjekk hvis nummeret også inneholder instutisjonskoder og fjerne disse
if (indexOfNumber > 0) {
    justCatalogNumber = justCatalogNumber.slice(indexOfNumber)
}
const regno = `${object.institutionCode}-${object.collectionCode}-${justCatalogNumber}`
const regnoEl = `<span>${regno}` 

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

//document.querySelector("#bold-link").innerHTML = `<span>${APIurlSpecimenEl}</span>`
//document.querySelector("#head-coremaAccno").innerHTML = `<span>Corema Accno</span>`
//document.querySelector("#coremaAccno").innerHTML = `<span>${coremaAccno}</span>`


// photo:
// hvis noe klikker på neste bilde
function changeImage(index, smallImageList, imageList) {
    index = index + 1;
    if (index === smallImageList.length) {
        index = 0;
    }
    document.getElementById("photo-anchor").href = imageList[index]
    document.getElementById("photo-box").src = smallImageList[index]
    return index
}
// lager smallImageList
function reducePhoto(photo) {
    return photo.replace('jpeg', 'small')
}
        

//to get a thumbnail width is set to 150px in styles for img
// and to to enable large photo by clicking, img is wrapped in a <a>

// if more than one photo
if ( object.associatedMedia.includes('|') ) {
    document.getElementById("next-photo").style.display = "block"
    let index = 0
    let imageList = object.associatedMedia.split('|')
    let smallImageList = imageList.map(reducePhoto)
    document.getElementById("photo-anchor").href = imageList[0]
    document.getElementById("photo-box").src = smallImageList[0]
    document.getElementById("next-photo").onclick = () => {
       index = changeImage(index, smallImageList, imageList)
    }
} else {
    document.getElementById("photo-anchor").href = object.associatedMedia
    let smallImage = object.associatedMedia
    smallImage = smallImage.replace('jpeg', 'small')
    document.getElementById("photo-box").src = smallImage
}

//map
drawMapObject(object)

// large map button
document.getElementById('large-map-object-button').onclick = () => {
    window.open(href=`${urlPath}/mapObject/?id=${id}`)
}
