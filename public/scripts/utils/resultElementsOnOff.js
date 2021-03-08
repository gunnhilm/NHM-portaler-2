// array with booleans that keeps track of sorting for page rendering
let propsSorted

if (!sessionStorage.getItem('propsSorted')) {
    propsSorted = [
        {id: 'catalogNumber',
        sortedOnce: false,
        sortedTwice: false},
        {id: 'scientificName',
        sortedOnce: false,
        sortedTwice: false},
        {id: 'recordedBy',
        sortedOnce: false,
        sortedTwice: false},
        {id: 'eventDate',
        sortedOnce: false,
        sortedTwice: false},
        {id: 'country',
        sortedOnce: false,
        sortedTwice: false},
        {id: 'county',
        sortedOnce: false,
        sortedTwice: false},
        {id: 'locality',
        sortedOnce: false,
        sortedTwice: false},
        {id: 'associatedMedia',
        sortedOnce: false,
        sortedTwice: false},
        {id: 'decimalLongitude',
        sortedOnce: false,
        sortedTwice: false},
        {id: 'coremaNo',
        sortedOnce: false,
        sortedTwice: false},
        {id: 'sampleType',
        sortedOnce: false,
        sortedTwice: false},
        {id: 'processID',
        sortedOnce: false,
        sortedTwice: false}
    ]
    sessionStorage.setItem('propsSorted', JSON.stringify(propsSorted))
} else { 
    propsSorted = JSON.parse(sessionStorage.getItem('propsSorted'))
}

function resetSortedBoolean () {
    for(i = 0; i < propsSorted.length; i++) {
        propsSorted[i].sortedOnce = false
        propsSorted[i].sortedTwice = false
    }
}

emptyTable = () => {
    table.innerHTML = ""
    nbHitsElement.textContent = ""
    nbHitsHeader.innerHTML = ""
    errorMessage.innerHTML = ""
}

emptyResultElements = () => {
    // hide buttons rendered with search result
    document.getElementById("download-button").style.display = "none"
    document.getElementById("download-photo-button").style.display = "none"
    document.getElementById("head-nb-hits").innerHTML = ""
    document.getElementById("empty-search-button").style.display = "none"
    document.getElementById("zoom-button").style.display = "none"
    document.getElementById("large-map-button").style.display = "none"
    document.getElementById("export-png").style.display = "none"
    document.getElementById("checkedInMap").style.display = "none"
    document.getElementById("first").style.display = "none"
    document.getElementById("previous").style.display = "none"
    document.getElementById("next").style.display = "none"
    document.getElementById("last").style.display = "none"
    document.getElementById("first1").style.display = "none"
    document.getElementById("previous1").style.display = "none"
    document.getElementById("next1").style.display = "none"
    document.getElementById("last1").style.display = "none"
    document.getElementById("resultPageText").innerHTML = ""
    document.getElementById("resultPageNb").innerHTML = ""
    document.getElementById("resultPageAlert").innerHTML = ""
    document.getElementById("resultPageText1").innerHTML = ""
    document.getElementById("resultPageNb1").innerHTML = ""
    document.getElementById("resultPageAlert1").innerHTML = ""
}

showResultElements = () => {
    //document.querySelector('#head-nb-hits').innerHTML = textItems.nbHitsText[index]
    document.querySelector('#download-button').style.display = "block"
    document.querySelector('#download-photo-button').style.display = "block"
    document.getElementById("empty-search-button").style.display = "inline-block"
    document.getElementById("first").style.display = "inline-block"
    document.getElementById("previous").style.display = "inline-block"
    document.getElementById("next").style.display = "inline-block"
    document.getElementById("last").style.display = "inline-block"
    document.getElementById("first1").style.display = "inline-block"
    document.getElementById("previous1").style.display = "inline-block"
    document.getElementById("next1").style.display = "inline-block"
    document.getElementById("last1").style.display = "inline-block"
    document.getElementById("resultPageText").style.display = "inline-block"
    document.getElementById("resultPageText").innerHTML = textItems.page[index]
    document.getElementById("resultPageNb").style.display = "inline-block"
    //document.querySelector('#large-map-button').innerHTML = textItems.largeMapButton[index]
    //document.querySelector('#export-png').innerHTML = textItems.downloadMapButton[index]
    //document.querySelector('#checkedInMap').innerHTML = textItems.checkedInMap[index]   
    // document.getElementById("resultPageNb").innerHTML = " " + currentPage+ '/' + numberOfPages
    document.getElementById("resultPageText1").style.display = "inline-block"
    document.getElementById("resultPageText1").innerHTML = textItems.page[index]
    document.getElementById("resultPageNb1").style.display = "inline-block"
    document.getElementById("resultPageNb1").innerHTML = " " + currentPage + '/' + numberOfPages
    
}

// sort search-result when header button in table is clicked 
sort_by = (prop, reverse, primer) => {
    const key = primer ?
    function(x) {
        return primer(x[prop])
    } :
    function(x) {
        return x[prop]
    }
    reverse = !reverse ? 1: -1
    
    return function(a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a))
    }
}

// add sorting function to buttons in table
function addSortingText(id, prop, musitData) { // her er musitData alle
    document.getElementById(id).addEventListener("click", function() {
        // Show please wait
        document.getElementById("please-wait").style.display = "block"

        let reverse = false
        console.log(propsSorted)
        console.log(prop)
        if (propsSorted.find(x => x.id === prop).sortedOnce) { reverse = true }
        if (id === 'musitIDButton' ) { 
            musitData.sort(sort_by(prop,reverse, parseInt))
        } 
        
        // else if (id === 'sampleTypeButton'){
        //     console.log('sampeltypebutton sort')
        // } 
        else {
            if (id === 'photoButton' | id === 'coordinateButton') {
                reverse = !reverse
            } 

            musitData.sort(sort_by(prop,reverse, (a) => a.toLowerCase()))
        } 

        if (propsSorted.find(x => x.id === prop).sortedOnce === propsSorted.find(x => x.id === prop).sortedTwice) {
            propsSorted.find(x => x.id === prop).sortedOnce = true
            propsSorted.find(x => x.id === prop).sortedTwice = false
        } else {
            propsSorted.find(x => x.id === prop).sortedOnce = !propsSorted.find(x => x.id === prop).sortedOnce
            propsSorted.find(x => x.id === prop).sortedTwice = !propsSorted.find(x => x.id === prop).sortedTwice
        }
        
        currentPage = 1

        for(i = 0; i < propsSorted.length; i++) {
            if(propsSorted[i].id === prop) { continue; }
            propsSorted[i].sortedOnce = false
            propsSorted[i].sortedTwice = false
        }

        subMusitData = musitData.slice(0,numberPerPage)
        sessionStorage.setItem('pageList', JSON.stringify(subMusitData))
        sessionStorage.setItem('string', JSON.stringify(musitData))
        sessionStorage.setItem('propsSorted', JSON.stringify(propsSorted))
        resultTable(subMusitData, musitData) 
        document.getElementById("please-wait").style.display = "none"
    })
}

function getArrows(prop) {
    if (!propsSorted.find(x => x.id === prop).sortedOnce  & !propsSorted.find(x => x.id === prop).sortedTwice) {
        return arrows 
    } else if (propsSorted.find(x => x.id === prop).sortedOnce) {
        return arrowDown
    } else if (propsSorted.find(x => x.id === prop).sortedTwice) {
        return arrowUp
    }
}

fillResultHeaders = (cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell10,cell11,musitData) => {
    cell1.innerHTML = `<button id='musitIDButton' class='sort'>${textItems.headerCatNb[index].bold()} ${getArrows('catalogNumber')} </button>` 
    cell2.innerHTML = `<button id='scientificNameButton' class='sort'>${textItems.headerTaxon[index].bold()} ${getArrows('scientificName')} </button>`
    cell3.innerHTML = `<button id='collectorButton' class='sort'>${textItems.headerCollector[index].bold()} ${getArrows('recordedBy')}</button>`
    cell4.innerHTML = `<button id='dateButton' class='sort'>${textItems.headerDate[index].bold()} ${getArrows('eventDate')}</button>`
    cell5.innerHTML = `<button id='countryButton' class='sort'>${textItems.headerCountry[index].bold()} ${getArrows('country')}</button>`
    cell6.innerHTML = `<button id='municipalityButton' class='sort'>${textItems.headerMunicipality[index].bold()} ${getArrows('county')}</button>`
    cell7.innerHTML = `<button id='localityButton' class='sort'>${textItems.headerLocality[index].bold()} ${getArrows('locality')}</button>`
    cell8.innerHTML = `<button id='photoButton' class='sort'><span class="fas fa-camera"></span>${getArrows('associatedMedia')}</button>`
    cell9.innerHTML = `<button id='coordinateButton' class='sort'><span class="fas fa-compass"></span>${getArrows('decimalLongitude')}</button>`
    //cell10.innerHTML = `<button id='sampleTypeButton' class='sort'>${textItems.headerSampleTypes[index].bold()} </button>`
    
    // if (document.querySelector('#collection-select option:checked').parentElement.label === 'Specimens') {
    //     cell10.innerHTML = `<button id='coremaNoButton' class='sort'>${textItems.headerCoremaNo[index].bold()} ${getArrows('coremaNo')}</button>`
    // } else {
    //     cell10.innerHTML = `<button id='sampleTypeButton' class='sort'>${textItems.headerSampleTypes[index].bold()} ${getArrows('sampleType')}</button>`
    // }
    
    cell11.innerHTML = `<select id='checkboxSelect' class='sort'>
        <option value="select" id="select">${textItems.select[index].bold()}</option>
        <option value="all" id="selectAll">${textItems.selectAll[index]}</option>
        <option value="all_on_page" id="selectAllOnPage">${ textItems.selectAllOnPage[index]}</option>
        <option value="none" id="selectNone">${ textItems.selectNone[index]}</option>
    </select>`
    //investigateChecked()
    // lag overskriftene klikk og sorterbare
    addSortingText('musitIDButton', 'catalogNumber', musitData)  // Tabellen blir sortert på nummer
    addSortingText('scientificNameButton', 'scientificName', musitData)
    addSortingText('collectorButton', 'recordedBy', musitData)
    addSortingText('dateButton', 'eventDate', musitData)
    addSortingText('countryButton', 'country', musitData)
    addSortingText('municipalityButton', 'county', musitData)
    addSortingText('localityButton', 'locality', musitData)
    addSortingText('photoButton', 'associatedMedia', musitData)
    addSortingText('coordinateButton', 'decimalLongitude', musitData)
    

}
