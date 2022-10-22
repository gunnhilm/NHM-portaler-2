// main file for DNA barcode lists: lists over all Norwegian species in a group, and which species and specimens are barcoded from Norway
// four taxa, with separate lists: fungi, mammals, Lepidoptera and Herptiles
// 

// const { resolve } = require("path")

const urlParamsTop = new URLSearchParams(window.location.search)
let table = document.getElementById("barcode-table")
let bcColl = urlParamsTop.get("coll")
let adbFile
const adbFilePath = './src/data/NHM/'

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


document.getElementById("getBarcodeText").innerHTML = "Last updated 17.10.22 <br> <br>Legend: <br>1: Specimens sequenced <br> 2: Sampled specimens, to be sequenced <br> 3: Specimens selected for sampling<br><br> Click on species name to see which specimens are barcoded, and which county (fylke) they are from"


// fetches list of latin and Norwegian names of all Norwegian species of the relevant organismgroup, from backend
// in: nameFile (string)
// out: data (unparsed array of objects, one object per species)
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
                    console.log(data)
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


// Makes a request to server to get the content of fasta.fas
// out: data; content of fasta.fas; array of objects, one object for each species


// fetches data from fasta-file with sequences from BOLD
// out: array with objects, one object per species, containing all specimens sequenced and their sequences
const getFastaData = () => {
    return new Promise(resolve => {
        const url =   urlPath + `/DNAbarcodes/?getFasta=true&coll=${bcColl}`
        fetch(url).then((response) => { 
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {          
                    try {
                        data = JSON.parse(data)
                        console.log(data)
                        resolve(data)
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        })
    })
}


const getCandidates = () => {
    return new Promise(resolve => {
        const url =   urlPath + `/getCandidates/?candidateFile=${adbFilePath}candidates_${bcColl}.txt`
        console.log(url)
        fetch(url).then((response) => { 
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {          
                    try {
                        data = JSON.parse(data)
                        resolve(data)
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        })  
    })
}
// search function for species
// in: searchTerm (string), data (array of objects from fasta-file, one per species sequenced, from bold), nameList (array of objects from getNameList, one per species in Norway, from adb)
// in: data array of objects, one object for each species (speciesname, number of specimens, counties, processids, regnos)
// out: searchResultData (array?): all data in new table, that matches search
// is called in bcSearchListener()
const bcSearch = (searchTerm, data, nameList, candidates) => {
    emptyTable()
    if (!searchTerm) {
        fillTable(nameList, data, candidates)
    } else {
        searchResultData = data.filter(el => el.species.toLowerCase().includes(searchTerm.toLowerCase()))
        let strippedNameList = []
        
        searchResultData.forEach(resultElement => {
            nameObject = nameList.find(nameListElement => nameListElement.latinName === resultElement.species)
            strippedNameList.push(nameObject)
        })
        fillTable(strippedNameList, searchResultData, candidates)
    }
}

//  search-from listener
// in: nameList(array of objects, one from each norwegian species, from adb), data (array of objects, one for each sequenced species, from bold)
const bcSearchListener = (nameList,data, candidates) => {
    document.querySelector('#search-bc-form').addEventListener('submit', (e) => {
        e.preventDefault()
        const searchTerm = document.querySelector('#search-bc-text').value
        bcSearch(searchTerm, data, nameList, candidates)
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
  
}


// fills table with search results 
// in: nameList (array of objects, on for each norwegian species, from adb), data (array of objects, one object for each species, from bold)
// is called in main() and bcSearch()
function fillTable (nameList, data, candidates) {
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
    
    
    let sum = 0
        
    for (i=0;i<nameList.length;i++) {
        addRow(table)
        
        museumURLPath = urlPath + "/nhm"
        // let species = data[i].species.replace(" ","_")
        let spButton = document.createElement('button')
        // spButton.innerHTML = data[i].species
        const species = nameList[i].latinName
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
            // sum up
            sum = sum + fastaObject.number
        } else {
            spButton.style = "background-color:white; border:none; color:red;font-style:italic"
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

    }
    addRow(table)
    cell1.innerHTML = "Sum"
    cell3.innerHTML = sum
    cell3.style="text-align:center"
    cell3.style.border="solid"
}


// empties result-table
// is called in bcSearch()
const emptyTable = () => {
    table.innerHTML = ''
}

function makeFungiButtons (nameList, data, candidates) {
    // if fungi, add Basidiomycota and Ascomycota buttons to page
    let basidioButton = document.createElement("button")    
    // let ascoButton = document.createElement("button")
    let allButton = document.createElement("button")
    let fungiButtonArray = [basidioButton, allButton]
    basidioButton.innerHTML = "Basidiomycetes"
    // ascoButton.innerHTML = "Ascomycetes"
    allButton.innerHTML = "All phyla"
    fungiButtonArray.forEach(el => {
        el.classList.add('blue-button')
        document.getElementById("fungi-buttons").appendChild(el)
        
    })
    basidioButton.style = 'padding: 6px'
    
    basidioButton.onclick = function() {
        console.log('basidio')   
        // make array with only basidionames
        basidioNames = nameList.filter(function(el, index, arr) {
            return el.phylum === 'Basidiomycota'
        })
        // make new data-array with only those names that are in basidioname-array
        // basidioData = data.filter(function(el, index, arr) {
        //     return el.phylum === 'Basidiomycota'
        // })
        emptyTable()
        fillTable(basidioNames, data, candidates)
    }
    // ascoButton.onclick = function() {
    //     console.log('asco')
    //     ascoNames = nameList.filter(function(el, index, arr) {
    //         return el.phylum === 'Ascomycota'
    //     })
    //     emptyTable()
    //     fillTable(ascoNames, data, candidates)
    // }
    allButton.onclick = function() {
        console.log('both phyla')
        emptyTable()
        fillTable(nameList, data, candidates)
    }
}


// main function, is called when page is rendered
async function main() {
    
    // get array with objects with latin and norwegian names of species livingin norway (based on a namefile downloaded from ADB (should be done automatically once a week))
    nameList = await getNamelist(adbFile)
    console.log(nameList.unparsed)    
    data = await getFastaData() //Gjør en request til server om å få innholdet i fasta.fas
    // go through data (list of objects with DNA sequence (?)) and add norwegian names...
    data.forEach(el => {
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
    console.log(candidates.unparsed)
    
    fillTable(nameList.unparsed, data, candidates.unparsed)
    bcSearchListener(nameList.unparsed, data, candidates.unparsed)
    if (bcColl === "sopp") {
        makeFungiButtons(nameList.unparsed, data, candidates.unparsed)        
    }
}

main()
