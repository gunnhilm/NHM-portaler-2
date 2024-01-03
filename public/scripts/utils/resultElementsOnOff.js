//resultElementsOnOff.js: Toggles buttons and other elements related to rendering of search–result on and off (displays, or removes), 
// creates an array propsSorted[] with Boolean values that keeps track of on which field the result table is sorted on.

// array with booleans that keeps track of sorting for page rendering
let propsSorted = []
if (!sessionStorage.getItem('propsSorted')) {
 
        propsSorted = [
            {id: 'catalogNumber',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'scientificName',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'identificationQualifier',
            sortedONce: false,
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
            {id: 'habitat',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'associatedMedia',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'identifier',
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
            sortedTwice: false},
            {id: 'Preparations',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'placement',
            sortedOnce: false,
            sortedTwice: false},
            // {id: 'unitType',
            // sortedOnce: false,
            // sortedTwice: false},
            // {id: 'amount',
            // sortedOnce: false,
            // sortedTwice: false},
            {id: 'individualCount',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'stateProvince',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'Note',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'locality_concatenated',
            sortedOnce: false,
            sortedTwice: false},
            // UTAD tabell
            {id: 'vernacularName',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'Tilstand',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'preparationType',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'basisOfRecord',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'Kommentar',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'bredde',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'høyde',
            sortedOnce: false,
            sortedTwice: false},
            {id: 'lengde',
            sortedOnce: false,
            sortedTwice: false}
        ]
    sessionStorage.setItem('propsSorted', JSON.stringify(propsSorted))
} else { 
    propsSorted = JSON.parse(sessionStorage.getItem('propsSorted'))
}

const table = document.getElementById("myTable")

// resets the Boolean sorting values for the resultTable
// is called by doSearch(limit) in search.js
function resetSortedBoolean () {
    for(i = 0; i < propsSorted.length; i++) {
        propsSorted[i].sortedOnce = false
        propsSorted[i].sortedTwice = false
    }
}

// empties table and result-related text-elements
// is called by doSearch(..) in search.js
//      emptySearch(..) in search.js
emptyTable = () => {
    table.innerHTML = ""
    nbHitsElement.textContent = ""
    nbHitsHeader.innerHTML = ""
    errorMessage.innerHTML = ""
}

// hide buttons rendered with search result
// is called by doSearch(..) in search.js
//  emptySearch() in search.js
emptyResultElements = () => {
    document.querySelector('#hits-row').style.display = 'none'
    document.getElementById("loan-button").style.display = "none"
    document.querySelector('#check-coordinates-button').style.display = "none"
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

// display buttons rendered with search result
// is called by resultTable() in paginateAndRender.js
showResultElements = (loan) => {
    document.querySelector('#hits-row').style.display = 'block'
    document.querySelector('#head-nb-hits').innerHTML = textItems.nbHitsText[index]
    if(loan){
        document.querySelector('#loan-button').style.display = "block" 
    }
    // document.querySelector('#check-coordinates-button').style.display = "block"
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
    document.getElementById("resultPageNb").innerHTML = " " + currentPage + '/' + numberOfPages
    document.getElementById("resultPageText1").style.display = "inline-block"
    document.getElementById("resultPageText1").innerHTML = textItems.page[index]
    document.getElementById("resultPageNb1").style.display = "inline-block"
    document.getElementById("resultPageNb1").innerHTML = " " + currentPage + '/' + numberOfPages
    
}

// aids in sorting search-result when header-button in tabel is clicked
// in: prop (number; to find the correct property to sort on, from the propsSorted-array)
// in: reverse (boolean, decides which way data are being sorted)
// in: primer (function; e.g. parseInt that will turn a string into an integer)
// out: sorting order of two elements (?)
// is called by addSortingText(…)
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

// adds sorting-function to buttons that are table-headings in result-table; and contains the sorting-function; search-result is sorted and result re-rendered 
// in: id (string; id of button)
// in: prop (number; to find the correct property to sort on, from the propsSorted-array)
// in: musitData (JSON; searchResult, all of it)
// calls sort_by(prop,reverse,primer)
//  	resultTable(subMusitData, musitData)
// is called by fillResultHeaders(…)
function addSortingText(id, prop, musitData, fromFunction) { // her er musitData alle
    try {
        document.getElementById(id).addEventListener("click", function() {
            if (musitData[0].hasOwnProperty(prop)) {
                // Show please wait
                document.getElementById("please-wait").style.display = "block"
                let reverse = false
                if (propsSorted.find(x => x.id === prop).sortedOnce) { reverse = true }
                if (id === 'musitIDButton' && sessionStorage.getItem("chosenCollection") != "fossiler" &&  !musitData[0].catalogNumber.includes('/')) { 
                    musitData.sort(sort_by(prop,reverse, parseInt))
                    
                }  else if (id === 'breddeButton' || id === 'hoydeButton' || id === 'lengdeButton'  ) {
                    musitData.sort(sort_by(prop,reverse))
                } else {
                    if (id === 'photoButton' | id === 'coordinateButton') {
                        reverse = !reverse
                        musitData.sort(sort_by(prop,reverse))
                    } else {
                        musitData.sort(sort_by(prop,reverse, (a) => a.toLowerCase()))
                        //a.trim().toLowerCase()
                    }
                    
                    //musitData.sort(sort_by(prop,reverse))
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
                if(fromFunction === 'bulkResultTable') {
                    bulkResultTable(subMusitData, musitData)
                } else if (fromFunction === 'UTADRestultTable') {
                    UTADRestultTable(subMusitData, musitData) 
                } else /*if (fromFunction === 'resultTable')*/ {
                    console.log('hit')
                    resultTable(subMusitData, musitData) 
                }
                
                document.getElementById("please-wait").style.display = "none"
            }
            //  else {
            //     errorMessage.innerHTML = "Kan ikke sortere"
            // }
        })
    } catch (error) {
        console.log(error);    
    }
}

// renders image of arrow-up or arrow-down in table –header when result-table is being sorted
// in: prop (string; property of a record in the search result)
// out: image(s)
// is called by fillResultHeaders(…)
function getArrows(prop) {
    if (!propsSorted.find(x => x.id === prop).sortedOnce  & !propsSorted.find(x => x.id === prop).sortedTwice) {
        return arrows 
    } else if (propsSorted.find(x => x.id === prop).sortedOnce) {
        return arrowDown
    } else if (propsSorted.find(x => x.id === prop).sortedTwice) {
        return arrowUp
    }
}


// puts content in headerbuttons in result-table
// calls getArrows(..) for table-header-buttons
// addSortingText(..) for tabel-header-buttons
fillResultHeaders = (org,cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell10,cell11,cell12,cell13,musitData) => {
    
    cell1.innerHTML = `<button id='musitIDButton' class='sort'>${textItems.headerCatNb[index].bold()} ${getArrows('catalogNumber')} </button>` 
    cell2.innerHTML = `<button id='scientificNameButton' class='sort'>${textItems.headerTaxon[index].bold()} ${getArrows('scientificName')} </button>`
    cell3.innerHTML = `<button id='uncertaintyButton' class='sort '>${textItems.headerUncertainty[index].bold()} ${getArrows('identificationQualifier')} </button>` 
    if (org === 'geologi') {
        cell4.innerHTML = `<button id='collectorButton' class='sort'>${textItems.headerCollectorGeo[index].bold()} ${getArrows('recordedBy')}</button>`    
    } else {
        cell4.innerHTML = `<button id='collectorButton' class='sort'>${textItems.headerCollector[index].bold()} ${getArrows('recordedBy')}</button>`
    }
    cell5.innerHTML = `<button id='dateButton' class='sort'>${textItems.headerDate[index].bold()} ${getArrows('eventDate')}</button>`
    cell6.innerHTML = `<button id='countryButton' class='sort'>${textItems.headerCountry[index].bold()} ${getArrows('country')}</button>`
    cell7.innerHTML = `<button id='municipalityButton' class='sort'>${textItems.headerMunicipality[index].bold()} ${getArrows('county')}</button>`
    cell8.innerHTML = `<button id='localityButton' class='sort'>${textItems.headerLocality[index].bold()} ${getArrows('locality')}</button>`
    cell9.innerHTML = `<button id='ecologyButton' class='sort'>${textItems.headerEcology[index].bold()} ${getArrows('habitat')}</button>`
    cell10.innerHTML = `<button id='sampleTypeButton' class='sort'>${textItems.headerSampleTypes[index].bold()} ${getArrows('preparationType')} </button>` 
    cell11.innerHTML = `<button id='photoButton' class='sort'><span class="fas fa-camera"></span>${getArrows('associatedMedia')}</button>`
    cell12.innerHTML = `<button id='coordinateButton' class='sort'><span class="fas fa-compass"></span>${getArrows('decimalLongitude')}</button>`
    cell13.innerHTML = `<select id='checkboxSelect' class='sort'>
        <option value="select" id="select">${textItems.select[index].bold()}</option>
        <option value="all" id="selectAll">${textItems.selectAll[index]}</option>
        <option value="all_on_page" id="selectAllOnPage">${ textItems.selectAllOnPage[index]}</option>
        <option value="none" id="selectNone">${ textItems.selectNone[index]}</option>
    </select>`
    //investigateChecked()
    // lag overskriftene klikk og sorterbare
    addSortingText('musitIDButton', 'catalogNumber', musitData, 'resultTable')  // Tabellen blir sortert på nummer
    addSortingText('scientificNameButton', 'scientificName', musitData, 'resultTable')
    addSortingText('uncertaintyButton', 'identificationQualifier', musitData, 'resultTable')
    addSortingText('collectorButton', 'recordedBy', musitData, 'resultTable')
    addSortingText('dateButton', 'eventDate', musitData, 'resultTable')
    addSortingText('countryButton', 'country', musitData, 'resultTable')
    addSortingText('municipalityButton', 'county', musitData, 'resultTable')
    addSortingText('localityButton', 'locality', musitData, 'resultTable')
    addSortingText('ecologyButton', 'habitat', musitData, 'resultTable')
    if ( !('preparationType' in musitData[0])) {
        addSortingText('sampleTypeButton', 'basisOfRecord', musitData, 'resultTable')
    } else {
        addSortingText('sampleTypeButton', 'preparationType', musitData, 'resultTable')
    }    
    addSortingText('photoButton', 'associatedMedia', musitData, 'resultTable')
    addSortingText('coordinateButton', 'decimalLongitude', musitData, 'resultTable')
}

// puts content in headerbuttons in bulk-result-table
// calls getArrows(..) for table-header-buttons
// addSortingText(..) for tabel-header-buttons
fillResultHeadersBulk = (cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell11,musitData) => {
    cell1.innerHTML = `<button id='musitIDButton' class='sort'>${textItems.headerCatNb[index].bold()} ${getArrows('catalogNumber')} </button>`  
    cell2.innerHTML = `<button id='scientificNameButton' class='sort'>${textItems.headerTaxon[index].bold()} ${getArrows('scientificName')} </button>`
    cell3.innerHTML = `<button id='collectorButton' class='sort'>${textItems.headerCollector[index].bold()} ${getArrows('recordedBy')}</button>`
    cell4.innerHTML = `<button id='dateButton' class='sort'>${textItems.headerDate[index].bold()} ${getArrows('eventDate')}</button>`
    cell5.innerHTML = `<button id='preparationsButton' class='sort'>${textItems.headerPreparations[index].bold()} ${getArrows('Preparations')} </button>`
    cell6.innerHTML = `<button id='localityButton' class='sort'>${textItems.headerLocality[index].bold()} ${getArrows('locality')}</button>`
    cell7.innerHTML = `<button id='countButton' class='sort'>${textItems.headerCount[index].bold()} ${getArrows('individualCount')}</button>`
    cell8.innerHTML = `<button id='noteButton' class='sort'>${textItems.headerNotes[index].bold()} ${getArrows('Note')}</button>`
    // if (cell9) {cell9.style.display = 'none'}
    cell11.innerHTML = `<select id='checkboxSelect' class='sort'>
        <option value="select" id="select">${textItems.select[index].bold()}</option>
        <option value="all" id="selectAll">${textItems.selectAll[index]}</option>
        <option value="all_on_page" id="selectAllOnPage">${ textItems.selectAllOnPage[index]}</option>
        <option value="none" id="selectNone">${ textItems.selectNone[index]}</option>
    </select>`
    

    addSortingText('musitIDButton', 'catalogNumber', musitData, 'bulkResultTable')  // Tabellen blir sortert på nummer
    addSortingText('scientificNameButton', 'scientificName', musitData, 'bulkResultTable')
    addSortingText('preparationsButton', 'Preparations', musitData, 'bulkResultTable')
    addSortingText('collectorButton', 'recordedBy', musitData, 'bulkResultTable')
    addSortingText('dateButton', 'eventDate', musitData, 'bulkResultTable')
    addSortingText('localityButton', 'locality', musitData, 'bulkResultTable')
    addSortingText('countButton', 'individualCount', musitData, 'bulkResultTable')
    addSortingText('noteButton', 'Note', musitData, 'bulkResultTable')
}

// puts content in headerbuttons in utad-result-table
// calls getArrows(..) for table-header-buttons
// addSortingText(..) for table-header-buttons
fillResultHeadersUTAD = (cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell11,UTADData) => {
    cell1.innerHTML = `<button id='musitIDButton' class='sort'>${textItems.headerCatNb[index].bold()} ${getArrows('catalogNumber')} </button>`  
    cell2.innerHTML = `<button id='vernacularNameButton' class='sort'>${textItems.vernacularName[index].bold()} ${getArrows('vernacularName')} </button>`
    cell3.innerHTML = `<button id='tilstandButton' class='sort'>${textItems.Tilstand[index].bold()} ${getArrows('Tilstand')} </button>`
    cell4.innerHTML = `<button id='objektTypeButton' class='sort'>${textItems.basisOfRecord[index].bold()} ${getArrows('basisOfRecord')} </button>`
    cell5.innerHTML = `<button id='noteButton' class='sort'>${textItems.Kommentar[index].bold()} ${getArrows('Kommentar')}</button>`
    cell6.innerHTML = `<button id='breddeButton' class='sort'>${textItems.bredde[index].bold()} ${getArrows('bredde')}</button>`
    cell7.innerHTML = `<button id='hoydeButton' class='sort'>${textItems.hoyde[index].bold()} ${getArrows('høyde')}</button>`
    cell8.innerHTML = `<button id='lengdeButton' class='sort'>${textItems.lengde[index].bold()} ${getArrows('lengde')}</button>`
    cell9.innerHTML = `<button id='photoButton' class='sort'><span class="fas fa-camera"></span>${getArrows('associatedMedia')}</button>`
    cell11.innerHTML = `<select id='checkboxSelect' class='sort'>
        <option value="select" id="select">${textItems.select[index].bold()}</option>
        <option value="all" id="selectAll">${textItems.selectAll[index]}</option>
        <option value="all_on_page" id="selectAllOnPage">${ textItems.selectAllOnPage[index]}</option>
        <option value="none" id="selectNone">${ textItems.selectNone[index]}</option>
    </select>`

    addSortingText('musitIDButton', 'catalogNumber', UTADData, 'UTADRestultTable')  // Tabellen blir sortert på nummer
    addSortingText('vernacularNameButton', 'vernacularName', UTADData, 'UTADRestultTable')
    addSortingText('tilstandButton', 'Tilstand', UTADData, 'UTADRestultTable')
    addSortingText('objektTypeButton', 'basisOfRecord', UTADData, 'UTADRestultTable')
    addSortingText('noteButton', 'Kommentar', UTADData, 'UTADRestultTable')
    addSortingText('breddeButton', 'bredde', UTADData, 'UTADRestultTable')
    addSortingText('hoydeButton', 'høyde', UTADData, 'UTADRestultTable')
    addSortingText('lengdeButton', 'lengde', UTADData, 'UTADRestultTable')
    addSortingText('photoButton', 'associatedMedia', UTADData, 'UTADRestultTable')
}