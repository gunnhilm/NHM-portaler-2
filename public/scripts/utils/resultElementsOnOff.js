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
    // document.getElementById("loan-button").style.display = "none"
    // document.querySelector('#check-coordinates-button').style.display = "none"
    // document.getElementById("download-button").style.display = "none"
    // document.getElementById("download-photo-button").style.display = "none"
    document.getElementById("action-select").style.display = "none"
    document.getElementById("head-nb-hits").innerHTML = ""
    document.getElementById("empty-search-button").style.display = "none"
    // document.getElementById("zoom-button").style.display = "none"
    // document.getElementById("large-map-button").style.display = "none"
    // document.getElementById("export-png").style.display = "none"
    // document.getElementById("checkedInMap").style.display = "none"
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

    document.getElementById('action-select').style.display = "block"
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



// adds sorting-function to buttons that are table-headings in result-table; and contains the sorting-function; search-result is sorted and result re-rendered 
// in: id (string; id of button)
// in: prop (string; to find the correct property to sort on, from the propsSorted-array)
// in: musitData (JSON; searchResult, all of it)
//  	resultTable(subMusitData, musitData)
// is called by fillResultHeaders(…)

function addSortingText(id, prop, musitData, fromFunction) {
    try {
        document.getElementById(id).addEventListener("click", function() {
            
            if (musitData.length > 1) {
              
                document.getElementById("please-wait").style.display = "block";

                const header = musitData[0];
                const propIndex = header.indexOf(prop);

                if (propIndex === -1) {
                    console.error(`Property "${prop}" not found in headers.`);
                    return;
                }

                let reverse = false;
                const sortStatus = propsSorted.find(x => x.id === prop);
                if (sortStatus && sortStatus.sortedOnce) { 
                    reverse = true; 
                }

                // Sort the data starting from the second row
                const sortedData = musitData.slice(1).sort((a, b) => {
                    const valA = a[propIndex];
                    const valB = b[propIndex];
                    

                    // Use localeCompare for strings and ensure you handle undefined/null if present.
                    if (typeof valA === 'string' && typeof valB === 'string') {
                        return reverse ? valB.localeCompare(valA) : valA.localeCompare(valB);
                    } else {
                        const numA = parseFloat(valA) || 0; // coerce to number or fallback to 0
                        const numB = parseFloat(valB) || 0;
                        return reverse ? numB - numA : numA - numB;
                    }
                });

                musitData = [header].concat(sortedData); // Concatenate the sorted data with the header

                // Update sorting state
                if (sortStatus && sortStatus.sortedOnce === sortStatus.sortedTwice) {
                    sortStatus.sortedOnce = true;
                    sortStatus.sortedTwice = false;
                } else {
                    sortStatus.sortedOnce = !sortStatus.sortedOnce;
                    sortStatus.sortedTwice = !sortStatus.sortedTwice;
                }

                currentPage = 1; // Reset the current page

                // Reset other propsSorted states
                for (let i = 0; i < propsSorted.length; i++) {
                    if (propsSorted[i].id === prop) { continue; }
                    propsSorted[i].sortedOnce = false;
                    propsSorted[i].sortedTwice = false;
                }

                // Update sessionStorage
                const subMusitData = musitData.slice(0, numberPerPage);
                sessionStorage.setItem('pageList', JSON.stringify(subMusitData));
                sessionStorage.setItem('string', JSON.stringify(musitData));
                sessionStorage.setItem('propsSorted', JSON.stringify(propsSorted));

                // Call the appropriate rendering function
                if (fromFunction === 'bulkResultTable') {
                    bulkResultTable(subMusitData, musitData);
                } else if (fromFunction === 'UTADRestultTable') {
                    UTADRestultTable(subMusitData, musitData);
                } else {
                    resultTable(subMusitData, musitData);
                }

                // Hide please wait message
                document.getElementById("please-wait").style.display = "none";

            }
        });
    } catch (error) {
        console.log('denne knappen feiler: ' + id);
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
fillResultHeaders = (org,headerArray,musitData) => {
    try {
    console.log(headerArray);
    


    headerArray[0].innerHTML = `<button id='musitIDButton' aria-label="sort by catalog Number" class='sort'>${textItems.headerCatNb[index].bold()} ${getArrows('catalogNumber')} </button>` 

    headerArray[1].innerHTML = `<button id='scientificNameButton' aria-label="sort by scientific name" class='sort'>${textItems.headerTaxon[index].bold()} ${getArrows('scientificName')} </button>`
    headerArray[2].innerHTML = `<button id='uncertaintyButton' caria-label="sort by taxon uncertainty"lass='sort '>${textItems.headerUncertainty[index].bold()} ${getArrows('identificationQualifier')} </button>` 
    if (org === 'geologi') {
        headerArray[3].innerHTML = `<button id='collectorButton' aria-label="sort by collector name" class='sort'>${textItems.headerCollectorGeo[index].bold()} ${getArrows('recordedBy')}</button>`    
    } else {
        headerArray[3].innerHTML = `<button id='collectorButton' aria-label="sort by collector name" class='sort'>${textItems.headerCollector[index].bold()} ${getArrows('recordedBy')}</button>`
    }
    headerArray[4].innerHTML = `<button id='dateButton' aria-label="sort by date" class='sort'>${textItems.headerDate[index].bold()} ${getArrows('eventDate')}</button>`
    headerArray[5].innerHTML = `<button id='countryButton' aria-label="sort by country" class='sort'>${textItems.headerCountry[index].bold()} ${getArrows('country')}</button>`
    headerArray[6].innerHTML = `<button id='municipalityButton' aria-label="sort by municipality" class='sort'>${textItems.headerMunicipality[index].bold()} ${getArrows('county')}</button>`
    headerArray[7].innerHTML = `<button id='localityButton' aria-label="sort by locality" class='sort'>${textItems.headerLocality[index].bold()} ${getArrows('locality')}</button>`
    headerArray[8].innerHTML = `<button id='ecologyButton' aria-label="sort by ecology" class='sort'>${textItems.headerEcology[index].bold()} ${getArrows('habitat')}</button>`
    headerArray[9].innerHTML = `<button id='sampleTypeButton' aria-label="sort by sample type" class='sort'>${textItems.headerSampleTypes[index].bold()} ${getArrows('preparationType')} </button>` 
    headerArray[10].innerHTML = `<button id='photoButton' aria-label="sort by photo present or absent" class='sort'><span class="fas fa-camera"></span>${getArrows('associatedMedia')}</button>`
    headerArray[11].innerHTML = `<button id='coordinateButton' aria-label="sort by coordinates present or absent" class='sort'><span class="fas fa-compass"></span>${getArrows('decimalLongitude')}</button>`
    headerArray[12].innerHTML = `<select id='checkboxSelect' aria-label="select item" class='sort'>
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

    if (!musitData[0].includes("preparationType")) {
        addSortingText('sampleTypeButton', 'basisOfRecord', musitData, 'resultTable')
    } else {
        addSortingText('sampleTypeButton', 'preparationType', musitData, 'resultTable')
    }    
    addSortingText('photoButton', 'associatedMedia', musitData, 'resultTable')
    addSortingText('coordinateButton', 'decimalLongitude', musitData, 'resultTable')
} catch (error) {
 console.log(error);
        
}
}

// puts content in headerbuttons in bulk-result-table
// calls getArrows(..) for table-header-buttons headerArray[]
// addSortingText(..) for tabel-header-buttons
fillResultHeadersBulk = (headerArray,musitData) => {
    headerArray[0].innerHTML = `<button id='musitIDButton' aria-label="sort by catalog Number" class='sort'>${textItems.headerCatNb[index].bold()} ${getArrows('catalogNumber')} </button>`  
    headerArray[1].innerHTML = `<button id='scientificNameButton' aria-label="sort by scientific name" class='sort'>${textItems.headerTaxon[index].bold()} ${getArrows('scientificName')} </button>`
    headerArray[2].innerHTML = `<button id='collectorButton' aria-label="sort by collector name" class='sort'>${textItems.headerCollector[index].bold()} ${getArrows('recordedBy')}</button>`
    headerArray[3].innerHTML = `<button id='dateButton' aria-label="sort by date" class='sort'>${textItems.headerDate[index].bold()} ${getArrows('eventDate')}</button>`
    headerArray[4].innerHTML = `<button id='preparationsButton' aria-label="sort by type of preparation" class='sort'>${textItems.headerPreparations[index].bold()} ${getArrows('Preparations')} </button>`
    headerArray[5].innerHTML = `<button id='localityButton' aria-label="sort by locality" class='sort'>${textItems.headerLocality[index].bold()} ${getArrows('locality')}</button>`
    headerArray[6].innerHTML = `<button id='countButton' aria-label="sort by individual count"class='sort'>${textItems.headerCount[index].bold()} ${getArrows('individualCount')}</button>`
    headerArray[7].innerHTML = `<button id='noteButton' aria-label="sort by contens of notes" class='sort'>${textItems.headerNotes[index].bold()} ${getArrows('Note')}</button>`
    headerArray[8].innerHTML = `<select id='checkboxSelect' aria-label="select item" class='sort'>
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
// fillResultHeadersUTAD = (cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell11,UTADData) => {
fillResultHeadersUTAD = (headerArray, UTADData) => {
    headerArray[0].innerHTML = `<button id='musitIDButton' aria-label="sort by catalog Number"  class='sort'>${textItems.headerCatNb[index].bold()} ${getArrows('catalogNumber')} </button>`  
    headerArray[1].innerHTML = `<button id='vernacularNameButton' aria-label="sort by venacular name" class='sort'>${textItems.vernacularName[index].bold()} ${getArrows('vernacularName')} </button>`
    headerArray[2].innerHTML = `<button id='tilstandButton' aria-label="sort by condition"class='sort'>${textItems.Tilstand[index].bold()} ${getArrows('Tilstand')} </button>`
    headerArray[3].innerHTML = `<button id='objektTypeButton' aria-label="sort by object type"class='sort'>${textItems.basisOfRecord[index].bold()} ${getArrows('basisOfRecord')} </button>`
    headerArray[4].innerHTML = `<button id='noteButton'  aria-label="sort by contens of notes" class='sort'>${textItems.Kommentar[index].bold()} ${getArrows('Kommentar')}</button>`
    headerArray[5].innerHTML = `<button id='breddeButton'  aria-label="sort by width" class='sort'>${textItems.bredde[index].bold()} ${getArrows('bredde')}</button>`
    headerArray[6].innerHTML = `<button id='hoydeButton'  aria-label="sort by height" class='sort'>${textItems.hoyde[index].bold()} ${getArrows('høyde')}</button>`
    headerArray[7].innerHTML = `<button id='lengdeButton'  aria-label="sort by length" class='sort'>${textItems.lengde[index].bold()} ${getArrows('lengde')}</button>`
    headerArray[8].innerHTML = `<button id='photoButton'  aria-label="sort by photo present or absent" class='sort'><span class="fas fa-camera"></span>${getArrows('associatedMedia')}</button>`
    headerArray[9].innerHTML = `<select id='checkboxSelect' aria-label="select item" class='sort'>
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


// puts content in headerbuttons in eco_bot-result-table
// calls getArrows(..) for table-header-buttons
// addSortingText(..) for table-header-buttons
fillResultHeadersEco_bot = (headerArray, eco_botData) => {
        try {
        
        headerArray[0].innerHTML = `<button id='musitIDButton' aria-label="sort by catalog Number"  class='sort'>${textItems.headerCatNb[index].bold()} ${getArrows('catalogNumber')} </button>`  
        headerArray[1].innerHTML = `<button id='scientificNameNameButton' aria-label="sort by scientific name" class='sort'>${textItems.scientificName[index].bold()} ${getArrows('scientificName')} </button>`
        headerArray[2].innerHTML = `<button id='higherClassificationButton'  aria-label="sort by kingdom" class='sort'>${textItems.higherClassification[index].bold()} </button>`
        headerArray[3].innerHTML = `<button id='localityButton'  aria-label="sort by locality" class='sort'>${textItems.headerLocality[index].bold()} ${getArrows('locality')}</button>`
        headerArray[4].innerHTML = `<button id='objektTypeButton' aria-label="sort by object type"class='sort'>${textItems.basisOfRecord[index].bold()} ${getArrows('basisOfRecord')} </button>`
        headerArray[5].innerHTML = `<button id='recordedByButton' aria-label="sort by object type"class='sort'>${textItems.recordedBy[index].bold()} ${getArrows('recordedBy')} </button>`
        headerArray[6].innerHTML = `<button id='eventDateButton' aria-label="sort by object type"class='sort'>${textItems.eventDate[index].bold()} ${getArrows('eventDate')} </button>`
        headerArray[7].innerHTML = `<button id='tilstandButton' aria-label="sort by condition"class='sort'>${textItems.Tilstand[index].bold()} ${getArrows('Tilstand')} </button>`
        headerArray[8].innerHTML = `<button id='noteButton'  aria-label="sort by contens of notes" class='sort'>${textItems.Kommentar[index].bold()} ${getArrows('Kommentar')}</button>`
         
        headerArray[9].innerHTML = `<button id='photoButton'  aria-label="sort by photo present or absent" class='sort'><span class="fas fa-camera"></span>${getArrows('associatedMedia')}</button>`
        headerArray[10].innerHTML = `<select id='checkboxSelect' aria-label="select item" class='sort'>
        <option value="select" id="select">${textItems.select[index].bold()}</option>
        <option value="all" id="selectAll">${textItems.selectAll[index]}</option>
        <option value="all_on_page" id="selectAllOnPage">${ textItems.selectAllOnPage[index]}</option>
        <option value="none" id="selectNone">${ textItems.selectNone[index]}</option>
        </select>`
    
        addSortingText('musitIDButton', 'catalogNumber', eco_botData, 'eco_BotRestultTable')  // Tabellen blir sortert på nummer
        addSortingText('scientificNameNameButton', 'scientificName', eco_botData, 'eco_BotRestultTable')
        // addSortingText('higherClassificationButton', 'higherClassification', eco_botData, 'eco_BotRestultTable')
        addSortingText('localityButton', 'locality', eco_botData, 'eco_BotRestultTable')
        addSortingText('objektTypeButton', 'basisOfRecord', eco_botData, 'eco_BotRestultTable')
        addSortingText('recordedByButton', 'recordedBy', eco_botData, 'eco_BotRestultTable')
        addSortingText('eventDateButton', 'eventDate', eco_botData, 'eco_BotRestultTable')
        addSortingText('tilstandButton', 'Tilstand', eco_botData, 'eco_BotRestultTable')
        addSortingText('noteButton', 'Kommentar', eco_botData, 'eco_BotRestultTable')
        addSortingText('photoButton', 'associatedMedia', eco_botData, 'eco_BotRestultTable')
    } catch (error) {
        console.log('feil i resultElementsOnOff');
        console.log(error);
    }
}