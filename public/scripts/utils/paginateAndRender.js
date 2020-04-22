// rendered with result table (used in function resultTable())
const table = document.getElementById("myTable")
const hitsPerPage = document.querySelector('#number-per-page')  

// funksjnalitet for å bytte ut pilene  opp og ned
function getArrowDown(i) {
    let arrowDown =  `<img id='uio-arrow-down${i+1}' src='/images/icon-down.svg' width="10" height="10"></img>`
    return (arrowDown)
}
function getArrowUp(i) {
    let arrowUp = `<img id='uio-arrow-up${i+1}' src='/images/icon-up.svg' width="10" height="10"></img>`
    return (arrowUp)
}

// add sorting function to buttons in table
function addSortingText(id, n, prop, musitData) { // her er musitData alle
    document.getElementById(id).addEventListener("click", function() {
        let reverse = false
        if (document.getElementById(`uio-arrow-up${n}`).style.display == "none" & document.getElementById(`uio-arrow-down${n}`).style.display == "inline") { //uio-arrow-down${i+1}
            reverse = true
        } 
        if (id === 'musitIDButton') {       // nummer og tekst må sorters forskjellig
        musitData.sort(sort_by(prop,reverse, parseInt))
        } else {
        musitData.sort(sort_by(prop,reverse, (a) => a.toLowerCase()))
        }
        
        subMusitData = musitData.slice(0,numberPerPage)
    
        resultTable(subMusitData, musitData) // hvordan skal jeg finne submusitdata - jo, finn hva hits per page er, og plukk ut de første x
        if(!reverse) {
            document.getElementById(`uio-arrow-down${n}`).style.display = "inline" //uio-arrow-down${n+1}
            document.getElementById(`uio-arrow-up${n}`).style.display = "none"
        } else {
            document.getElementById(`uio-arrow-up${n}`).style.display = "inline"
            document.getElementById(`uio-arrow-down${n}`).style.display = "none"
        }
        for (i = 1; i < 11; i++) {
            if (i === n) {
                continue
            }
            document.getElementById(`uio-arrow-up${i}`).style.display = "inline"
            document.getElementById(`uio-arrow-down${i}`).style.display = "inline"
        }
    })
}

// sorter tabellen når noen klikker
const sort_by = (prop, reverse, primer) => {
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

// render result table
const resultTable = (subMusitData, musitData) => {    
    try {
        table.innerHTML = "";
        
        for (let i = -1; i < pageList.length; i++) { // vi en tabell med resultaer som er like lang som det vi ba om pageList.length; 
            const row = table.insertRow(-1)
    
            const cell1 = row.insertCell(0)
            const cell2 = row.insertCell(1)
            const cell3 = row.insertCell(2)
            const cell4 = row.insertCell(3)
            const cell5 = row.insertCell(4)
            const cell6 = row.insertCell(5)
            const cell7 = row.insertCell(6)
            const cell8 = row.insertCell(7)
            const cell9 = row.insertCell(8)
            const cell10 = row.insertCell(9)
            const cell11 = row.insertCell(10)
            if (i === -1) {     // her kommer tittellinjen
            
                // -- opp oog ned med pilene
                getArrowDown(i)
                getArrowUp(i)

                cell1.innerHTML = `<button id='musitIDButton' class='sort'>${"MUSIT-ID".bold()} ${getArrowDown(0)} ${getArrowUp(0)}</button>`  
                cell2.innerHTML = `<button id='scientificNameButton' class='sort'>${textItems.headerTaxon[index].bold()} ${getArrowDown(1)} ${getArrowUp(1)}</button>`
                cell3.innerHTML = `<button id='collectorButton' class='sort'>${textItems.headerCollector[index].bold()} ${getArrowDown(2)} ${getArrowUp(2)}</button>`
                cell4.innerHTML = `<button id='dateButton' class='sort'>${textItems.headerDate[index].bold()} ${getArrowDown(3)} ${getArrowUp(3)}</button>`
                cell5.innerHTML = `<button id='countryButton' class='sort'>${textItems.headerCountry[index].bold()} ${getArrowDown(4)} ${getArrowUp(4)}</button>`
                cell6.innerHTML = `<button id='municipalityButton' class='sort'>${textItems.headerMunicipality[index].bold()} ${getArrowDown(5)} ${getArrowUp(5)}</button>`
                cell7.innerHTML = `<button id='localityButton' class='sort'>${textItems.headerLocality[index].bold()} ${getArrowDown(6)} ${getArrowUp(6)}</button>`
                cell8.innerHTML = `<button id='photoButton' class='sort'><span class="fas fa-camera"></span>${getArrowDown(7)} ${getArrowUp(7)}</button>`
                cell9.innerHTML = `<button id='coordinateButton' class='sort'><span class="fas fa-compass"></span>${getArrowDown(8)} ${getArrowUp(8)}</button>`
                cell10.innerHTML = `<button id='accnoButton' class='sort'>${textItems.headerCoremaAccno[index].bold()} ${getArrowDown(9)} ${getArrowUp(9)}</button>`
                cell11.innerHTML = `<button id='processIDButton' class='sort'>${textItems.headerSequence[index].bold()} ${getArrowDown(10)} ${getArrowUp(10)}</button>`

                // lag overskrifene klikk og sorterbare
                
                addSortingText('scientificNameButton', 2, 'scientificName', musitData)
                addSortingText('collectorButton', 3, 'recordedBy', musitData)
                addSortingText('dateButton', 4, 'eventDate', musitData)
                addSortingText('countryButton', 5, 'country', musitData)
                addSortingText('municipalityButton', 6, 'county', musitData)
                addSortingText('localityButton', 7, 'locality', musitData)
                addSortingText('photoButton', 8, 'associatedMedia', musitData)
                addSortingText('coordinateButton', 9, 'decimalLongitude', musitData)
                // addSortingText('accnoButton', 10, 'accno', musitData)
                // addSortingText('processIDButton', 11, 'processID', musitData)
                addSortingText('musitIDButton', 1, 'catalogNumber', musitData)  // Tabbellen blir sortert på nummer


            } else {        // Her kommer innmaten i tabellen, selve resultatene
                cell1.innerHTML =  `<a id="object-link" href="/object/?id=${subMusitData[i].catalogNumber}"> ${subMusitData[i].catalogNumber} </a>`
                cell2.innerHTML = subMusitData[i].scientificName
                if (subMusitData[i].recordedBy.includes(",")) {
                    let x = subMusitData[i].recordedBy.indexOf(",")
                    let y = subMusitData[i].recordedBy.substr(0,x)
                    cell3.innerHTML = y + " et al."    
                } else {
                    cell3.innerHTML = subMusitData[i].recordedBy
                }
                
                cell4.innerHTML = subMusitData[i].eventDate
                cell5.innerHTML = subMusitData[i].country
                cell6.innerHTML = subMusitData[i].county
                cell7.innerHTML = subMusitData[i].locality
                if( subMusitData[i].associatedMedia) {
                    cell8.innerHTML = `<span class="fas fa-camera"></span>`
                }
                if( subMusitData[i].decimalLongitude) {
                    cell9.innerHTML = '<span class="fas fa-compass"></span>'
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
                cell10.className = 'row-10 row-accNo'
                cell11.className = 'row-11 row-processID'
            }
        }
        // Show download button
        downloadButton.style.display = "block"
        document.getElementById("empty-search-button").style.display = "inline-block"
        document.getElementById("first").style.display = "inline-block"
        document.getElementById("previous").style.display = "inline-block"
        document.getElementById("next").style.display = "inline-block"
        document.getElementById("last").style.display = "inline-block"
        document.getElementById("resultPageText").innerHTML = textItems.page[index]
        document.getElementById("resultPageNb").innerHTML = " " + currentPage
        numberOfPages = getNumberOfPages(numberPerPage)
        if (currentPage === numberOfPages) { 
            document.getElementById("resultPageAlert").innerHTML = textItems.lastPageAlert[index]
        } else {
            document.getElementById("resultPageAlert").innerHTML = ""
        }

        if (!searchFailed) {
            drawMap(subMusitData)    
        } 
    }  
    catch(error) {
        errorMessage.innerHTML = textItems.errorRenderResult[index]
        searchFailed = true // is checked when map is drawn 
    }
}


// pagination part
// https://www.thatsoftwaredude.com/content/6125/how-to-paginate-through-a-collection-in-javascript

var list = new Array();
var pageList = new Array();
var currentPage = 1;
let numberPerPage = 20;
var numberOfPages = 0; // calculates the total number of pages

function makeList() {
    list.length = 0; // tømme Array
    stringData = sessionStorage.getItem('string')
    // parsing search result
    list = JSON.parse(stringData)   
    numberOfPages = getNumberOfPages();
}

function getNumberOfPages(numberPerPage) {
    return Math.ceil(list.length / numberPerPage);
}

function nextPage() {
    currentPage += 1;
    loadList();
}

function previousPage() {
    currentPage -= 1;
    loadList();
}

function firstPage() {
    console.log('first');
    
    currentPage = 1;
    loadList();
}

function lastPage() {
    currentPage = numberOfPages;
    loadList();
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
}

function load() {
    makeList();
    loadList();
}

hitsPerPage.addEventListener('change', (e) => {
    e.preventDefault()
    if (hitsPerPage.value < 4000){
        numberPerPage = hitsPerPage.value
        numberPerPage = numberPerPage - 0 // to make it a number
        numberOfPages = getNumberOfPages(numberPerPage)
    } else {
        numberPerPage = 4000
        numberOfPages = 1
    }
    currentPage = 1
    
    
    loadList()
})  