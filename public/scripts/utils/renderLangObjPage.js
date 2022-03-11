// read string and get the object from sessionStorage (for the object-page)
const loadString = (item) => {
        
    const objectJSON = sessionStorage.getItem(item)    
    try {//object
        return objectJSON ? JSON.parse(objectJSON) : []
    } catch (e) {
        return []
    }
}

function setIndex (lang) {
    if (lang === "English") {
        index = 1
    } else {
        index = 0
    }
    return index
}

function renderObjectText(){
// object page
const urlParams = new URLSearchParams(window.location.search)
    index = setIndex(urlParams.get("lang"))
    // Get the name of the collection
    const coll = sessionStorage.getItem('collection')
    const orgGroup = sessionStorage.getItem('organismGroup')

    //get the object from session storage
    const allObject = loadString('string')
    const objectHeaders = loadString('objectHeaders')
    // get the id from the url
    const id = urlParams.get('id')
    const specimenObject = allObject.find(x => x.catalogNumber === id)
    
    document.querySelector("#back-to-result").innerHTML = textItems.searchButtonHeader[index]
    document.querySelector("#next-object").innerHTML = textItems.nextObject[index]
    document.querySelector("#previous-object").innerHTML = textItems.previousObject[index]
    

    document.querySelector("#photo-box").alt = textItems.photoAlt[index]
    document.querySelector("#next-photo").innerHTML = textItems.nextPhoto[index]
    document.querySelector("#previous-photo").innerHTML = textItems.previousPhoto[index]

    if (coll === 'utad') {
        console.log('utad');
        //document.querySelector("#head-species-name").innerHTML = textItems.speciesName[index].bold()
        if (document.querySelector("#head-vernacularName")) {document.querySelector("#head-vernacularName").innerHTML=textItems.vernacularName[index]}
        if (document.querySelector("#head-basisOfRecord")) {document.querySelector("#head-basisOfRecord").innerHTML=textItems.basisOfRecord[index]}
        if (document.querySelector("#head-lengde")) {document.querySelector("#head-lengde").innerHTML=textItems.lengde[index]}
        if (document.querySelector("#head-bredde")) {document.querySelector("#head-bredde").innerHTML=textItems.bredde[index]}
        if (document.querySelector("#head-høyde")) {document.querySelector("#head-høyde").innerHTML=textItems.hoyde[index]}
        if (document.querySelector("#head-Vekt")) {document.querySelector("#head-Vekt").innerHTML=textItems.Vekt[index]}
        if (document.querySelector("#head-Tilstand")) {document.querySelector("#head-Tilstand").innerHTML=textItems.Tilstand[index]}
        if (document.querySelector("#head-Utlån")) {document.querySelector("#head-Utlån").innerHTML=textItems.Utlån[index]}
        if (document.querySelector("#head-Kommentar")) {document.querySelector("#head-Kommentar").innerHTML=textItems.Kommentar[index]}
        
    } else if (orgGroup === 'paleontologi') {
        if (document.querySelector("#head-species-name")) {document.querySelector("#head-species-name").innerHTML = textItems.headSpeciesName[index].bold()}
        if (document.querySelector("#head-concatLocality")) {document.querySelector("#head-concatLocality").innerHTML = textItems.concatLocality[index].bold()}
        for (let i = 0; i < objectHeaders.length; i++) {
            const element = objectHeaders[i];
            if (document.querySelector(`#head-${element}`)) {document.querySelector(`#head-${element}`).innerHTML = textItems[element][index].bold()}
        }

    } else if (orgGroup === 'geologi') {
        for (let i = 0; i < objectHeaders.length; i++) {
            
            const element = objectHeaders[i];
            if (element === "eventDate") {
                if (document.querySelector(`#head-${element}`)) {document.querySelector(`#head-${element}`).innerHTML = textItems.headerDate[index].bold()+":".bold()}
            } else if (document.querySelector(`#head-${element}`)) {document.querySelector(`#head-${element}`).innerHTML = textItems[element][index].bold()}
        }

    } else { // biologi objekter

        if (document.querySelector("#head-species-name")) {
            document.querySelector("#head-species-name").innerHTML = textItems.headSpeciesName[index].bold()
            document.querySelector("#head-det").innerHTML = textItems.headDet[index].bold()
            document.querySelector("#head-det-date").innerHTML = textItems.headDetDate[index].bold()
            document.querySelector("#head-coll-date").innerHTML = textItems.headCollDate[index].bold()
            document.querySelector("#head-coll").innerHTML = textItems.headColl[index].bold()
            document.querySelector("#head-locality").innerHTML = textItems.headLocality[index].bold()
            document.querySelector("#head-coordinates").innerHTML = textItems.headCoordinates[index].bold()
        }
        
        if (specimenObject.recordNumber) {
            console.log('har collno')
            if (document.querySelector("#head-collNo")) {
                document.querySelector("#head-collNo").innerHTML = textItems.headCollNo[index].bold()
            }
        }
        if(!specimenObject.decimalLatitude || !specimenObject.decimalLongitude) {
            if (document.querySelector("#map-object")) {
                document.querySelector("#map-object").innerHTML = textItems.mapAlt[index]
            }
        }

        if (specimenObject.ArtObsID) {
            if (document.querySelector("#head-artsobs")) {
                document.querySelector("#head-artsobs").innerHTML = textItems.headArtsobs[index].bold()
            }
        }
        if (specimenObject.habitat ) {
            if(document.querySelector("#head-habitat")) {
                document.querySelector("#head-habitat").innerHTML = "Habitat: ".bold()
            }
        }
        if (specimenObject.sex) {
            if (document.querySelector("#head-sex")) {
                document.querySelector("#head-sex").innerHTML = textItems.headSex[index].bold()
            }
        }
        if (specimenObject.lifeStage) {
            if (document.querySelector("#head-lifeStage")) {
                document.querySelector("#head-lifeStage").innerHTML = textItems.headLifeStage[index].bold()
            }
        }
        if (specimenObject.samplingProtocol) {
            if(document.querySelector("#head-samplingProtocol")) {
                document.querySelector("#head-samplingProtocol").innerHTML = textItems.headSamplingProtocol[index].bold()
            }
        }
        if (document.querySelector("#head-taxonomy")) {
            if (specimenObject.kingdom || specimenObject.class || specimenObject.order || specimenObject.family) {
                document.querySelector("#head-taxonomy").innerHTML = textItems.headTaxonomy[index].bold()
            }
        }
        
        if (specimenObject.typeStatus) {
            if (document.querySelector("#head-typeStatus")) {
                document.querySelector("#head-typeStatus").innerHTML = textItems.headTypeStatus[index].bold()
            }
        }
    }
    document.getElementById('zoom-expl-popup').innerHTML = textItems.mapHelpContent[index]
    document.getElementById('large-map-object-button').innerHTML = textItems.largeMapButton[index]
}
// When someone clicks on the language selection
document.querySelector('#language').addEventListener('click', () => {
    if (language === "Norwegian") {
        language = "English"
        document.querySelector('#language').innerHTML = "Norwegian website"
    } else if (language === "English") {
        language = "Norwegian"
        document.querySelector('#language').innerHTML = "English website"
    }
    renderText(language)
    sessionStorage.setItem('language', language)
   
    if (!location.href.includes('showStat') & !location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help') & !location.href.includes('corema') & !location.href.includes('map') & !location.href.includes('journaler') & !location.href.includes('getDOI') & !location.href.includes('showStat') & !location.href.includes('tools') & !location.href.includes('checkCoord') & !location.href.includes('dataError')) {
        if (document.querySelector("#head-nb-hits").innerHTML) {

            if (language === "Norwegian") {
                index = 0
            } else if (language === "English") {
                index = 1
            }

            const headerRow = document.querySelector("#myTable").rows[0]
            cell1 = headerRow.cells[0]
            cell2 = headerRow.cells[1]
            cell3 = headerRow.cells[2]
            cell4 = headerRow.cells[3]
            cell5 = headerRow.cells[4]
            cell6 = headerRow.cells[5]
            cell7 = headerRow.cells[6]
            cell8 = headerRow.cells[7]
            cell9 = headerRow.cells[8]
            cell10 = headerRow.cells[9]
            cell11 = headerRow.cells[10]
 
            stringData = sessionStorage.getItem('string')
            musitData = JSON.parse(stringData)      
            const coll = sessionStorage.getItem('collection')
            if (coll === 'utad') { 
                fillResultHeadersUTAD(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell11,musitData)
            } else if (coll === 'bulk') {
                fillResultHeadersBulk(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell11,musitData)
            } else {
                fillResultHeaders(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell10,cell11,musitData)
            }
        
            
            
            const select = document.getElementById('checkboxSelect')
            pageList = JSON.parse(sessionStorage.getItem('pageList'))
            if(select) {
                select.onchange =() => {
                    checkSeveralBoxes(pageList)
                }
            }
        }
    }
})