// main file for DNA barcode lists: lists over all Norwegian species in a group, and which species and specimens are barcoded from Norway
// four taxa, with separate lists: fungi, mammals, Lepidoptera and Herptiles
// 

// const { getBCFileUpdatedDate } = require("../../../../../src/utils/barcoding/barcoding")

// const { resolve } = require("path")


let table = document.getElementById("barcode-table")
let bcColl = urlParamsTop.get("coll")
console.log(bcColl)
let adbFile
let redlistFile = `${adbFilePath}rodliste-2021.txt`
if (bcColl === "sopp") {
    document.getElementById("getBarcodeHeader").innerHTML = textItems.bcHeaderFungi[1] 
    adbFile = `${adbFilePath}ArtsnavnebaseCSV_fungi.txt`
} else if (bcColl === "mammals") {
    document.getElementById("getBarcodeHeader").innerHTML = textItems.bcHeaderMammals[1]
    adbFile = `${adbFilePath}ArtsnavnebaseCSV_mammals.txt`
}
else if (bcColl === "Lep") {
    document.getElementById("getBarcodeHeader").innerHTML = textItems.bcHeaderLep[1]
    adbFile = `${adbFilePath}ArtsnavnebaseCSV_lepidoptera.txt`
}
else if (bcColl === "herptiles") {
    document.getElementById("getBarcodeHeader").innerHTML = textItems.bcHeaderHerptiles[1]
    adbFile = `${adbFilePath}ArtsnavnebaseCSV_herptiles.txt`
}


document.getElementById("getBarcodeText").innerHTML = "Last updated 13.4.23 <br><br><br> Click on species name to see which specimens are barcoded, and which county (fylke) they are from."
listExplDiv = document.createElement('div')

document.querySelector('#search-bc-text').placeholder = 'Search for latin name' //textItems.placeholder[index]

const downloadBCButton = document.createElement("button")
downloadBCButton.id = "downloadBCButton"
downloadBCButton.innerHTML = "Download list to file"
document.getElementById("getBarcodeText").prepend(downloadBCButton)
downloadBCButton.style='float:right'

downloadBCButton.onclick = function() {
    let text = tableToTabSep()
    const element = document.createElement('a')
    // text is the text that is to be downloaded
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', 'missingBarcodes.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
   
    element.click()
    
    document.body.removeChild(element)
}


// fetches list of latin and Norwegian names of all Norwegian species of the relevant organismgroup, from backend (artsdatabanken)
// in: nameFile (string)
// out: data (unparsed array of objects, one object per species, with norwegina name, lating name and phylum)
// is called in main() 
/// nameFile must be saved with UTF-8-BOM in notepad (not notepad++)
async function getNamelist (nameFile) {
    return new Promise (resolve => {
        const url = urlPath + `/getNamelist/?nameFile=${nameFile}`
        fetch(url)
            .then((response) => {
                response.text()
            .then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {
                    data = JSON.parse(data)
                    resolve(data)
                }
            })
        })
        
    })
}

// fetches list of latin names and redliststatus of all Norwegian species of the relevant organismgroup, from backend
// in: nameFile (string)
// out: data (unparsed array of objects, one object per species, with latin name and redlist status)
// is called in main() 
/// nameFile must be saved with UTF-8-BOM in notepad (not notepad++)
async function getRedlist (nameFile) {
    return new Promise (resolve => {
        const url = urlPath + `/getRedlist/?nameFile=${nameFile}`
        fetch(url)
            .then((response) => {
                response.text()
            .then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {
                    data = JSON.parse(data)
                    resolve(data)
                }
            })
        })
        
    })
}

// fetches norwegian name for species, lookup latin name. from Artsnavneliste in Artsdatabanken
// deprecated because it takes too long
// async function getNorwegianName (latinName) {
//     return new Promise(resolve => {
//         const url = urlPath + `/getNorwegianName/?latinName=${latinName}`
//         fetch(url).then((response) => {
//             response.text().then((data) => {
//                 if(data.error) {
//                     return console.log(data.error)
//                 } else {          
//                     try {
//                         data = JSON.parse(data)
//                         resolve(data)
//                     } catch (error) {
//                         console.log(error);
//                     }
//                 }
//             })
//         })
//     })
// }

// search function for species
// in: searchTerm (string), data (array of objects from fasta-file, one per species sequenced, from bold), nameList (array of objects from getNameList, one per species in Norway, from adb)
// in: data array of objects, one object for each species (speciesname, number of specimens, counties, processids, regnos)
// out: searchResultData (array?): all data in new table, that matches search
// is called in bcSearchListener()
const bcSearch = (searchTerm, data, nameList, candidates,fungiOverview) => {
    emptyTable()
    if (!searchTerm) {
        fillTable(nameList, data, candidates, 'search', 'blank','noFungiOverview')
    } else {
        searchResultData = data.filter(el => el.species.toLowerCase().includes(searchTerm.toLowerCase()))
        console.log(searchResultData)
        // construct shorter nameList that match search-criteria
        let strippedNameList = nameList.filter(el => el.latinName.toLowerCase().includes(searchTerm.toLowerCase()))
        // searchResultData.forEach(resultElement => {
        //     nameObject = nameList.find(nameListElement => nameListElement.latinName === resultElement.species)
        //     if (nameObject != undefined) {
        //         strippedNameList.push(nameObject)
        //     } else {
        //         console.log(resultElement.species)
        //     }
        // })
        fillTable(strippedNameList, searchResultData, candidates, 'search','not blank',fungiOverview)
        
    }
}

//  search-from listener
// in: nameList(array of objects, one from each norwegian species, from adb), data (array of objects, one for each sequenced species, from bold)
const bcSearchListener = (nameList,data, candidates,fungiOverview) => {
    document.querySelector('#search-bc-form').addEventListener('submit', (e) => {
        e.preventDefault()
        const searchTerm = document.querySelector('#search-bc-text').value
        bcSearch(searchTerm, data, nameList, candidates,fungiOverview)
        // listExplDiv.innerHTML = "<br>" 
    })
       
}


// adds row to resultTAble
// in: table (DOM-element)
// out: a row is added to the table
// is called in fillTable()
function addRow(table) {
    row = table.insertRow(-1)
    cell1 = row.insertCell(0)
    cell1.style = "border:solid"
    cell2 = row.insertCell(1)
    cell2.style="border:solid"
    cell3 = row.insertCell(2)
    cell3.style="border:solid"
    cell4 = row.insertCell(3)
    cell4.style="border:solid"
    cell5 = row.insertCell(4)
    cell5.style="border:solid"
    cell6 = row.insertCell(5)
    cell6.style="border:solid"
}

// fill main rows in table. for basidiomycetes...
function fillAllNames (nameList, data, candidates, sumSpecimens, fungiOverview) {
    barcodedSpecies = []
    missingBarcodes = []
    for (i=0;i<nameList.length;i++) {
        addRow(table)
        let spButton = document.createElement('button')
        const species = nameList[i].latinName
        spButton.id = i
        spButton.name = species
        spButton.innerHTML = species
        cell2.innerHTML = nameList[i].norwegianName.replace(/['"]+/g, '')
        cell2.style="font-size:13px"
        cell2.style.border="solid"
                // cell2.innerHTML = data[i].norwegianName
        const fastaObject = data.find(el => el.species === nameList[i].latinName)
        if (fastaObject) {
            spButton.onclick = function() {
                // if (bcColl === "herptiles") {bcColl = "dna_fish_herptiles"}
                window.open(href=`${museumURLPath}/bcSpecies/?coll=${bcColl}&id=${species}&lang=${sessionStorage.getItem('language')}`)
            }
            spButton.style = "background-color:white; border:none; color:blue; text-decoration:underline; font-style: italic"
        
            cell3.innerHTML = fastaObject.number
            if (fastaObject.number < 3) {missingBarcodes.push({"species": fastaObject.species, "numberBarcoded": fastaObject.number})}
            // sum up
            sumSpecimens = sumSpecimens + fastaObject.number
            if (!barcodedSpecies.includes(species)) {
                barcodedSpecies.push(species)
            }
        } else {
            spButton.style = "background-color:white; border:none; color:red;font-style:italic"
            missingBarcodes.push({"species": nameList[i].latinName, "numberBarcoded": 0})
        }
        cell1.appendChild(spButton)
        cell1.style ="white-space: nowrap"
        cell1.style.border="solid"
        // cell3.innerHTML = data[i].number
        cell3.style="text-align: center"
        cell3.style.border="solid"
        let candidateObject = candidates.find(candEl => candEl.species === nameList[i].latinName)
        if (candidateObject) {
            cell4.innerHTML = candidateObject.number
            cell4.style="text-align: center"
            cell4.style.border="solid"
        } 
        
        if (Array.isArray(fungiOverview)) {
            
            let overviewObject = fungiOverview.find(el => el.species === nameList[i].latinName)
            if (overviewObject) {
                const countPending = overviewObject.seqLength.filter(item => {
                    if (item === "pending") {
                        return true
                    }
                    return false
                }).length
                if (countPending != 0) {cell4.innerHTML = countPending}
                const countValidated = overviewObject.validationStatus.filter(item => {
                    if (item === "Validert") {   
                      return true
                    }
                    return false
                }).length
                cell5.innerHTML = countValidated
                cell5.style="text-align: center"
                cell5.style.border="solid"
                // const success = overviewObject.seqLength.filter(item => {
                //     if (item.split[0] != 0) {
                //         return true
                //     }
                //     return false
                // }).length
                const failed = overviewObject.seqLength.filter(item => {
                    // if (item === "0[n]" || item === "0" || item === "pending") { // hva er "pending"?
                    if (item === "0[n]" || item === "0") {
                        return true
                    } 
                    return false
                }).length
                if (failed != 0) {cell6.innerHTML = failed}
                
                // else {cell6.innerHTML = success}
                cell6.style="text-align: center"
                cell6.style.border = "solid"

            }
        } else {
            cell5.style.display = 'none'
            cell6.style.display = 'none'
        }
    }
    sessionStorage.setItem("missingBarcodes",JSON.stringify(missingBarcodes))
    
    return { 
        "sumSpecimens":sumSpecimens,
        "sumSpecies":barcodedSpecies.length
    }
}

function fillOnlyBarcoded(data, candidates, sumSpecimens, fungiOverview) {
    barcodedSpecies = []
    for (i=0;i<data.length;i++) {
        addRow(table)
        let spButton = document.createElement('button')
        const species = data[i].species
        spButton.innerHTML = species
        cell2.innerHTML = data[i].norwegianName.replace(/['"]+/g, '')
        cell2.style="font-size:13px"
        cell2.style.border="solid"
        spButton.onclick = function() {
            // if (bcColl === "herptiles") {bcColl = "dna_fish_herptiles"}
            window.open(href=`${museumURLPath}/bcSpecies/?coll=${bcColl}&id=${species}&lang=${sessionStorage.getItem('language')}`)
        }
        spButton.style = "background-color:white; border:none; color:blue; text-decoration:underline; font-style: italic"
        cell3.innerHTML = data[i].number
        // sum up
        sumSpecimens = sumSpecimens + data[i].number
        if (!barcodedSpecies.includes(species)) {
            barcodedSpecies.push(species)
        }
        
    
        cell1.appendChild(spButton)
        cell1.style ="white-space: nowrap"
        cell1.style.border="solid"
        // cell3.innerHTML = data[i].number
        cell3.style="text-align: center"
        cell3.style.border="solid"
        let candidateObject = candidates.find(candEl => candEl.species === species)
        if (candidateObject) {
            cell4.innerHTML = candidateObject.number
            cell4.style="text-align: center"
            cell4.style.border="solid"
        }
        // cell5.style.display = 'none'
        // cell6.style.display = 'none'

        if (Array.isArray(fungiOverview)) {
            
            let overviewObject = fungiOverview.find(el => el.species === species)
            if (overviewObject) {
                const countPending = overviewObject.seqLength.filter(item => {
                    if (item === "pending") {
                        return true
                    }
                    return false
                }).length
                if (countPending != 0) {cell4.innerHTML = countPending}
                const countValidated = overviewObject.validationStatus.filter(item => {
                    if (item === "Validert") {   
                      return true
                    }
                    return false
                }).length
                cell5.innerHTML = countValidated
                cell5.style="text-align: center"
                cell5.style.border="solid"
                
                const failed = overviewObject.seqLength.filter(item => {
                    if (item === "0[n]" || item === "0" || item === "pending") {
                        return true
                    } 
                    return false
                }).length
                if (failed != 0) {cell6.innerHTML = failed}
                cell6.style="text-align: center"
                cell6.style.border = "solid"

            }
        } else {
            cell5.style.display = 'none'
            cell6.style.display = 'none'
        }
    }
    return { 
        "sumSpecimens":sumSpecimens,
        "sumSpecies":barcodedSpecies.length
    }
}
// fills table with search results 
// in: nameList (array of objects, on for each norwegian species, from adb), data (array of objects, one object for each species, from bold)
// is called in main() and bcSearch()
function fillTable (nameList, data, candidates, group, blank,fungiOverview) {
    // header row:
    addRow(table)
    cell1.innerHTML = 'Species'
    cell1.style.fontWeight = "bold"
    // cell1.style = "border:none"
    cell2.innerHTML = 'Norwegian name'
    cell2.style.fontWeight = "bold"
    // cell2.style="font-size:15px"
    cell2.style.border = "solid"
    // cell2.style="word-wrap:break-all"
    cell3.innerHTML = 'Sequenced specimens'
    cell3.style.fontWeight = "bold"
    cell4.innerHTML = 'Awaiting sequencing'
    cell4.style.fontWeight = "bold"
    cell5.innerHTML = 'Validated sequences'
    cell5.style.fontWeight = 'bold'
    cell6.innerHTML = 'Failed sequences'
    cell6.style.fontWeight = "bold"
    if (bcColl != "sopp") {
        cell5.style.display = 'none'
        cell6.style.display = 'none'
    }
    let sumSpecimens = 0
    let sumSpecies = 0
    museumURLPath = urlPath + "/nhm"

    // filling the rest of the rows in the table, AND at the same time sum up numbers for the last row

    // all but fungi:
    // render all on first render
    // basidio: render all
    // all phyla and blank search fungi: not all names
    let sumSpecimensAndSpecies
    if (bcColl === "sopp" && blank === 'blank') { // blank search for fungi
        sumSpecimensAndSpecies = fillOnlyBarcoded(data, candidates, sumSpecimens,fungiOverview)
    } else if (bcColl === "sopp" && group === 'all') { // start fungi-page
        sumSpecimensAndSpecies = fillOnlyBarcoded(data, candidates, sumSpecimens,fungiOverview)
    } else if (group != "asco" && group != "all" ) { // basidio
        sumSpecimensAndSpecies = fillAllNames(nameList, data, candidates, sumSpecimens,fungiOverview)
    } 
    // else if (group === "asco") { 
    //     sumSpecimensAndSpecies = fillAllNames(nameList, data, candidates, sumSpecimens)
    // }
     else if (group === 'all') {
        sumSpecimensAndSpecies = fillAllNames(nameList, data, candidates,sumSpecimens)
    } else {
        sumSpecimensAndSpecies = fillOnlyBarcoded(data, candidates, sumSpecimens)
    }
    addRow(table)
    if (bcColl === "sopp" && group != "Basidio") {
        cell1.innerHTML = ""    
    } else {
        cell1.innerHTML = "<br> # Norwegian species: " + nameList.length
        cell1.style.fontSize = "12px"
    }
    cell3.innerHTML = "# specimens: " + sumSpecimensAndSpecies.sumSpecimens + "<br> # barcoded species: " + sumSpecimensAndSpecies.sumSpecies
    cell3.style="text-align:center"
    cell3.style.border="solid"
    cell3.style.fontSize = "12px"    
    cell5.style.display = 'none'
    cell6.style.display = 'none'
}


// empties result-table
// is called in bcSearch()
const emptyTable = () => {
    table.innerHTML = ''
}

function tableToTabSep() {
    // Variable to store the final tab data
    var csv_data = []
    // Get each row data
    var rows = document.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        // Get each column data
        var cols = rows[i].querySelectorAll('td,th');
        // Stores each csv row data
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
            // Get the text data of each cell of
            // a row and push it to csvrow
            start = cols[j].innerHTML.indexOf('>')+1
            end = cols[j].innerHTML.indexOf('<',start)
            if (cols[j].innerHTML.includes('>')) {
                csvrow.push(cols[j].innerHTML.substring(start,end))
            } else {
                csvrow.push(cols[j].innerHTML);
            }
        }
        // Combine each column value with tab
        csv_data.push(csvrow.join("\t"));
    }
    // combine each row data with new line character
    csv_data = csv_data.join('\n')
    return csv_data
}

function makeFungiButtons (nameList, data, candidates,fungiOverview,redList) {
    // if fungi, add Basidiomycota and All-phyla buttons to page
    let basidioButton = document.createElement("button")    
    // let ascoButton = document.createElement("button")
    let allButton = document.createElement("button")
    let herbButton = document.createElement("button")
    herbButton.id = "herbButton"
    let fungiButtonArray = [ allButton, basidioButton ]
    // let redlistButton = document.createElement("button")
   
    basidioButton.innerHTML = "Basidiomycetes - all Norwegian species"
    // ascoButton.innerHTML = "Ascomycetes"
    allButton.innerHTML = "All barcoded species, all phyla"
    herbButton.innerHTML = "Candidates in Fungarium Oslo.<br> OBS - takes a while!"
    // redlistButton.innerHTML = "Only redlisted species"
    
    fungiButtonArray.forEach(el => {
        el.classList.add('blue-button')
        document.getElementById("fungi-buttons").appendChild(el)
        el.style='float:right'
    })
    // basidioButton.style = 'padding: 6px'
    
    
    document.getElementById("fungi-buttons").appendChild(listExplDiv)
    listExplDiv.innerHTML = "<br><br>All barcoded fungi species in NorBOL:"
    listExplDiv.style = 'font-weight:bold'
    
    basidioButton.onclick = function() {
        listExplDiv.innerHTML = "<br><br>Basidiomycetes - all Norwegian species. Red species means we lack barcode sequence."    
        // make array with only basidionames
      
        basidioNames = nameList.filter(function(el, index, arr) {
            return el.phylum === 'Basidiomycota'
        })
        // make new data-array with only those names that are in basidioname-array
        // basidioData = data.filter(function(el, index, arr) {
        //     return el.phylum === 'Basidiomycota'
        // })
        emptyTable()
        fillTable(basidioNames, data, candidates, 'Basidio', 'not blank', fungiOverview)

        // button to see what we have in Fungarium Oslo
        // document.getElementById("fungi-buttons").append(herbButton)
        listExplDiv.append(herbButton)
        herbButton.style='float:right'
        // button to filter out only redlisted species
        // document.getElementById("fungi-buttons").prepend(redlistButton)
        // redlistButton.style='float:right'
    }
    // ascoButton.onclick = function() {
    //     listExplDiv.innerHTML = "<br><br>Ascomycetes - all barcoded species:"
    //     ascoNames = nameList.filter(function(el, index, arr) {
    //         return el.phylum === 'Ascomycota'
    //     })
    //     console.log(ascoNames)
    //     emptyTable()
    //     fillTable(ascoNames, data, candidates, 'asco')
    // }
    allButton.onclick = function() {
        listExplDiv.innerHTML = "<br><br>All barcoded fungi species in NorBOL:"    
        emptyTable()
        fillTable(nameList, data, candidates, 'asco', 'not blank', 'no fungiOverview')
    }
    herbButton.onclick = function() {
        if (table.rows[0].cells.length < 7) {
            missingBarcodes = sessionStorage.getItem("missingBarcodes")
            expandTable(missingBarcodes)
        }
    }
       // redlistButton.onclick = function() {
    //     listExplDiv.innerHTML = "<br><br>Basidiomycetes - all redlisted Norwegian species. Red species means we lack barcode sequence."    
    //     // make array with only redlisted names
    //   console.log(nameList[0])
    //     redlistNames = nameList.filter(function(el, index, arr) {
    //         return el.latinName // is included in redList. find? -1...?
    //     })
        
    //     // emptyTable()
    //     // fillTable(basidioNames, data, candidates, 'Basidio', 'not blank', fungiOverview)

    // }
}

async function expandTable (missingBarcodes) {
    for (let i = 0; i<table.rows.length-1; i++) {
    //iterate through rows
    //rows would be accessed using the "row" variable assigned in the for loop
        if (i === 0) {
            cell7 = table.rows[i].insertCell(6)
            cell7.style = "border:solid"
            cell7.innerHTML = "# in Fungarium O"
            cell8 = table.rows[i].insertCell(7)
            cell8.style = "border:solid"
            cell8.innerHTML = "Coll-year"
            cell9 = table.rows[i].insertCell(8)
            cell9.style = "border:solid"
            cell9.innerHTML = "# collected after 2009"
        } else {
            if (document.getElementById((i-1))) {
                let  buttonSpecies = document.getElementById((i-1)).name
                if (table.rows[i].cells[2].innerHTML < 3) { // if there are less than three barcodes for that species
                    const url = urlPath + '/advSearch/?searchSpecies=' + buttonSpecies + '&samling=sopp&searchCollector=&searchDate=' +
                    '&searchCountry=&searchCounty=&searchMunicipality=&searchLocality=&searchCollNo=&searchTaxType=&museum=nhm' +
                    '&linjeNumber=0&limit=50&hasPhoto='
                    await fetch(url).then((response) => {
                        if (!response.ok) {
                            throw 'noe går galt med søk, respons ikke ok'
                        } else {
                            try {
                                response.text().then((data) => {
                                    if(data.error) {
                                        errorMessage.innerHTML = textItems.serverError[index]
                                        return console.log(data.error)
                                    } else {
                                        const JSONdata = JSON.parse(data)  
                                        sessionStorage.setItem('searchLineNumber', JSONdata.unparsed.count)
                                        // sessionStorage.setItem('advSearchArray', [searchSpecies,searchCollector,searchDate,searchCountry,searchMunicipality,searchLocality,searchCollNo,searchTaxType])
                                        const parsedResults = Papa.parse(JSONdata.unparsed.results, {
                                            delimiter: "\t",
                                            newline: "\n",
                                            quoteChar: '',
                                            header: true,
                                        }) 
                                        cell7 = table.rows[i].insertCell(6)
                                        let prefix
                                        if (parsedResults.data.length === 50) {prefix = '>'} else {prefix = ''}
                                        cell7.innerHTML = prefix + parsedResults.data.length
                                        cell7.style="text-align: center"
                                        cell7.style.border = "solid"
                                        let range
                                        let dates = []
                                        parsedResults.data.forEach(el => {
                                            dates.push(Number(el.eventDate.substr(0,4)))
                                        })
                                        let newerDates = []
                                        for (ind=0;ind<dates.length;ind++) {
                                            if (dates[ind] > 2009) {newerDates.push(dates[ind])}
                                        }
                                        oldest = Math.min(...dates)
                                        youngest = Math.max(...dates)
                                        if (oldest > 0) {range = `${oldest} - ${youngest}`} else {range = '?- ' + youngest}
                                        
                                        //cell8: Coll-year
                                        cell8 = table.rows[i].insertCell(7)
                                        if (parsedResults.data.length === 0) {cell8.innerHTML = ''} else {cell8.innerHTML = range}
                                        cell8.style="text-align: center; white-space: nowrap"
                                        cell8.style.border = "solid"
                                        // cell8.style.length = '580px'
                                        //cell9: # collected after 2009
                                        cell9 = table.rows[i].insertCell(8)
                                        cell9.innerHTML = newerDates.length
                                        cell9.style="text-align: center"
                                        cell9.style.border = "solid"
                                    }
                                })
                            }
                            catch (error) {
                                console.error(error)
                                reject(error);
                            }
                        }
                        
                    }).catch((error) => {
                        console.log(error);
                        
                    })
                } else { // if there are three or more barcodes for that species. then we don't need more, and don't do any search,
                    // just enter empty cells in the table
                    cell7 = table.rows[i].insertCell(6)
                    cell7.style.border = "solid"
                    cell8 = table.rows[i].insertCell(7)
                    cell8.style.border = "solid"
                    cell9 = table.rows[i].insertCell(8)
                    cell9.style.border = "solid"
                }
            }
            
            
        }
            
        for (var j = 0, col; col = row.cells[j]; j++) {
            //iterate through columns
            //columns would be accessed using the "col" variable assigned in the for loop
        }  
    }
}

// main function, is called when page is rendered
async function main() {
    // get array with objects with latin and norwegian names of species livingin norway (based on a namefile downloaded from ADB (should be done automatically once a week))
    nameList = await getNamelist(adbFile)
    // getFastaData() ligger i barcodesCommonFunctions.js
    data = await getFastaData() //Gjør en request til server om å få innholdet i fasta.fas. 
    fungiOverview = await getOverview() // Makes a request to server to get an array of all species in the fungal-barcoding-overview-file, and number of validated and failed sequences
    redList = await getRedlist(redlistFile)
    // go through data (list of objects with DNA sequence (?)) and add norwegian names...
    data.unparsed.forEach(el => {
        const nameObject = nameList.unparsed.find(element => element.latinName === el.species)
        el.norwegianName = ''
        el.phylum = ''
        if (nameObject) {
            el.norwegianName =  nameObject.norwegianName.replace(/['"]+/g, '')
            el.phylum = nameObject.phylum.replace(/['"]+/g, '')
        }
        
    })
    table.style = "border-collapse: collapse"
    table.bordercolor = "grey"
    const candidates = await getCandidates()
    
    let overviewParameter
    if (bcColl === "sopp") {overviewParameter = fungiOverview} else {overviewParameter = "noFungiOverview"}
    bcSearchListener(nameList.unparsed, data.unparsed, candidates.unparsed,overviewParameter)
    if (bcColl === "sopp") {
        fillTable(nameList.unparsed, data.unparsed, candidates.unparsed, 'all','not blank', fungiOverview)
        makeFungiButtons(nameList.unparsed, data.unparsed, candidates.unparsed,fungiOverview,redList)       
    } else {
        fillTable(nameList.unparsed, data.unparsed, candidates.unparsed, 'all', 'not blank', 'no fungiOverview')
        document.getElementById("fungi-buttons").appendChild(listExplDiv)
        listExplDiv.innerHTML = "<br> <br> Red species means we lack barcode sequence."
    }
    // const soppFile = `./src/utils/barcoding/sopp_oversikt.txt`
    // soppoversiktsDate = getBCFileUpdatedDate(file,(error,date)=> {
    //     if (error) {
    //         return
    //     } else {
    //         return(date)
    //     }
    // })
    
}

main()
