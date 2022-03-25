// Description of file: Renders text on object.hbs


// figures out which museum we are in
// out: string, abbreviation for museum
// is called by document.getElementById('large-map-object-button').onclick
const getCurrentMuseum = () => {
    const pathArray = window.location.pathname.split('/')
    const museum = pathArray[2]
    return museum
}

//figures out which organism group we are in
// out: string
// is called below function to fill variable orgGroup
const getOrganismGroup = () => {
    let orgGroup = ''
    orgGroup = sessionStorage.getItem('organismGroup')
    return orgGroup
}



// reads last search-result from sessionStorage and puts it in an array
//  
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

document.getElementById("next-photo").onclick = () => {
    index = changeImage(index, 'f', smallImageList, imageList)
    document.getElementById("nb-photos").innerHTML = (index+1)  + '/' + imageList.length 
    
}

//hide next-photo-button, only in use when more than one photo
document.getElementById("next-photo").style.display = "none"
document.getElementById("previous-photo").style.display = "none"
document.getElementById("nb-photos").style.display = "none"

// fetches organism-group from backend and sets it in sessionStorage (botanikk, mykologi, zoologi, osv)
// is called in main()
async function setOrgGroup () {
    const urlParams = new URLSearchParams(window.location.search)
    // set orgGroup to sessionStorage
    const url2 = urlPath + '/groupOfOrg/?' + 'museum=' + urlParams.get("museum") + '&samling=' + urlParams.get("samling")
    await fetch(url2).then((response) => {
        if (!response.ok) {
            throw 'noe går galt med søk, respons ikke ok'  
        } else {
            try {
                response.text().then((data) => {
                    if(data.error) {
                        errorMessage.innerHTML = textItems.serverError[index]
                        return console.log(data.error)
                    } else {
                        sessionStorage.setItem('organismGroup', data)
                    }
                }) 
                
            } catch (error) {
                console.log(error);
            }
        }
    })
}

// gets relevant object from search result
// in: an array with JSON-objects that represents museumobjects in the last search result. Empty array if there is no search result in sessionStorage
// out: object with data for relevant object
// is called in main()
async  function getspecimenData (allObject) {
    return new Promise(function(resolve, reject) {
        // get the id from the url
        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('id')
        let specimenObject = {}
        try {
            if (sessionStorage.getItem('collection').includes('fisk')) {
                specimenObject = allObject.find(x => x.catalogNumber.replace(/[A-Z]/,'').trim() === id)
            } else if (allObject[0].catalogNumber.includes('/')) {
                specimenObject = allObject.find(x => x.catalogNumber.substring(0,x.catalogNumber.indexOf('/')) === id)
            } else {
                specimenObject = allObject.find(x => x.catalogNumber === id)
            }
            resolve(specimenObject)
        } catch (error) {
            reject(new Error(error));
            console.log(error);

        }
    })
}

// fetches type of file (stitched if collection is in both corema and musit, 
//      or only in corema, not-stitched if not) and db (musit or corema or access etc) 
//      from backend and put them in sessionStorage
// is called in main()
// is used a.o. when rendering data for items/preparations
async function whichFileAndDb (museum,collection) {
    url = urlPath + '/which/?museum='+ museum + '&collection=' +  collection
    await fetch(url).then((response) => {
        if (!response.ok) {
            throw 'cant find file and database from backend'
        } else {
            try {
                response.text().then((data) => {
                    if (data.error) {
                        errorMessage.innerHTML = textItems.serverError[index]
                        return console.log(data.error)
                    } else {
                        let data1 = JSON.parse(data)
                        sessionStorage.setItem('file', data1[0])
                        sessionStorage.setItem('source', data1[1])
                    }
                })
            } catch (error) {
                console.log(error)
            }
        } 
    })
}


// functionality to next-object-buttons
let museumURLPath = ''
if (window.location.href.includes('/um')) { 
    museumURLPath = urlPath + "/um"
} else if (window.location.href.includes('tmu')) {
    museumURLPath = urlPath + "/tmu"
} else if (window.location.href.includes('nbh')) {
    museumURLPath = urlPath + "/nbh"
} else {
    museumURLPath = urlPath + "/nhm"
}

// functionality regarding navigation-buttons (next object, previous object, back-to-searc-result)
// in: allObject; searchResult (from session Storage?)
// in: specimenObject: present object
// is called in main()
const makeNavButtons  = (allObject, specimenObject) => {
    // back-to-result-button
    document.getElementById("back-to-result").onclick = () => {
        window.location.href=`${museumURLPath}`
    }
    const nextObject = allObject[allObject.indexOf(specimenObject)+1]
    const previousObject = allObject[allObject.indexOf(specimenObject)-1]

    document.getElementById("next-object").disabled = allObject.indexOf(specimenObject) == allObject.length-1 ? true : false;
    document.getElementById("previous-object").disabled = allObject.indexOf(specimenObject) == 0 ? true : false;
    document.getElementById("next-object").onclick = () => {
        if (allObject.indexOf(specimenObject) !== allObject.length-1) {
            if (sessionStorage.getItem('chosenCollection').includes('fisk')) {
                window.location.href=`${museumURLPath}/object/?id=${nextObject.catalogNumber.replace(/[A-Z]/,'').trim()}`
            } else {
                window.location.href=`${museumURLPath}/object/?id=${nextObject.catalogNumber}`
            }
        }
    }
    document.getElementById("previous-object").onclick = () => {
        if (allObject.indexOf(object) !== 0) {
            if (sessionStorage.getItem('chosenCollection').includes('fisk')) {
                window.location.href=`${museumURLPath}/object/?id=${previousObject.catalogNumber.replace(/[A-Z]/,'').trim()}`
            } else {
                window.location.href=`${museumURLPath}/object/?id=${previousObject.catalogNumber}`
            }
        }
    }
}

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

// fills variable taxonomy with content
// out: string with taxonomic hierarchy
// is called below to fill variable taxonomy
const taxonomyString = (specimenObject) => {
    let string = ''
    if (specimenObject.kingdom === true) {
        string = specimenObject.kingdom
    } 
    if (specimenObject.class) {
        string = string + ' ' + specimenObject.class
    }
    if (specimenObject.order) {
        string = string + ' ' + specimenObject.order
    }
    if (specimenObject.family) {
        string = string + ' ' + specimenObject.family
    }
    string = `<span>${string}</span>`
    string = string.toString()
 return string
}

// enables species name in italic and author in non-italic
// in: scientific species name; string
// out: two strings (in an array); name in one string and 
// author in another
// is called in showData()
const italicSpeciesname = (string) => {
    string = string.trim()
    let author = ''
    let array = string.split(" ")
    let name = array[0]
    let nameFinished = false
    for (let i = 1; i< array.length; i++) {
        characters = array[i].split('')
        if (characters.length > 0) {
            if (characters[0] == characters[0].toUpperCase()) {
                nameFinished = true
                author = author + ' ' + array[i]
            } else {
                if (nameFinished == false) {
                    name = name + ' ' + array[i]
                } else {
                    author = author + ' ' + array[i]
                }
            }
        }
    }
    let nameAuthor = [name, author]
    
    return(nameAuthor)
}

// make first line in table for object-information, fills the cells (scientific name),
// and fills musit-regno-box
// in: table; html-element
// is called in makeUTADTable() and makePalTable()
const makeTableHeader = (table) => {
    const speciesNameRow = table.insertRow(0)
    const speciesNameHeader = speciesNameRow.insertCell(0); speciesNameHeader.id = 'head-species-name'; speciesNameHeader.class = 'bold'; speciesNameHeader.style = 'white-space:pre';
    const speciesNameCont = speciesNameRow.insertCell(1); speciesNameCont.id = 'species-name'; speciesNameCont.style = 'border-spacing: 10px 0'; //font-style:italic';
    // mener her å ta vekk italic fra geologisk artsnavn på obj-sida, men den er ikke italic nå, vet ikke hvorfor
    if (sessionStorage.getItem('organismGroup').includes('geologi') ) {
        console.log('geologi')
    }
    let nameArray = italicSpeciesname(object.scientificName)
    document.querySelector('#head-species-name').innerHTML = `<span>${textItems.scientificName[index]}</span>`
    document.querySelector("#species-name").innerHTML = `<span style=font-style:italic>${nameArray[0]}</span>` + ' ' + `<span>${nameArray[1]}</span>`
    //document.querySelector("#musit-regno").innerHTML = `<span>${object.catalogNumber}</span>`
}

// items
//adds row to table that lists object’s data on the fly – number of rows necessary varies between objects
// will be called in the future when stitched data is in place
function addRow(table) {
    row = table.insertRow(-1)
    cell1 = row.insertCell(0)
    cell1.style.fontWeight = "bold"
    cell2 = row.insertCell(1)
}

// builds table for object-data for botany and mycology and zoology
// - inserts rows, add cells, with id, class and style
// - 
// is called in showData()
const makeBioTable = () => {
    const table = document.getElementById("data-table");
    const speciesNameRow = table.insertRow(0)
    //const speciesNameHeader = speciesNameRow.insertCell(0); speciesNameHeader.id = 'head-species-name'; speciesNameHeader.style.fontWeight = 'bold'; speciesNameHeader.style = 'white-space:pre';
    const speciesNameHeader = speciesNameRow.insertCell(0); speciesNameHeader.id = 'head-species-name'; speciesNameHeader.class = 'bold'; speciesNameHeader.style = 'white-space:pre';
    const speciesNameCont = speciesNameRow.insertCell(1); speciesNameCont.id = 'species-name'; speciesNameCont.style = 'border-spacing: 10px 0' //font-style:italic'; 
        
    //if (orgGroup === 'botanikk' || orgGroup === 'zoologi' || orgGroup === 'mykologi') {            
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
        const collNoRow = table.insertRow(-1)
        const collNoH =   collNoRow.insertCell(0); collNoH.id = 'head-collNo'; collNoH.class = 'bold';
        const collNoC =   collNoRow.insertCell(1); collNoC.id = 'collNo'; collNoH.style = 'border-spacing: 10px 0';
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
        
        // } 

}

// builds table for object-data for UTAD's collections
// - inserts row for each property the object has, and that we decided to show
// - add cells, with id, class and style
// fills cells with data (not header-cells)
// in: specimenObject; collection-object
// calls makeTableHeader(table)
const makeUTADTable = (specimenObject) => {
    const table = document.getElementById("data-table")
    const fieldsToShow = [/*'scientificName',*/ 'vernacularName', 'basisOfRecord', 'Hyllenr.', 'NHM objektbase', 'lengde', 'bredde', 'høyde', 'Vekt', 'Tilstand', 'Utlån', 'Kommentar']

    makeTableHeader(table)
    const keyObj = []
    // construct table
    // "The Object.entries() method returns an array of a given object's own enumerable string-keyed property [key, value] pairs.
    for (const [key, value] of Object.entries(specimenObject)) {
        //console.log(key)
        // The hasOwnProperty() method returns a boolean indicating whether the object has the specified property as its own property (as opposed to inheriting it).
        if (Object.hasOwnProperty.call(specimenObject, key) && fieldsToShow.includes(key)) {

            const row = table.insertRow(-1)
            const headKey = row.insertCell(0); headKey.id =  `head-${key}` ; headKey.class = 'bold';
            const Content =   row.insertCell(1); Content.id = key; Content.style = 'border-spacing: 10px 0';
            keyObj[key] = value
            //console.log(headKey)
        }
        
    }
    // add data to table
    for (const [key, value] of Object.entries(keyObj)) {
            document.querySelector(`#${key}`).innerHTML = value
    }
}


// builds table for object-data for pal-collection
// - inserts row for each property the object has, and that we decided to show
// - add cells, with id, class and style
// fills cells with data (not header-cells)
// in: specimenObject; collection-object
// calls makeTableHeader(table)

const makePalTable = (specimenObject) => {
    // add special fields to specimenobject
    console.log(specimenObject)
    // legg til formaterte koordinater og lokalitet som .. på objektet
    specimenObject.coordinates = coordinates(specimenObject)
    console.log(specimenObject)
    specimenObject.concatLocality = concatLocality
    const table = document.getElementById("data-table");
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

// builds table for object-data for geo-collection
// - inserts row for each property the object has, and that we decided to show
// - add cells, with id, class and style
// fills cells with data (not header-cells)
// parameter: specimenObject; collection-object
// calls makeTableHeader(table)
const makeGeoTable = (specimenObject) => {
    const table = document.getElementById("data-table");
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
        }
    }

    sessionStorage.setItem('objectHeaders', JSON.stringify(objectHeaders));
    // add data to table
    for (const [key, value] of Object.entries(keyObj)) {
        document.querySelector(`#${key}`).innerHTML = value
    }
  
}

// renders text for object in traditional collection (not DNA-bank)
// in: specimenObject - present object
// in: objectTable - which table data should be rendered in (relict from when this was swapped according to which collection we came from)
// in: order - string; "first" or "second". "First" means trad.coll.object comes from the collecton we are in (typically musit)
// "Second" means trad.coll.object comes from other collection that the one we are in (typically DNA-bank)
async function showObjectData (specimenObject,objectTable,order) {
    addRow(objectTable)
    cell1.innerHTML = `<span class = 'obj-header' style = 'font-weight: normal'>${textItems.objectHeaderColl[index]}</span>`
    // if (sessionStorage.getItem('source') === 'corema') {
    //     cell1.innerHTML = `<span class = 'obj-header' style = 'font-weight: normal'>${textItems.assObjHeader[index]}</span>`
    // } else if (sessionStorage.getItem('source') === 'musit') {
    //     cell1.innerHTML = `<span class = 'obj-header' style = 'font-weight: normal'>${textItems.assItemsHeader[index]}</span>`
    // }
    addRow(objectTable)
    cell1.innerHTML = '<br>'
    addRow(objectTable)
    let prefix
    if (specimenObject.relatedResourceID) {
        prefix = specimenObject.relatedResourceID.substring(12,specimenObject.relatedResourceID.indexOf(':',14)).replace('\:','-')
        } else {
            prefix = specimenObject.institutionCode + '-' + specimenObject.collectionCode
        }
    if (order === 'first') {
        cell1.innerHTML = cell1.innerHTML = `<a id="object-link" href="${museumURLPath}/object/?id=${specimenObject.catalogNumber}&samling=${sessionStorage.getItem('chosenCollection')}&museum=nhm&lang=${sessionStorage.getItem('language')}"> ${prefix}-${specimenObject.catalogNumber} </a>`
    } else {
        cell1.innerHTML = cell1.innerHTML = `<a id="object-link" href="${museumURLPath}/object/?id=${specimenObject.RelCatNo}&samling=${sessionStorage.getItem('chosenCollection')}&museum=nhm&lang=${sessionStorage.getItem('language')}"> ${prefix}-${specimenObject.RelCatNo} </a>`
    }
        
    cell1.style.textDecoration  = 'underline'
    cell1.style.fontWeight = 'normal'
    cell1.style.fontSize = '18px'
    addRow(objectTable)
    cell1.innerHTML = textItems.itemType[index]
    if (order === 'first') {
        cell2.innerHTML = specimenObject.basisOfRecord
    } else {
        cell2.innerHTML = specimenObject.musitBasisOfRecord        
    }
}

// renders text for DNA-bank-items
// in: specimenObject - present object
// in: objectTable - which table data should be rendered in (relict from when this was swapped according to which collection we came from)
// in: order - string; "first" or "second". "First" means trad.coll.object comes from the collecton we are in (typically musit)
// "Second" means trad.coll.object comes from other collection that the one we are in (typically DNA-bank)

async function showItemData (specimenObject,objectTable,order) {
// put corema-items in itemArray as objects
    tempItemArray = []
    if(order === 'first') {
        tempItemArray = specimenObject.fullCatalogNumber.split(" | ")
    } else {
        tempItemArray = specimenObject.RelCatNo.split(" | ")
    }
    
    itemArray = []
    tempItemArray.forEach (element => itemArray.push({itemNumber: element}))
    // add properties to the item-objects
    itemTypeArray = specimenObject.materialSampleType.split(" | ")
    dateArray = specimenObject.preparationDate.split(" | ")
    methodArray = specimenObject.preparationMaterials.split(" | ")
    preparationTypeArray = specimenObject.preparationType.split(" | ")
    preparedByArray = specimenObject.preparedBy.split(" | ")
    processIDArray = specimenObject.BOLDProcessID.split(" | ")
    genbankArray = specimenObject.geneticAccessionNumber.split(" | ")
    DNAConcArray = specimenObject.concentration.split(" | ")
    DNAConcUnitArray = specimenObject.concentrationUnit.split(" | ")
    preservationArray = specimenObject.preservationType.split(" | ")

    for (i=0; i<itemArray.length; i++) {
        itemArray[i].itemType = itemTypeArray[i]
        itemArray[i].date = dateArray[i]
        itemArray[i].method =methodArray[i]
        itemArray[i].preparedBy = preparedByArray[i]
        itemArray[i].processID = processIDArray[i]
        itemArray[i].genAccNo = genbankArray[i]
        itemArray[i].DNAConc =DNAConcArray[i]
        itemArray[i].DNAConcUnit = DNAConcUnitArray[i] 
        itemArray[i].preservation = preservationArray[i]
        itemArray[i].preparationType = preparationTypeArray[i]
    }
    console.log(itemArray)
    // add row in table with heading for items or preserved specimen
    addRow(objectTable)
    cell1.innerHTML = '<br>'
    addRow(objectTable)
    cell1.id = 'itemsHeader'
    console.log(sessionStorage.getItem('source'))
    cell1.innerHTML = `<span class = 'obj-header' style = 'font-weight: normal'>${textItems.itemsHeader[index]}</span>`
    addRow(objectTable)
    cell1.innerHTML = '<br>'
    // loop over array
    itemArray.forEach( item => {
        // console.log(item)
        //row1 catno
        addRow(objectTable)
        if (order === 'first') {
            if (sessionStorage.getItem('source') === 'musit') {
                cell1.innerHTML = specimenObject.institutionCode + '-' + specimenObject.collectionCode + '-' + specimenObject.catalogNumber
            } else {
                cell1.innerHTML = item.itemNumber
            }
        } else if (order === 'second') {
            if (sessionStorage.getItem('source') === 'musit') {
                cell1.innerHTML = item.itemNumber
            } else {
                cell1.innerHTML = specimenObject.institutionCode + '-' + specimenObject.collectionCode + '-' + specimenObject.catalogNumber
            }
        }
        cell1.style.textDecoration  = 'underline'
        cell1.style.fontWeight = 'normal'
        cell1.style.fontSize = '18px'
        //row2 item type
        addRow(objectTable)
        cell1.innerHTML = textItems.itemType[index]
        cell2.innerHTML = item.itemType
        //row3 extraction date
        addRow(objectTable)
        cell1.innerHTML = textItems.subTypeHeader[index]
        cell2.innerHTML = item.preparationType
        addRow(objectTable)
        
        if (item.itemType.includes("DNA")) {  // tidligere versjon: "gDNA" - fra preparationType
            cell1.innerHTML = textItems.extractionDate[index]
        // } else if (item.itemType === 'Voucher') { // change
        //     cell1.innerHTML = ''
        } else {
            cell1.innerHTML = textItems.samplingDate[index]
        }
        if (!item.date || item.date == '"') {cell2.innerHTML = ''} else {cell2.innerHTML = item.date}
        addRow(objectTable)
        cell1.innerHTML = textItems.preservation[index]
        // if (item.itemType === 'Voucher') { // change
        //     cell2.innerHTML = specimenObject.itemType
        // } else {
        if (!item.preservation || item.preservation == '"') {cell2.innerHTML = ''} else {cell2.innerHTML = item.preservation.replace(/"/g, '')}
        if (item.itemType.includes("DNA")) { // tidligere versjon: "gDNA" - fra preparationType
            addRow(objectTable)
            cell1.innerHTML = textItems.method[index]
            if (!item.method || item.method == '"') {cell2.innerHTML = ''} else {cell2.innerHTML = item.method.replace(/"/g, '')}
            addRow(objectTable)
            cell1.innerHTML = textItems.preparedBy[index]
            if (!item.preparedBy || item.preparedBy == '"') {cell2.innerHTML = ''} else {cell2.innerHTML = item.preparedBy.replace(/"/g, '')}
            addRow(objectTable)
            cell1.innerHTML = textItems.concentration[index]
            if (!item.DNAConc || item.DNAConc == '"') {cell2.innerHTML = ''} else {cell2.innerHTML = item.DNAConc.replace(/"/g, '') + ' ' + item.DNAConcUnit.replace(/"/g, '')}
            addRow(objectTable)    
            cell1.innerHTML = 'BOLD ProcessID:'
            if (!item.processID || item.processID == '"') {cell2.innerHTML = ''}
            else {
                const url = `http://www.boldsystems.org/index.php/Public_RecordView?processid=${item.processID}`
                cell2.innerHTML = `<a href="${url}" target="_blank">${item.processID}</a>`
            } 
            addRow(objectTable)
            cell1.innerHTML = 'Genbank Acc.No:'
            if (!item.genAccNo || item.genAccNo == '"') {cell2.innerHTML = ''} else {cell2.innerHTML = item.genAccNo.replace(/"/g, '')}
        }
        addRow(objectTable)
        cell1.innerHTML = '<br>'
    })
    
}
// calls function that build table and fill headers,
// and fills data in table for zoology and botany and mycology
// calls makeUTADTable(obj) or makeGeoTable(obj) or makePalTable(obj) or makeBioTable(obj)
// is called below
async function showData (specimenObject, orgGroup) {
    console.log(specimenObject)
    if (orgGroup === 'other') {
        makeUTADTable(specimenObject)
    } else if (orgGroup === 'geologi') {
        makeGeoTable(specimenObject)
    } else if (orgGroup === 'paleontologi') {
        makePalTable(specimenObject)
    } else {
        makeBioTable(specimenObject, orgGroup)
    }
    
    
    let prefix
    let regnoEl
    if (sessionStorage.getItem('chosenCollection').includes('fisk')) {
        prefix = 'NHMO-J-'
        regnoEl = `<span>${prefix}${specimenObject.catalogNumber.replace(/[A-Z]/,'').trim()}</span>` 
    } else if (specimenObject.catalogNumber.includes('/')) {
        let strippedCatNo = specimenObject.catalogNumber.substring(0,specimenObject.catalogNumber.indexOf('/'))
        regnoEl =  `<span>${strippedCatNo}</span>`
    } else{
        prefix = specimenObject.institutionCode + '-' + specimenObject.collectionCode + '-'
        regnoEl = `<span>${prefix}${specimenObject.catalogNumber}</span>` 
    }

    // data only displayed if existing
    let collNo = ''
    if( specimenObject.recordNumber ) {
        console.log('har collno')
        collNo = `<span>${specimenObject.recordNumber}</span>`
    } 

    let headArtsobs = ''
    let artsobsID = ''
    if( specimenObject.ArtObsID ) {
        console.log('har artsobsno')
        artsobsID = `<span>${specimenObject.ArtObsID}</span>`
    } 

    let headHabitat = ''
    let habitat = ''
    if (specimenObject.habitat ) {
        habitat = `<span>${specimenObject.habitat}</span>`
    }

    //let headSex = ''
    let sex = ''
    if (specimenObject.sex) { sex =  `<span>${specimenObject.sex}</span>`}
    let lifeStage = ''
    if (specimenObject.lifeStage) { lifeStage =  `<span>${specimenObject.lifeStage}</span>`}
    let samplingProtocol = ''
    if (specimenObject.samplingProtocol) { samplingProtocol =  `<span>${specimenObject.samplingProtocol}</span>`}
    //let headTypeStatus = ''
    let typeStatus = ''
    if (specimenObject.typeStatus) { typeStatus =  `<span>${specimenObject.typeStatus}</span>`}


    if (sessionStorage.getItem('organismGroup').includes('paleontologi') ) {

        document.querySelector("#musit-regno").innerHTML = `<span>PMO ${specimenObject.catalogNumber}</span>`
    } 
    // else if (!sessionStorage.getItem('collection').includes('dna') & !sessionStorage.getItem('collection').includes('birds') & !sessionStorage.getItem('collection').includes('mammals')) {
    //     document.querySelector("#musit-regno").innerHTML = regnoEl
    // }
     else {
        document.querySelector("#musit-regno").innerHTML = regnoEl
   
   //     document.querySelector("#musit-regno").innerHTML = `<span>${object.catalogNumber.replace(/[A-Z]/,'').trim()}</span>`
    }

    const concatLocality = country(specimenObject) + stateProvince(specimenObject) + county(specimenObject) + locality(specimenObject)

    let taxonomy = ''
    if (specimenObject.kingdom || specimenObject.class || specimenObject.order || specimenObject.family) {
        taxonomy = taxonomyString(specimenObject)
    }

    if (orgGroup === 'botanikk' || orgGroup === 'mykologi' || orgGroup === 'zoologi') {
        let nameArray = italicSpeciesname(specimenObject.scientificName)
        document.querySelector("#species-name").innerHTML = `<span style=font-style:italic>${nameArray[0]}</span>` + ' ' + `<span>${nameArray[1]}</span>`
        document.querySelector("#coll-date").innerHTML = `<span>${specimenObject.eventDate}</span>`
        document.querySelector("#coll").innerHTML = `<span>${specimenObject.recordedBy}</span>`
        document.querySelector("#collNo").innerHTML = collNo
        document.querySelector("#det").innerHTML =  `<span>${specimenObject.identifiedBy}</span>`
        document.querySelector("#det-date").innerHTML = `<span>${specimenObject.dateIdentified}</span>`
        document.querySelector("#artsobsID").innerHTML = artsobsID
        document.querySelector('#sex').innerHTML = sex
        document.querySelector('#lifeStage').innerHTML = lifeStage
        document.querySelector("#habitat").innerHTML = habitat
        document.querySelector('#taxonomy').innerHTML = taxonomy
        document.querySelector('#typeStatus').innerHTML = typeStatus
        document.querySelector("#locality").innerHTML = `<span>${concatLocality}</span>`
        document.querySelector("#coordinates").innerHTML = `<span>${coordinates(specimenObject)}</span>`
        document.querySelector('#samplingProtocol').innerHTML = samplingProtocol
    }

    if(!window.location.href.includes('tmu') && !window.location.href.includes('/um') && !window.location.href.includes('/nbh')) {
    ////// change to check file, if stitched. fix async stuff first
        // console.log(sessionStorage.getItem('file'))
        // console.log(sessionStorage.getItem('source'))
        // console.log(sessionStorage.getItem('organismGroup'))
        let table1 = document.getElementById("object-table")
        let table2 = document.getElementById('ass-object-table')
        
        if (sessionStorage.getItem('file').includes('stitch')) {
            if (sessionStorage.getItem('source') === 'corema') {
                
                await showItemData(specimenObject,table1,"first")
                table2.style.border = 'solid'
                if (specimenObject.RelCatNo) {
                    await showObjectData(specimenObject,table2,"second")    
                } else {table2.style.display = 'none'}
            } else if (sessionStorage.getItem('source') === 'musit') {
                await showObjectData(specimenObject,table1,"first")
                if (specimenObject.RelCatNo) {
                    await showItemData(specimenObject,table2,"second")
                    table2.style.border = 'solid'
                } else {table2.style.display = 'none'}
            }
            
        }   
        // align object-table and items-table by making their above divs same height
        let dataTableHeight = document.getElementById('left-table').getBoundingClientRect()
        let mapDivHeight = document.getElementById('map-style').getBoundingClientRect()
        
        // console.log(dataTableHeight.height)
        // console.log(mapDivHeight.height)
        let divHeight
        if (dataTableHeight.height > mapDivHeight.height) {divHeight = dataTableHeight.height} else {divHeight = mapDivHeight.height}
        // console.log(divHeight)
        // document.getElementById('left-table').style.height = divHeight + 'px'
        // document.getElementById('map-style').style.height = divHeight + 'px'
        //console.log(document.getElementById('left-table').offsetHeight)
    }
}



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

const showMedia = (specimenObject) => {
    let mediaLink = '' 
    let imageList = []
    if (specimenObject.associatedMedaa) {
        mediaLink = specimenObject.associatedMedia
    } else if (specimenObject.identifier) {
        mediaLink = specimenObject.identifier
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
}


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
async function renderItems () {
    try {
        renderObjectText(language) // endret fra renderLang()
    } catch (error) {
        console.log(error);
    }
}


function makeTable(specimenObject){
    const orgType= sessionStorage.getItem('organismGroup')
    if (orgType === 'geologi'){ makeGeoTable(specimenObject) }
    else if (orgType === 'paleontologi'){ makePalTable(specimenObject) }
    else if (orgType === 'zoologi'){ makeBioTable() }
    else if (orgType === 'botanikk'){ makeBioTable() }
    else if (orgType === 'mykologi') {makeBioTable() }
    else if (orgType === 'other'){ makeUTADTable(specimenObject) }
}


async function main () {
   // from file newObjectPage.js
   await newObjectPageMain()
   const urlParams = new URLSearchParams(window.location.search)
   await whichFileAndDb(urlParams.get("museum"),urlParams.get("samling")) 
   if (language === "Norwegian") {
        document.querySelector('#language').innerHTML = "English website"
    } else if (language === "English") {
        document.querySelector('#language').innerHTML = "Norwegian website"
    }
      // from file renderLangObjPage.js

    renderObjectText(language)
   const orgGroup = getOrganismGroup()
   //get the object from session storage
   const allObject = loadStringObject()
   
   // set OrgGruop
   await setOrgGroup()
   
   
   // get the correct object
   let specimenObject = await getspecimenData(allObject)
   //makeTable(specimenObject)

   if(Array.isArray(allObject) && (allObject.length > 2)) {
       makeNavButtons(allObject, specimenObject)
   }
   renderObjectText(language)
   await showData(specimenObject, orgGroup)
   showMedia(specimenObject)
   drawMapObject(specimenObject)
   renderItems()
}

main()
