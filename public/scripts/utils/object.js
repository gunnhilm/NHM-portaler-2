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

// to print nice musit regno
// let justCatalogNumber = object.catalogNumber

// const indexOfNumber = justCatalogNumber.search(/\d/) // sjekk hvis nummeret også inneholder instutisjonskoder og fjerne disse
// if (indexOfNumber > 0) {
//     justCatalogNumber = justCatalogNumber.slice(indexOfNumber)
// }
// const regno = `${object.institutionCode}-${object.collectionCode}-${justCatalogNumber}`

//const regnoEl = `<span>${regno}` 
const regnoEl = `<span>${object.catalogNumber}` 


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

// items

function addRow() {
    //for (i=1; i<x; i++) {
        row = document.getElementById("object-table").insertRow(-1)
        cell1 = row.insertCell(0)
        cell1.style.fontWeight = "bold"
        cell2 = row.insertCell(1)
        //`cell${i}_1` = row.insertCell(0)
        //`cell${i}_2` = row.insertCell(1)
   // }
    
}

if(object.items) {
    // put items in itemArray as objects
    tempItemArray = object.itemNumbers.split(",")
    itemArray = []
    tempItemArray.forEach (element => itemArray.push({itemNumber: element}))
    
    // add properties to the item-objects
    itemTypeArray = object.items.split(",")
    dateArray = object.itemDates.split(",")
    methodArray = object.itemMethods.split(",")
    preparedByArray = object.itemPreparedBys.split(",")
    processIDArray = object.itemProcessIDs.split(",")
    genbankArray = object.itemGenAccNos.split(",")
    DNAConcArray = object.itemConcentrations.split(",")
    DNAConcUnitArray = object.itemUnits.split(",")
    preservationArray = object.itemPreservations.split(",")

    for (i=0; i<itemArray.length; i++) {
        itemArray[i].properties = itemTypeArray[i]
        itemArray[i].date = dateArray[i]
        itemArray[i].method =methodArray[i]
        itemArray[i].preparedBy = preparedByArray[i]
        itemArray[i].processID = processIDArray[i]
        itemArray[i].genAccNo = genbankArray[i]
        itemArray[i].DNAConc =DNAConcArray[i]
        itemArray[i].DNAConcUnit = DNAConcUnitArray[i] 
        itemArray[i].preservation = preservationArray[i]
    }
    
    document.querySelector("#itemsHeader").innerHTML = textItems.itemsHeader[index]
    // add row in table with heading for items
    // addRow()
    // cell1.innerHTML = '<br>'
    // addRow()
    // cell1.id = 'itemsHeader'
    // cell1.innerHTML = `<span class = 'obj-header' style = 'font-weight: normal'>${textItems.itemsHeader[index]}:</span>`
    // addRow()
    //cell1.innerHTML = '<br>'
    
    // loop over array
    itemArray.forEach( item => {
        addRow()
        cell1.innerHTML = item.properties
        cell1.style.textDecoration  = 'underline'
        cell1.style.fontWeight = 'normal'
        cell1.style.fontSize = '18px'
        addRow()
        cell1.innerHTML = textItems.itemNumber[index]
        cell2.innerHTML = item.itemNumber
        addRow()
        if (item.properties.includes("gDNA")) {
            cell1.innerHTML = textItems.extractionDate[index]
        } else if (item.properties === 'Voucher') {
            cell1.innerHTML = ''
        } else {
            cell1.innerHTML = textItems.samplingDate[index]
        }
        cell2.innerHTML = item.date
        addRow()
        cell1.innerHTML = textItems.preservation[index]
        if (item.properties === 'Voucher') {
            cell2.innerHTML = 'Dried'   //this should not be hard coded, I tried to fix in stich-musit-files
        }
        if (item.properties.includes("gDNA")) {
            addRow()
            cell1.innerHTML = textItems.method[index]
            cell2.innerHTML = item.method
            addRow()
            cell1.innerHTML = textItems.preparedBy[index]
            cell2.innerHTML = item.preparedBy

            addRow()
            cell1.innerHTML = textItems.concentration[index]
            cell2.innerHTML = item.DNAConc + ' ' + item.DNAConcUnit
            addRow()    
            cell1.innerHTML = 'BOLD ProcessID:'
            if (item.processID != "#N/A") {
                const url = `http://www.boldsystems.org/index.php/Public_RecordView?processid=${item.processID}`
                cell2.innerHTML = `<a href="${url}" target="_blank">${item.processID}</a>`
            } else { cell2.innerHTML = "#N/A"}
            addRow()
            cell1.innerHTML = 'Genbank Acc.No:'
            cell2.innerHTML = item.genAccNo
        }
        addRow()
        cell1.innerHTML = '<br>'
    })
}

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
console.log(object)
const coll = sessionStorage.getItem('collection')
let mediaLink
let imageList
if ( coll === 'birds' || coll === 'mammals' || coll === 'dna_fish_herptiles' || coll === 'dna_other') {
    mediaLink = object.photoIdentifiers
} else {
    mediaLink = object.associatedMedia
}
if ( mediaLink.includes('|') || mediaLink.includes(',')) {  // if several photos
    document.getElementById("next-photo").style.display = "block"
    let index = 0
    if (mediaLink.includes('|')) {
        imageList = mediaLink.split('|')
    } else {
        imageList = mediaLink.split(',') // birds and mammals (corema-collections)
    }
    let smallImageList = imageList.map(reducePhoto)
    document.getElementById("photo-anchor").href = imageList[0]
    document.getElementById("photo-box").src = smallImageList[0]
    document.getElementById("next-photo").onclick = () => {
        index = changeImage(index, smallImageList, imageList)
    }
} else {
    document.getElementById("photo-anchor").href = mediaLink
    let smallImage = mediaLink
    smallImage = smallImage.replace('jpeg', 'small')
    document.getElementById("photo-box").src = smallImage
}

//map
drawMapObject(object)

// large map button
document.getElementById('large-map-object-button').onclick = () => {
    console.log(urlPath)
    window.open(href=`${urlPath}/mapObject/?id=${id}`)
}

