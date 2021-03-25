// Description of file: Renders text on object.hbs

// decides which language is rendered
if (sessionStorage.language) {
    language = sessionStorage.getItem('language')
} else {
    language = document.querySelector('#language').value
    sessionStorage.setItem('language', language)
}

// reads last search-result from sessionStorage and puts it in an array
// out: an array with JSON-objects that represents museumobjects in the last search result. Empty array if there is no search result in sessionStorage
// is called in this file (object.js)
const loadStringObject = () => {
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
document.getElementById("previous-photo").style.display = "none"
document.getElementById("nb-photos").style.display = "none"

//get the object from session storage
const allObject = loadStringObject()

// get the id from the url
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')

const object = allObject.find(x => x.catalogNumber === id)

// facilitates correctly formatted locality information for a museum object
// in: obj (a JSON-object that rerpresens the museum object that is to be shown)
// out: string representing the collection-country followed by comma, or empty string
const country = (obj) => {
    if (obj.country === '') {
        return ''
    } else {
        return `${obj.country}, `
    }
}

// facilitates correctly formatted locality information for a museum object
// in: obj (a JSON-object that represents the museum object that is to be shown)
//out: string representing the collection-county followed by comma, or empty string
const stateProvince = (obj) => {
    if (obj.stateProvince === '') {
        return ''
    } else {
        return `${obj.stateProvince}, `
    }
}

// facilitates correctly formatted locality information for a museum object
// in: obj (a JSON-object that represents the museum object that is to be shown)
// out: string representing the collection-municipality followed by comma, or empty string
const county = (obj) => {
    if (obj.county === '') {
        return ''
    } else {
        return `${obj.county}, `
    }
}
    
// facilitates correctly formatted locality information for a museum object
// in: obj (a JSON-object that represents the museum object that is to be shown)
// out: string representing the collection-locality followed by comma, or empty string
const locality = (obj) => {
    if (obj.locality === '') {
        return ''
    } else {
        return `${obj.locality}`
    }
}

const concatLocality = country(object) + stateProvince(object) + county(object) + locality(object)

// formats coordinates to nice readable format
// in: obj (JSON-object that represents the museum object that is to be shown)
// out: string with the object’s coordinates
const coordinates = (obj) => {
    if (obj.decimalLongitude === '' | obj.decimalLatitude === '') {
        return textItems.coordPlaceholder[index]
        
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


let prefix = object.institutionCode + '-' + object.collectionCode + '-'
const regnoEl = `<span>${prefix}${object.catalogNumber}</span>` 


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

//let headSex = ''
let sex = ''
if (object.sex) { sex =  `<span>${object.sex}</span>`}
let lifeStage = ''
if (object.lifeStage) { lifeStage =  `<span>${object.lifeStage}</span>`}
let samplingProtocol = ''
if (object.samplingProtocol) { samplingProtocol =  `<span>${object.samplingProtocol}</span>`}
//let headTypeStatus = ''
let typeStatus = ''
if (object.typeStatus) { typeStatus =  `<span>${object.typeStatus}</span>`}

let taxonomy = ''
if (object.kingdom || object.class || object.order || object.family) {
    taxonomy = `<span>${object.kingdom} ${object.class} ${object.order} ${object.family}</span>`
}

console.log(sessionStorage.getItem('collection'))
// put content in html-boxes
renderText(language)

if (!sessionStorage.getItem('collection').includes('dna') & !sessionStorage.getItem('collection').includes('birds') & !sessionStorage.getItem('collection').includes('mammals')) {
    document.querySelector("#musit-regno").innerHTML = regnoEl
} else {
    document.querySelector("#musit-regno").innerHTML = `<span>${object.catalogNumber}</span>`
}

document.querySelector("#species-name").innerHTML = `<span class="italic">${object.scientificName}</span>`
document.querySelector("#det").innerHTML =  `<span>${object.identifiedBy}</span>`
document.querySelector("#det-date").innerHTML = `<span>${object.dateIdentified}</span>`

document.querySelector("#coll-date").innerHTML = `<span>${object.eventDate}</span>`
document.querySelector("#coll").innerHTML = `<span>${object.recordedBy}</span>`
document.querySelector("#locality").innerHTML = `<span>${concatLocality}</span>`
document.querySelector("#coordinates").innerHTML = `<span>${coordinates(object)}</span>`
document.querySelector("#habitat").innerHTML = habitat
document.querySelector("#artsobsID").innerHTML = artsobsID

document.querySelector('#sex').innerHTML = sex
document.querySelector('#lifeStage').innerHTML = lifeStage
document.querySelector('#samplingProtocol').innerHTML = samplingProtocol
document.querySelector('#taxonomy').innerHTML = taxonomy
document.querySelector('#typeStatus').innerHTML = typeStatus

//document.querySelector("#bold-link").innerHTML = `<span>${APIurlSpecimenEl}</span>`
//document.querySelector("#head-coremaAccno").innerHTML = `<span>Corema Accno</span>`
//document.querySelector("#coremaAccno").innerHTML = `<span>${coremaAccno}</span>`

// items

//adds row to table that lists object’s data on the fly – number of rows necessary varies between objects
// will be called in the future when stitched data is in place
function addRow() {
        row = document.getElementById("object-table").insertRow(-1)
        cell1 = row.insertCell(0)
        cell1.style.fontWeight = "bold"
        cell2 = row.insertCell(1)
}

if (!sessionStorage.getItem('collection').includes('dna') & !sessionStorage.getItem('collection').includes('birds') & !sessionStorage.getItem('collection').includes('mammals')) {
    if(object.coremaUUID) {
        document.querySelector("#preservedSp").innerHTML = textItems.preservedSp[index]
        document.querySelector("#corema-link").innerHTML = `<a id="object-link" href="#" onclick="searchInCorema(object.coremaNo);return false;"> ${object.coremaNo} </a>`
        function searchInCorema(coremaNo) {
            console.log(coremaNo)
            // vent til vi har sti med samlinger - kan peke rett på
        }
    }
} 
//else if(!window.location.href.includes('tmu') && !window.location.href.includes('/um')) {

//     document.querySelector("#preservedSp").innerHTML = 'basisOfRecord:'
//     document.querySelector("#corema-link").innerHTML = object.basisOfRecord

//     document.querySelector("#head-preparation").innerHTML = 'preparation:'
//     document.querySelector("#preparation").innerHTML = object.preparations

//     document.querySelector("#head-disposition").innerHTML = 'disposition:'
//     document.querySelector("#disposition").innerHTML = object.disposition

// }

//     // put items in itemArray as objects
//     tempItemArray = object.itemNumbers.split(",")
//     itemArray = []
//     tempItemArray.forEach (element => itemArray.push({itemNumber: element}))
    
//     // add properties to the item-objects
//     itemTypeArray = object.items.split(",")
//     dateArray = object.itemDates.split(",")
//     methodArray = object.itemMethods.split(",")
//     preparedByArray = object.itemPreparedBys.split(",")
//     processIDArray = object.itemProcessIDs.split(",")
//     genbankArray = object.itemGenAccNos.split(",")
//     DNAConcArray = object.itemConcentrations.split(",")
//     DNAConcUnitArray = object.itemUnits.split(",")
//     preservationArray = object.itemPreservations.split(",")

//     for (i=0; i<itemArray.length; i++) {
//         itemArray[i].properties = itemTypeArray[i]
//         itemArray[i].date = dateArray[i]
//         itemArray[i].method =methodArray[i]
//         itemArray[i].preparedBy = preparedByArray[i]
//         itemArray[i].processID = processIDArray[i]
//         itemArray[i].genAccNo = genbankArray[i]
//         itemArray[i].DNAConc =DNAConcArray[i]
//         itemArray[i].DNAConcUnit = DNAConcUnitArray[i] 
//         itemArray[i].preservation = preservationArray[i]
//     }
    
    
//     // add row in table with heading for items
//     // addRow()
//     // cell1.innerHTML = '<br>'
//     // addRow()
//     // cell1.id = 'itemsHeader'
//     // cell1.innerHTML = `<span class = 'obj-header' style = 'font-weight: normal'>${textItems.itemsHeader[index]}:</span>`
//     // addRow()
//     //cell1.innerHTML = '<br>'
    
//     // loop over array
//     itemArray.forEach( item => {
//         addRow()
//         cell1.innerHTML = item.properties
//         cell1.style.textDecoration  = 'underline'
//         cell1.style.fontWeight = 'normal'
//         cell1.style.fontSize = '18px'
//         addRow()
//         cell1.innerHTML = textItems.itemNumber[index]
//         cell2.innerHTML = item.itemNumber
//         addRow()
//         if (item.properties.includes("gDNA")) {
//             cell1.innerHTML = textItems.extractionDate[index]
//         } else if (item.properties === 'Voucher') {
//             cell1.innerHTML = ''
//         } else {
//             cell1.innerHTML = textItems.samplingDate[index]
//         }
//         cell2.innerHTML = item.date
//         addRow()
//         cell1.innerHTML = textItems.preservation[index]
//         if (item.properties === 'Voucher') {
//             cell2.innerHTML = object.preparations
//         } else {
//             cell2.innerHTML = item.preservation
//         }
        
        
//         if (item.properties.includes("gDNA")) {
//             addRow()
//             cell1.innerHTML = textItems.method[index]
//             cell2.innerHTML = item.method
//             addRow()
//             cell1.innerHTML = textItems.preparedBy[index]
//             cell2.innerHTML = item.preparedBy

//             addRow()
//             cell1.innerHTML = textItems.concentration[index]
//             cell2.innerHTML = item.DNAConc + ' ' + item.DNAConcUnit
//             addRow()    
//             cell1.innerHTML = 'BOLD ProcessID:'
//             if (item.processID != "#N/A") {
//                 const url = `http://www.boldsystems.org/index.php/Public_RecordView?processid=${item.processID}`
//                 cell2.innerHTML = `<a href="${url}" target="_blank">${item.processID}</a>`
//             } else { cell2.innerHTML = "#N/A"}
//             addRow()
//             cell1.innerHTML = 'Genbank Acc.No:'
//             cell2.innerHTML = item.genAccNo
//         }
//         addRow()
//         cell1.innerHTML = '<br>'
//     })
// }

// photo:
// shows next image when nextImage-button is clicked, if there are more images for object
// in: index (number, points to image)
// in: direction (string, ‘f’ or ‘r’ for ‘forward’ and ‘reverse’; dependent on which button is clicked; next or previous image)
// in: smallImageList (array with strings; names of small images)
// in: imageList (array with strings; names of large images)
// is called in next-photo-button.onclick and previous.photo.onclick
function changeImage(index, direction, smallImageList, imageList) {
    //index = index + direction;
    if (direction == 'f') {
        if (index === smallImageList.length-1) {
        index = 0;
        } else {
            index = index +1
        }
    } else if (direction == 'r') {
        if (index == 0) {
            index = smallImageList.length-1
        } else {
            index = index -1
        }
    }
    document.getElementById("photo-anchor").href = imageList[index]
    document.getElementById("photo-box").src = smallImageList[index]
    return index
}

// returns small version of photo
// in: photo (string, name of large photo)
// out: photo (string, name of small photo)
// is called by this file (object.js)
function reducePhoto(photo) {
    return photo.replace('jpeg', 'small')
}
        

//to get a thumbnail width is set to 150px in styles for img
// and to to enable large photo by clicking, img is wrapped in a <a>

// if more than one photo

const coll = sessionStorage.getItem('collection')
let mediaLink
let imageList
if ( coll === 'birds' || coll === 'mammals' || coll === 'dna_fish_herptiles' || coll === 'dna_other') {
    mediaLink = object.photoIdentifiers
} else {
    mediaLink = object.associatedMedia
}
if (mediaLink) {
    if ( mediaLink.includes('|') | mediaLink.includes(',')) {  // if several photos
        document.getElementById("next-photo").style.display = "block"
        document.getElementById("previous-photo").style.display = "block"
        document.getElementById("nb-photos").style.display = "block"
        let index = 0
        if (mediaLink.includes('|')) {
            imageList = mediaLink.split('|')
        } else {
            imageList = mediaLink.split(',') // birds and mammals (corema-collections)
        }
        let smallImageList = imageList.map(reducePhoto)
        let length = imageList[0].length
        if (smallImageList[0].charAt(0) === '"') {smallImageList[0] = smallImageList[0].substring(1,length--)}
        document.getElementById("photo-anchor").href = imageList[0]
        document.getElementById("photo-box").src = smallImageList[0]
        
        document.getElementById("next-photo").onclick = () => {
            index = changeImage(index, 'f', smallImageList, imageList)
            document.getElementById("nb-photos").innerHTML = (index+1)  + '/' + imageList.length 
            
        }
        
        document.getElementById("previous-photo").onclick = () => {
            index = changeImage(index, 'r', smallImageList, imageList)
            document.getElementById("nb-photos").innerHTML = (index+1)  + '/' + imageList.length 
            console.log(index)
        }
        document.getElementById("nb-photos").innerHTML = index+1  + '/' + imageList.length 
    } else {
        document.getElementById("photo-anchor").href = mediaLink
        let smallImage = mediaLink
        smallImage = smallImage.replace('jpeg', 'small')
        document.getElementById("photo-box").src = smallImage
        
        console.log(imageExists(smallImage))
        
    }
    
}

// http-request to check if an image exists
// in: image_url (string; name of photo)
// is called only by a console.log in this file (?)
function imageExists(image_url){
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http //!= 404;
}
//map
drawMapObject(object)


// large map 
document.getElementById('large-map-object-button').onclick = () => {
    console.log(urlPath)
    window.open(href=`${urlPath}/mapObject/?id=${id}`)
}


// document.getElementById('nextObject').onclick = () => {
//     console.log('neste objekt')
// }   

// console.log(allObject)
// const objIndex = allObject.findIndex(el =>  el.catalogNumber = id)
// console.log(objIndex)
// const nextObjCatNumber = allObject[objIndex + 1].catalogNumber
// console.log(nextObjCatNumber)
// document.getElementById('nextObjectCell').innerHTML = `<a id="next-object-link" href="${urlPath}/object/?id=${nextObjCatNumber}">Neste objekt ${nextObjCatNumber} </a>`

