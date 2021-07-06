// Description of file: Renders text on object.hbs

// decides which language is rendered
if (sessionStorage.language) {
    language = sessionStorage.getItem('language')
} else {
    language = document.querySelector('#language').value
    sessionStorage.setItem('language', language)
}

// figures out which museum we are in
// out: string, abbreviation for museum
// is called by doSearch() and updateFooter()
const getCurrentMuseum = () => {
    const pathArray = window.location.pathname.split('/')
    const museum = pathArray[2]
    return museum
}

const getOrganismGruop = () => {
    const orgGroup = sessionStorage.getItem('organismGroup')
    return orgGroup
}
const orgGroup = getOrganismGruop()


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
    if (obj.decimalLongitude === '' || obj.decimalLatitude === '' || obj.decimalLongitude === '0' || obj.decimalLatitude === '0' ) {
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

const taxonomyString = () => {
    let string = ''
    if (object.kingdom === true) {
        string = object.kingdom
    } 
    if (object.class) {
        string = string + ' ' + object.class
    }
    if (object.order) {
        string = string + ' ' + object.order
    }
    if (object.family) {
        string = string + ' ' + object.family
    }
    string = `<span>${string}</span>`
    string = string.toString()
 return string
}

let taxonomy = ''
if (object.kingdom || object.class || object.order || object.family) {
    taxonomy = taxonomyString()
}

const makeTableHeader = (table) => {
    const speciesName = table.insertRow(0)
    const speciesNameHeader = speciesName.insertCell(0); speciesNameHeader.id = 'head-species-name'; speciesNameHeader.class = 'bold'; speciesNameHeader.style = 'white-space:pre';
    const speciesNameCont = speciesName.insertCell(1); speciesNameCont.id = 'species-name'; speciesNameCont.style = 'border-spacing: 10px 0';
    document.querySelector("#species-name").innerHTML = `<span class="italic">${object.scientificName}</span>`
    document.querySelector("#musit-regno").innerHTML = `<span>${object.catalogNumber}</span>`
}

const makeBioTable = () => {
    const table = document.getElementById("object-table");
    const speciesName = table.insertRow(0)
        const speciesNameHeader = speciesName.insertCell(0); speciesNameHeader.id = 'head-species-name'; speciesNameHeader.style.fontWeight = 'bold'; speciesNameHeader.style = 'white-space:pre';
        const speciesNameCont = speciesName.insertCell(1); speciesNameCont.id = 'species-name'; speciesNameCont.style = 'border-spacing: 10px 0';
    if (orgGroup === 'botanikk' || orgGroup === 'zoologi') {            
        const detRow = table.insertRow(-1)
        const detH =   detRow.insertCell(0); detH.id = 'head-det'; detH.class = 'bold'; detH.style = 'white-space:pre';
        const detC =   detRow.insertCell(1); detC.id = 'det'; detC.style = 'border-spacing: 10px 0';
        const detDate = table.insertRow(-1)
        const detDH =   detDate.insertCell(0); detDH.id = 'head-det-date'; detDH.class = 'bold'; detDH.style = 'white-space:pre';
        const detDC =   detDate.insertCell(1); detDC.id = 'det-date'; detDC.style = 'border-spacing: 10px 0';
        const CollDate = table.insertRow(-1)
        const CollD =   CollDate.insertCell(0); CollD.id = 'head-coll-date'; CollD.class = 'bold'; CollD.style = 'white-space:pre';
        const CollDC =   CollDate.insertCell(1); CollDC.id = 'coll-date'; CollDC.style = 'border-spacing: 10px 0';
        const coll = table.insertRow(-1)
        const collH =   coll.insertCell(0); collH.id = 'head-coll'; collH.class = 'bold';
        const collC =   coll.insertCell(1); collC.id = 'coll'; collC.style = 'border-spacing: 10px 0';
        const loc = table.insertRow(-1)
        const locH =   loc.insertCell(0); locH.id = 'head-locality'; locH.class = 'bold';
        const locC =   loc.insertCell(1); locC.id = 'locality'; locC.style = 'border-spacing: 10px 0';
        const coor = table.insertRow(-1)
        const coorH =   coor.insertCell(0); coorH.id = 'head-coordinates'; coorH.class = 'bold';
        const coorC =   coor.insertCell(1); coorC.id = 'coordinates'; coorC.style = 'border-spacing: 10px 0';
        const arts = table.insertRow(-1)
        const artsH =   arts.insertCell(0); artsH.id = 'head-artsobs'; artsH.class = 'bold'; artsH.style = 'white-space:pre'
        const artsC =   arts.insertCell(1); artsC.id = 'artsobsID'; artsC.style = 'border-spacing: 10px 0';
        const hab = table.insertRow(-1)
        const habH =   hab.insertCell(0); habH.id = 'head-habitat'; habH.class = 'bold';
        const habC =   hab.insertCell(1); habC.id = 'habitat'; habC.style = 'border-spacing: 10px 0';
        const sex = table.insertRow(-1)
        const sexH =   sex.insertCell(0); sexH.id = 'head-sex'; sexH.class = 'bold';
        const sexC =   sex.insertCell(1); sexC.id = 'sex'; sexC.style = 'border-spacing: 10px 0';
        const life = table.insertRow(-1)
        const lifeH =   life.insertCell(0); lifeH.id = 'head-lifeStage'; lifeH.class = 'bold';
        const lifeC =   life.insertCell(1); lifeC.id = 'lifeStage'; lifeC.style = 'border-spacing: 10px 0';
        const samp = table.insertRow(-1)
        const sampH =   samp.insertCell(0); sampH.id = 'head-samplingProtocol'; sampH.class = 'bold';
        const sampC =   samp.insertCell(1); sampC.id = 'samplingProtocol'; sampC.style = 'border-spacing: 10px 0';
        const tax = table.insertRow(-1)
        const taxH =   tax.insertCell(0); taxH.id = 'head-taxonomy'; taxH.class = 'bold';
        const taxC =   tax.insertCell(1); taxC.id = 'taxonomy'; taxC.style = 'border-spacing: 10px 0';
        const type = table.insertRow(-1)
        const typeH =   type.insertCell(0); typeH.id = 'head-typeStatus'; typeH.class = 'bold';
        const typeC =   type.insertCell(1); typeC.id = 'typeStatus'; typeC.style = 'border-spacing: 10px 0';
        
    } else if (orgGroup === 'geologi') {
        console.log('her hos geologene');
        const loc = table.insertRow(-1)
        const locH =   loc.insertCell(0); locH.id = 'head-locality'; locH.class = 'bold';
        const locC =   loc.insertCell(1); locC.id = 'locality'; locC.style = 'border-spacing: 10px 0';
        const coor = table.insertRow(-1)
        const coorH =   coor.insertCell(0); coorH.id = 'head-coordinates'; coorH.class = 'bold';
        const coorC =   coor.insertCell(1); coorC.id = 'coordinates'; coorC.style = 'border-spacing: 10px 0';
        const type = table.insertRow(-1)
        const typeH =   type.insertCell(0); typeH.id = 'head-typeStatus'; typeH.class = 'bold';
        const typeC =   type.insertCell(1); typeC.id = 'typeStatus'; typeC.style = 'border-spacing: 10px 0';

    } 
}


const makeUTADTable = (specimenObject) => {
    const table = document.getElementById("object-table");
    const fieldsToShow = ['vernacularName', 'basisOfRecord', 'Hyllenr.', 'NHM objektbase', 'lengde', 'bredde', 'høyde', 'Vekt', 'Tilstand', 'Utlån', 'Kommentar']

    makeTableHeader(table)
    const keyObj = []
    // construct table
    for (const [key, value] of Object.entries(specimenObject)) {
        if (Object.hasOwnProperty.call(specimenObject, key) && fieldsToShow.includes(key)) {

            const row = table.insertRow(-1)
            const headKey = row.insertCell(0); headKey.id =  `head-${key}` ; headKey.class = 'bold';
            const Content =   row.insertCell(1); Content.id = key; Content.style = 'border-spacing: 10px 0';
            keyObj[key] = value
        }
    }

    // add data to table
    for (const [key, value] of Object.entries(keyObj)) {
            document.querySelector(`#${key}`).innerHTML = value
    }
}



const makePalTable = (specimenObject) => {
    // add special fiels to specimenobject
    specimenObject.coordinates = coordinates(specimenObject)
    specimenObject.concatLocality = concatLocality
    const table = document.getElementById("object-table");
    const fieldsToShow = ['higherClassification', 'geologicalContext', 'coordinates', 'concatLocality', 'coordinates', 'recordedBy', 'eventDate', 'remarks']
    makeTableHeader(table)

    const keyObj = []
    const objectHeaders = []
    // construct table
    for (const [key, value] of Object.entries(specimenObject)) {
        if (Object.hasOwnProperty.call(specimenObject, key) && fieldsToShow.includes(key)) {
            const row = table.insertRow(-1)
            const headKey = row.insertCell(0); headKey.id =  `head-${key}` ; headKey.class = 'bold';
            const Content =   row.insertCell(1); Content.id = key; Content.style = 'border-spacing: 10px 0';
            keyObj[key] = value
            objectHeaders.push(key)
        }
    }
    sessionStorage.setItem('objectHeaders', JSON.stringify(objectHeaders));
    // add data to table
    for (const [key, value] of Object.entries(keyObj)) {
        document.querySelector(`#${key}`).innerHTML = value
    }

}

const makeGeoTable = (specimenObject) => {
    const table = document.getElementById("object-table");
    const fieldsToShow = ['scientificName', 'higherClassification', 'Dimensjon', 'mass', 'geologicalContext', 'coordinates', 'concatLocality', 'coordinates', 'recordedBy', 'eventDate', 'remarks']
    specimenObject.coordinates = coordinates(specimenObject)
    specimenObject.concatLocality = concatLocality
    // makeTableHeader(table)


    const keyObj = []
    const objectHeaders = []
    // construct table
    for (const [key, value] of Object.entries(specimenObject)) {
        if (Object.hasOwnProperty.call(specimenObject, key) && fieldsToShow.includes(key)) {
            const row = table.insertRow(-1)
            const headKey = row.insertCell(0); headKey.id =  `head-${key}` ; headKey.class = 'bold';
            const Content =   row.insertCell(1); Content.id = key; Content.style = 'border-spacing: 10px 0';
            keyObj[key] = value
            objectHeaders.push(key)
            console.log('obj');
            console.log(key);
        }
    }

    sessionStorage.setItem('objectHeaders', JSON.stringify(objectHeaders));
    // add data to table
    for (const [key, value] of Object.entries(keyObj)) {
        document.querySelector(`#${key}`).innerHTML = value
    }
  
}

const showData = () => {
    if (orgGroup === 'other') {
        makeUTADTable(object)
    } else if (orgGroup === 'geologi') {
        makeGeoTable(object)
    } else if (orgGroup === 'paleontologi') {
        makePalTable(object)
    } else {
        makeBioTable()
    }
     


    if (!sessionStorage.getItem('collection').includes('dna') & !sessionStorage.getItem('collection').includes('birds') & !sessionStorage.getItem('collection').includes('mammals')) {
        document.querySelector("#musit-regno").innerHTML = regnoEl
    } else {
        document.querySelector("#musit-regno").innerHTML = `<span>${object.catalogNumber}</span>`
    }


    if (orgGroup === 'botanikk' || orgGroup === 'zoologi') {
        document.querySelector("#species-name").innerHTML = `<span class="italic">${object.scientificName}</span>`
        document.querySelector("#coll-date").innerHTML = `<span>${object.eventDate}</span>`
        document.querySelector("#coll").innerHTML = `<span>${object.recordedBy}</span>`
        document.querySelector("#det").innerHTML =  `<span>${object.identifiedBy}</span>`
        document.querySelector("#det-date").innerHTML = `<span>${object.dateIdentified}</span>`
        document.querySelector("#artsobsID").innerHTML = artsobsID
        document.querySelector('#sex').innerHTML = sex
        document.querySelector('#lifeStage').innerHTML = lifeStage
        document.querySelector("#habitat").innerHTML = habitat
        document.querySelector('#taxonomy').innerHTML = taxonomy
        document.querySelector("#locality").innerHTML = `<span>${concatLocality}</span>`
        document.querySelector("#coordinates").innerHTML = `<span>${coordinates(object)}</span>`
        document.querySelector('#samplingProtocol').innerHTML = samplingProtocol
    }
}
showData()
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
        // eslint-disable-next-line no-inner-declarations
        function searchInCorema(coremaNo) {
            console.log(coremaNo)
            // vent til vi har sti med samlinger - kan peke rett på
        }
    }
} 
//else if(!window.location.href.includes('tmu') && !window.location.href.includes('/um')) {
// 
//     document.querySelector("#preservedSp").innerHTML = 'basisOfRecord:'
//     document.querySelector("#corema-link").innerHTML = object.basisOfRecord
// 
//     document.querySelector("#head-preparation").innerHTML = 'preparation:'
//     document.querySelector("#preparation").innerHTML = object.preparations
// 
//     document.querySelector("#head-disposition").innerHTML = 'disposition:'
//     document.querySelector("#disposition").innerHTML = object.disposition
// 
// }
// 
//     // put items in itemArray as objects
//     tempItemArray = object.itemNumbers.split(",")
//     itemArray = []
//     tempItemArray.forEach (element => itemArray.push({itemNumber: element}))
    // 
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
// 
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
        }
        document.getElementById("nb-photos").innerHTML = index+1  + '/' + imageList.length 
    } else {
        document.getElementById("photo-anchor").href = mediaLink
        let smallImage = mediaLink
        smallImage = smallImage.replace('jpeg', 'small')
        document.getElementById("photo-box").src = smallImage
    }
    
}

//map

    drawMapObject(object)




if (sessionStorage.getItem('collection') === 'utad') {
    const mapEl = document.getElementById('map-style'); 
    mapEl.style.display = "none";
}



// large map 
document.getElementById('large-map-object-button').onclick = () => {
    window.open(href=`${urlPath}/${getCurrentMuseum()}/mapObject/?id=${id}`)
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

// put content in html-boxes
try {
    renderText(language)
} catch (error) {
    console.log(error);
}

