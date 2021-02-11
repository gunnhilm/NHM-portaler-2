// urlPath er definert i textItems.js

// show collections in select dependent on museum
if(window.location.href.includes('tmu') | window.location.href.includes('um')) {
    document.querySelector('#coremaopt').style.display = 'none'
    document.querySelector('#DNAopt').style.display = 'none'
    document.querySelector('#alger').style.display = 'none'
} else {
    document.querySelector('#evertebrater').style.display = 'none'
}

// rendered with result table (used in function resultTable())
const table = document.getElementById("myTable")
const hitsPerPage = document.querySelector('#number-per-page')

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

function itemType (catalogNumber) {
    const s = catalogNumber.charAt(catalogNumber.length-1)
    let itemType = (s === 'B') ? textItems.b[index] : (s === 'D') ? 'DNA' : (s === 'P') ? textItems.p[index] : 
        (s === 'E') ? 'Egg' : (s === 'S') ? 'Sperm' : (s === 'O') ? textItems.o[index] : (s === 'OB') ? textItems.ob[index] :
        (s === 'F') ? textItems.f[index] : (s === 'O') ? textItems.o[index] : (s === 'N') ? textItems.n[index] :
        (s === 'PE') ? 'Pellet' : (s === 'OT') ? textItems.ot[index] : (s === 'SS') ? 'Sperm slide' : (s === 'SR') ? textItems.sr[index] :
        (s === 'SI') ? textItems.si[index] : (s === 'T') ? textItems.t[index] : (s === 'TS') ? textItems.ts[index] :
        (s === 'EP') ? textItems.ep[index] : (s === 'SG') ? 'Seminal glomera' : (s === 'BS') ? textItems.bs[index] :
        (s === 'FA') ? 'Faeces' : (s === 'CF') ? textItems.cf[index] : (s === 'U') ? textItems.u[index] : ""

    return itemType
}

// funksjonalitet for å bytte ut pilene  opp og ned
const arrowUp = `<img id='uio-arrow-up' src='${urlPath}/images/icon-up.svg' width="10" height="10"></img>`
const arrowDown =  `<img id='uio-arrow-down' src='${urlPath}/images/icon-down.svg' width="10" height="10"></img>`
const arrows = arrowUp + arrowDown

function getArrows(prop) {
    if (!propsSorted.find(x => x.id === prop).sortedOnce  & !propsSorted.find(x => x.id === prop).sortedTwice) {
        return arrows 
    } else if (propsSorted.find(x => x.id === prop).sortedOnce) {
        return arrowDown
    } else if (propsSorted.find(x => x.id === prop).sortedTwice) {
        return arrowUp
    }
}

// add sorting function to buttons in table
function addSortingText(id, n, prop, musitData) { // her er musitData alle
    document.getElementById(id).addEventListener("click", function() {
        // Show please wait
        document.getElementById("please-wait").style.display = "block"

        let reverse = false

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
        
        sessionStorage.setItem('string', JSON.stringify(musitData))
        sessionStorage.setItem('propsSorted', JSON.stringify(propsSorted))
        resultTable(subMusitData, musitData) 
        document.getElementById("please-wait").style.display = "none"
    })
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

// hide column (for museums without genetic database)
function hide_column(col_no) {
    const rows = table.getElementsByTagName('tr')
    for (var row=0; row<rows.length;row++) {
        var cells = rows[row].getElementsByTagName('td')
        cells[col_no].style.display = 'none'
    }
}

// render result table
const resultTable = (subMusitData, musitData) => {    
    try {
        
        table.innerHTML = "";
        for (let i = -1; i < pageList.length; i++) { // vis en tabell med resultater som er like lang som det vi ba om pageList.length; 
            const row = table.insertRow(-1)
            const cell1 = row.insertCell(0)
            const cell2 = row.insertCell(1)
            const cell3 = row.insertCell(2)
            cell3.className += "cell3"
            const cell4 = row.insertCell(3)
            const cell5 = row.insertCell(4)
            cell5.className += "cell5";
            const cell6 = row.insertCell(5)
            const cell7 = row.insertCell(6)
            const cell8 = row.insertCell(7)
            const cell9 = row.insertCell(8)
            const cell10 = row.insertCell(9)
            cell10.className += "cell10";
            const cell11 = row.insertCell(10)
            
            if (i === -1) {     // her kommer tittellinjen
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
                
                if (document.querySelector('#collection-select option:checked').parentElement.label === 'Specimens') {
                    cell10.innerHTML = `<button id='coremaNoButton' class='sort'>${textItems.headerCoremaNo[index].bold()} ${getArrows('coremaNo')}</button>`
                } else {
                    cell10.innerHTML = `<button id='sampleTypeButton' class='sort'>${textItems.headerSampleTypes[index].bold()} ${getArrows('sampleType')}</button>`
                }
                
                cell11.innerHTML = `<select id='checkboxSelect' class='sort'>
                    <option value="select" id="select">${textItems.select[index].bold()}</option>
                    <option value="all" id="selectAll">${textItems.selectAll[index]}</option>
                    <option value="all_on_page" id="selectAllOnPage">${ textItems.selectAllOnPage[index]}</option>
                    <option value="none" id="selectNone">${ textItems.selectNone[index]}</option>
                </select>`
                //investigateChecked()
                // lag overskriftene klikk og sorterbare
                addSortingText('musitIDButton', 1, 'catalogNumber', musitData)  // Tabellen blir sortert på nummer
                addSortingText('scientificNameButton', 2, 'scientificName', musitData)
                addSortingText('collectorButton', 3, 'recordedBy', musitData)
                addSortingText('dateButton', 4, 'eventDate', musitData)
                addSortingText('countryButton', 5, 'country', musitData)
                addSortingText('municipalityButton', 6, 'county', musitData)
                addSortingText('localityButton', 7, 'locality', musitData)
                addSortingText('photoButton', 8, 'associatedMedia', musitData)
                addSortingText('coordinateButton', 9, 'decimalLongitude', musitData)
                

                if (document.querySelector('#collection-select option:checked').parentElement.label === 'Specimens') {
                    addSortingText('coremaNoButton', 10, 'coremaNo', musitData)
                } else {
                    addSortingText('sampleTypeButton', 10, 'sampleType', musitData)         
                }

                //addSortingText('processIDButton', 11, 'processID', musitData)
                
            } else {        // Her kommer innmaten i tabellen, selve resultatene
                let museumURLPath
                if (window.location.href.includes('um')) { 
                    museumURLPath = urlPath + "/um"
                } else if (window.location.href.includes('tmu')) {
                    museumURLPath = urlPath + "/tmu"
                } else {
                    museumURLPath = urlPath + "/nhm"
                }
                
                let prefix
                collectionCodes = ['V','F','L','B','A','ENT']
                if ( !window.location.href.includes('um') && !window.location.href.includes('tmu')) {
                    if( !collectionCodes.includes(subMusitData[i].collectionCode) )  {
                        prefix = ''
                    } else {
                        prefix = subMusitData[i].institutionCode + '-' + subMusitData[i].collectionCode + '-'
                    }
                }
                
                cell1.innerHTML =  `<a id="object-link" href="${museumURLPath}/object/?id=${subMusitData[i].catalogNumber}"> ${prefix}${subMusitData[i].catalogNumber} </a>`
                cell2.innerHTML = subMusitData[i].scientificName
                // // to avoid lots of text in collector-field I tried to cut it down to one name et al. but in corema collector is often "Johannessen, Lars Erik", so looking for comma does not work
                // if (subMusitData[i].recordedBy.includes(",")) {
                //     let x = subMusitData[i].recordedBy.indexOf(",")
                //     let y = subMusitData[i].recordedBy.substr(0,x)
                //     cell3.innerHTML = y + " et al."    
                // } else {
                    cell3.innerHTML = subMusitData[i].recordedBy
                //}
                
                cell4.innerHTML = subMusitData[i].eventDate
                cell5.innerHTML = subMusitData[i].country
                cell6.innerHTML = subMusitData[i].county
                cell7.innerHTML = subMusitData[i].locality
                if( subMusitData[i].associatedMedia ) {    
                    cell8.innerHTML = `<span class="fas fa-camera"></span>`
                } else if( subMusitData[i].photoIdentifiers ) {   
                    cell8.innerHTML = `<span class="fas fa-camera"></span>`
                }
                if( subMusitData[i].decimalLongitude) {
                    cell9.innerHTML = '<span class="fas fa-compass"></span>'
                }
                
                if (window.location.href.includes('nhm')) {
                    cell10.innerHTML = 'test'
                } else {
                    if (document.querySelector('#collection-select  option:checked').parentElement.label === 'Specimens') {
                        cell10.innerHTML = subMusitData[i].coremaNo
                    } else {
                        cell10.innerHTML = itemType(subMusitData[i].catalogNumber)
                    }
                   
                }
                
                cell11.innerHTML = `<input type="checkbox" id=checkbox${i} onclick="registerChecked(${i})" ></input>`
                
                if (investigateChecked(i)) {
                    document.getElementById(`checkbox${i}`).checked = true
                } else {
                    document.getElementById(`checkbox${i}`).checked = false
                }
                
                cell1.className = 'row-1 row-ID'
                cell2.className = 'row-2 row-name'
                cell3.className = 'row-3 row-innsamler'
                cell4.className = 'row-4 row-dato'
                cell5.className = 'row-5 row-land'
                cell6.className = 'row-6 row-kommune'
                cell7.className = 'row-7 row-sted'
                cell8.className = 'row-8 row-photo'
                cell9.className = 'row-9 row-coordinates'
                cell10.className = 'row-10 row-sampleType'
                cell11.className = 'row-11 row-checkbox'
            }
        }
        
        // hide corema-link-column for UM and TMU
        if (window.location.href.includes('um') || window.location.href.includes('tmu')) {
            hide_column(9)
        }

        ////////////// remove when stiched files are in place
        if (window.location.href.includes('nhm')) {
            hide_column(9)
        }

        // Show download button
        downloadButton.style.display = "block"
        downloadPhotoButton.style.display = "block"
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
        numberOfPages = getNumberOfPages(numberPerPage)
        document.getElementById("resultPageNb").innerHTML = " " + currentPage+ '/' + numberOfPages
        document.getElementById("resultPageText1").style.display = "inline-block"
        document.getElementById("resultPageText1").innerHTML = textItems.page[index]
        document.getElementById("resultPageNb1").style.display = "inline-block"
        document.getElementById("resultPageNb1").innerHTML = " " + currentPage + '/' + numberOfPages
            
        
        if (!searchFailed) {
            try {
                drawMap(musitData) 
            } catch (error) {
                console.error(error)
                reject(error);
            }
        } 
        
    }  
    catch(error) {
        console.log('er vi her?')
        errorMessage.innerHTML = textItems.errorRenderResult[index]
        searchFailed = true // is checked when map is drawn 
    }

    const select = document.getElementById('checkboxSelect')
    if(select) {
        select.onchange =() => {
            checkSeveralBoxes(subMusitData)
        }
    }

}


// pagination part
// https://www.thatsoftwaredude.com/content/6125/how-to-paginate-through-a-collection-in-javascript

let list = new Array();
let pageList = new Array();

if (sessionStorage.getItem('currentPage')) {
    currentPage = sessionStorage.getItem('currentPage')
} else {
    currentPage = 1
}
let numberPerPage
if (sessionStorage.getItem('numberPerPage')) {
    numberPerPage = sessionStorage.getItem('numberPerPage')
} else {
    numberPerPage = 20
}


sessionStorage.setItem('numberPerPage',numberPerPage)
var numberOfPages = 0; // calculates the total number of pages

function makeList() {
    
    list.length = 0; // tømme Array
    stringData = sessionStorage.getItem('string')
    // parsing search result
    list = JSON.parse(stringData)   
    numberOfPages = getNumberOfPages(numberPerPage);
}

function getNumberOfPages(numberPerPage) {
    return Math.ceil(list.length / numberPerPage);
}

function nextPage() {
    if (currentPage < numberOfPages) {
        currentPage += 1    
        sessionStorage.setItem('currentPage', currentPage)
        //loadList();
        load()
    } else {
        document.getElementById("resultPageAlert").innerHTML = textItems.lastPageAlert[index]
    }
}

function previousPage() {
    currentPage -= 1;
    sessionStorage.setItem('currentPage', currentPage)
    //loadList();
    load()
}

function firstPage() {
    currentPage = 1;
    sessionStorage.setItem('currentPage', currentPage)
    //loadList();
    load()
}

function lastPage() {
    currentPage = numberOfPages;
    sessionStorage.setItem('currentPage', currentPage)
    //loadList();
    load()
}

function loadList() {
    const begin = ((currentPage - 1) * numberPerPage);
    const end = begin + numberPerPage;
    pageList = list.slice(begin, end);
    drawList();
    check();
}

function drawList() {
    
    resultTable(pageList, list)
}

function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("next1").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous1").disabled = currentPage == 1 ? true : false;
    document.getElementById("first1").disabled = currentPage == 1 ? true : false;
    document.getElementById("last1").disabled = currentPage == numberOfPages ? true : false;

}

function load() {
    
    makeList();
    loadList();
}

hitsPerPage.addEventListener('change', (e) => {
    e.preventDefault()
    if (hitsPerPage.value < 2000){
        console.log('hitsperpage < 2000')
        numberPerPage = hitsPerPage.value
        numberPerPage = numberPerPage - 0 // to make it a number
        numberOfPages = getNumberOfPages(numberPerPage)
    } else {
        numberPerPage = 2000
        console.log('setting numberperpage to 2000')
        numberOfPages = 1
    }
    currentPage = 1
    sessionStorage.setItem('numberPerPage', numberPerPage)
    
    loadList()
})  

// check if checkbox should be checked when rendering result (i.e. navigating between pages in search result)
const investigateChecked = (i) => {
    let searchResult = JSON.parse(sessionStorage.getItem('string'))
    
        let searchResultIndex = i + ((currentPage -1 ) * numberPerPage)
            if (searchResult[searchResultIndex].checked) {
                return true
            } else {
                return false
            }
}

// when checking off a checkbox
const registerChecked = (i) => {
    document.getElementById('checkboxSelect').value = 'select'
    let searchResult = JSON.parse(sessionStorage.getItem('string'))
    let searchResultIndex = i + ((currentPage -1 ) * numberPerPage)
        if (searchResult[searchResultIndex].checked) {
            searchResult[searchResultIndex].checked = false
        } else {
            searchResult[searchResultIndex].checked = true
        }
    sessionStorage.setItem('string', JSON.stringify(searchResult))
}