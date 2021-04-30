//paginateAndRender.js: Renders result table and contains functionality related to this, e.g. sorting of table and splitting of result into pages.

//const { contentSecurityPolicy } = require("helmet")

// urlPath is defined in textItems.js

// show collections in select dependent on museum
if(!window.location.href.includes('/nhm')) {
    document.querySelector('#coremaopt').style.display = 'none'
    document.querySelector('#DNAopt').style.display = 'none'
    document.querySelector('#GeoPalOpt').style.display = 'none'
    document.querySelector('#alger').style.display = 'none'
    document.querySelector('#fisk').style.display = 'none'
    document.querySelector('#otherOpt').style.display = 'none'
} else {
    document.querySelector('#evertebrater').style.display = 'none'
}

// rendered with result table (used in function resultTable())

const hitsPerPage = document.querySelector('#number-per-page')


// returns itemType for a record, e.g. tissue, egg, sperm, skin etc.
// in: catalogNumber (string, catalogNumber)
//out: itemType (string, e.g. ‘tissue’, ‘egg’)
// is called in resultTable(..) (in the future, when stitching of files is done)
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

// functionality to switch arrows up and down accordint to sorting, in head-buttons in result-table
const arrowUp = `<img id='uio-arrow-up' src='${urlPath}/images/icon-up.svg' width="10" height="10"></img>`
const arrowDown =  `<img id='uio-arrow-down' src='${urlPath}/images/icon-down.svg' width="10" height="10"></img>`
const arrows = arrowUp + arrowDown

// hides column with genetic data in result-table for bergen and tromsø (museums without genetic database (corema))
// in: col_no(number, index of column in result-table)
// is called by resultTable(…)
function hide_column(col_no) {
    const rows = table.getElementsByTagName('tr')
    for (var row=0; row<rows.length;row++) {
        var cells = rows[row].getElementsByTagName('td')
        cells[col_no].style.display = 'none'
    }
}

// // renders result table for bulk- and project collection
// // input: subMusitData
// // input: musitData

// const resultTableBulk = (subMusitData, musitData) => {
//     try {
//         table.innerHTML = ""
//         for (let i = -1; i < pageList.length; i++) {
//             const row = 
//         }
//     }
// }



// renders result table
// input: subMusitData (JSON; part of search result that is rendered on page)
// input: musitData (JSON; searchResult, all of it)
// calls fillResultHeaders(…) or fillREsultHeadersBulk(...) in resultElementOnOff.js
//  investigateChecked(i), to check if boxes should appear as checked
//	hide_column(number) to hide corema-columns when necessary
//	showResultElement() in resultElementOnOff.js
//	drawMap(data) from map.js
//	checkSeveralBoxes(data) to add function to dropdown for checkboxes
//	is called by 
//	drawList()
//	addSortingText(…)
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
                if (document.querySelector('#collection-select').value = 'Bulk') {
                    console.log(musitData)
                    fillResultHeadersBulk(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell11,musitData)
                } else {
                    fillResultHeaders(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell10,cell11,musitData)
                }
                
                // if (document.querySelector('#collection-select option:checked').parentElement.label === 'Specimens') {
                //     addSortingText('coremaNoButton', 10, 'coremaNo', musitData)
                // } else {
                //     addSortingText('sampleTypeButton', 10, 'sampleType', musitData)         
                // }

                //addSortingText('processIDButton', 11, 'processID', musitData)
                
            } else {        // Her kommer innmaten i tabellen, selve resultatene
                let museumURLPath
                if (window.location.href.includes('/um')) { 
                    museumURLPath = urlPath + "/um"
                } else if (window.location.href.includes('tmu')) {
                    museumURLPath = urlPath + "/tmu"
                } else {
                    museumURLPath = urlPath + "/nhm"
                }
                
                
                let prefix
                if (!(/[a-zA-Z]/).test(subMusitData[i].catalogNumber.charAt(0))) {
                    
                    prefix = subMusitData[i].institutionCode + '-' + subMusitData[i].collectionCode + '-'
                } else {
                    prefix = ''
                }

                // collectionCodes = ['V','F','L','B','A','ENT','M','BU','GM-BU']
                // if ( !window.location.href.includes('/um') && !window.location.href.includes('tmu')) {
                //     if( !collectionCodes.includes(subMusitData[i].collectionCode) )  {
                //         prefix = ''
                //     } else {
                //         prefix = subMusitData[i].institutionCode + '-' + subMusitData[i].collectionCode + '-'
                //     }
                // }
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
                if (document.querySelector('#collection-select').value = 'Bulk') {
                    cell5.innerHTML = subMusitData[i].preparations
                    cell6.innerHTML = subMusitData[i].unitType
                    cell7.innerHTML = subMusitData[i].amount
                } else {
                    cell5.innerHTML = subMusitData[i].country
                    if (subMusitData[i].county) {cell6.innerHTML = subMusitData[i].county}
                    cell7.innerHTML = subMusitData[i].locality
                    //corema-cases
                    // if (document.querySelector('#collection-select  option:checked').parentElement.label === 'Specimens og DNA') {
                    //     cell8.innerHTML = `<span class="fas fa-camera"></span>`
                    // }
    
                    if( subMusitData[i].associatedMedia ) {   
                        cell8.innerHTML = `<span class="fas fa-camera"></span>`
                    } else if( subMusitData[i].photoIdentifiers ) {   
                        cell8.innerHTML = `<span class="fas fa-camera"></span>`
                    }
                    if( subMusitData[i].decimalLongitude) {
                        cell9.innerHTML = '<span class="fas fa-compass"></span>'
                    }
                    
                    // if (window.location.href.includes('/nhm')) {
                    //     cell10.innerHTML = 'test'
                    // } else {
                    //     if (document.querySelector('#collection-select  option:checked').parentElement.label === 'Specimens') {
                    //         cell10.innerHTML = subMusitData[i].coremaNo
                    //     } else {
                    //         cell10.innerHTML = itemType(subMusitData[i].catalogNumber)
                    //     }
                       
                    // }
                    
                   
                    
                }
                cell11.innerHTML = `<input type="checkbox" id=checkbox${i} onclick="registerChecked(${i})" ></input>`
                console.log('her')
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
                //cell10.className = 'row-10 row-sampleType'
                cell11.className = 'row-11 row-checkbox'
                
            }
          
        }
        
        // hide corema-link-column for UM and TMU
        if (!window.location.href.includes('/nhm') ) {
            hide_column(9)
        }

        ////////////// remove when stiched files are in place
        if (window.location.href.includes('/nhm')) {
            hide_column(9)
            
        }

        showResultElements()
        document.getElementById("empty-search-button").style.display = "inline-block"
        numberOfPages = getNumberOfPages(numberPerPage)
        
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
    console.log()
    numberPerPage = sessionStorage.getItem('numberPerPage')
} else {
    numberPerPage = 20
}


sessionStorage.setItem('numberPerPage',numberPerPage)
var numberOfPages = 0; // calculates the total number of pages

// fetches search result from session storage, parse it and calculates number of pages to render
function makeList() {
    list.length = 0; // tømme Array
    stringData = sessionStorage.getItem('string')
    // parsing search result
    list = JSON.parse(stringData)   
    numberOfPages = getNumberOfPages(numberPerPage);
}

// returns numberOfPages for rendering results
// out: numberOfPages (number, numberOfPages for rendering results)
// is called by makeList()
//	hitsPerPage-select.eventlistener
//	resultTable(..)
function getNumberOfPages(numberPerPage) {
    return Math.ceil(list.length / numberPerPage);
}

// increases counter for currentPage for rendering results, if necessary puts text in html-element lastPageAlert
// calls load()
// is called in index.hbs when nextPage-button is created
function nextPage() {
    console.log('nextpage()')
    if (currentPage < numberOfPages) {
        currentPage += 1    
        sessionStorage.setItem('currentPage', currentPage)
        load()
    } else {
        document.getElementById("resultPageAlert").innerHTML = textItems.lastPageAlert[index]
    }
}

// decreases counter for currentPage for for rendering results
// calls load()
// is called in index.hbs when previousPage-button is created
function previousPage() {
    currentPage -= 1;
    sessionStorage.setItem('currentPage', currentPage)
    load()
}

// sets currentPage for rendering results
// calls load()
// is called in index.hbs when firstPage-button is created
function firstPage() {
    currentPage = 1;
    sessionStorage.setItem('currentPage', currentPage)
    load()
}

// sets currentPage for rendering results
// calls load()
// is called in index.hbs when lastPage-button is created
function lastPage() {
    currentPage = numberOfPages;
    sessionStorage.setItem('currentPage', currentPage)
    load()
}

// sets sessionStorage’s pageList (part of result that is to be rendered on page) and calls function(s) that render resultTable
// calls check()
//  resultTable(pageList, list)
// is called by
//  hitsPerPage eventlistener
//  load()
function loadList() {
    const begin = ((currentPage - 1) * numberPerPage);
    const end = begin + numberPerPage;
    pageList = list.slice(begin, end);
    sessionStorage.setItem('pageList', JSON.stringify(pageList)) // pageList is the same as subMusitData other places; the part of the search result that is listed on the current page
    resultTable(pageList, list)
    check();
}

// disables page-buttons if necesary
// is called by loadList()
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

// empties search-result, fetches search result from sessionStorage, sets numberOfPages for rendering of results, calls function that call resultTable and sets sessionStorage’s pagelist (what to rendered on page)
// calls getNumberOfPages(..)
//	loadList()
//	is called by nextPage(), previousPage(), firstPage(), lastPage()
function load() {
    list.length = 0 // tømme Array
    stringData = sessionStorage.getItem('string')
    // parsing search result
    list = JSON.parse(stringData)   
    numberOfPages = getNumberOfPages(numberPerPage)
    loadList()
}

hitsPerPage.addEventListener('change', (e) => {
    e.preventDefault()
    if (hitsPerPage.value < 2000){
        console.log('hitsperpage < 2000')
        numberPerPage = hitsPerPage.value
        numberPerPage = numberPerPage - 0 // to make it a number
        console.log(JSON.parse(sessionStorage.getItem('string')).length)
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
// in: i (number; index for searchresult-array)
// out: boolean (true if box should be checked)
// is called by resultTable()
const investigateChecked = (i) => {
    let searchResult = JSON.parse(sessionStorage.getItem('string'))
        let searchResultIndex = i + ((currentPage -1 ) * numberPerPage)
            if (searchResult[searchResultIndex].checked) {
                return true
            } else {
                return false
            }
}

// when checking off a checkbox:
// registers that a (single) checkbox is checked or unchecked
// in: i (number, index for searchresult-array)
// out: boolean (true if box should be checked)
// is called by resultTable() for each record
const registerChecked = (i) => {
    //document.getElementById('checkboxSelect').value = 'select'
    let searchResult = JSON.parse(sessionStorage.getItem('string'))
    let searchResultIndex = i + ((currentPage -1 ) * numberPerPage)
        if (searchResult[searchResultIndex].checked) {
            searchResult[searchResultIndex].checked = false
        } else {
            searchResult[searchResultIndex].checked = true
        }
    sessionStorage.setItem('string', JSON.stringify(searchResult))
}