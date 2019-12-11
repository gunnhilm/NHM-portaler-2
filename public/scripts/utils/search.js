console.log('client side javascript is loaded')

// names for DOM elements (?) for search

// on page initially
const samling = document.querySelector('#collection-select') //engelsk
const searchForm = document.querySelector('form') //// bruk konsekvent querySelector eller get elementbyid?
const search = document.querySelector('input')

// rendered with result table (used in function resultTable())
const resultHeader = document.getElementById("resultHeader")
const antall = document.querySelector('#antall-treff') //engelsk
const nbHits = document.getElementById("nbHits")
const table = document.getElementById("myTable")

// for the download button
const lastNed = document.getElementById('downloadButton')

// rendered with result table, in footer
const oppdatert = document.querySelector('#sist-oppdatert') //engelsk

// decides which language is rendered
language = document.querySelector('#language').value




// render result table
const resultTable = (data) => {

           stringData = JSON.stringify(data)
        sessionStorage.setItem('string', stringData)    // Save searchresult to local storage
    
    const antallTreff = data.length
    antall.textContent = antallTreff
    
    resultHeader.innerHTML = textItems.searchResultHeadline[index]
    nbHits.innerHTML = textItems.nbHitsText[index]

    table.innerHTML = "";
    for (i = -1; i < antallTreff; i++) {
        const row = table.insertRow(-1)

        const cell1 = row.insertCell(0)
        const cell2 = row.insertCell(1)
        const cell3 = row.insertCell(2)
        const cell4 = row.insertCell(3)
        const cell5 = row.insertCell(4)
        const cell6 = row.insertCell(5)
        const cell7 = row.insertCell(6)
        if (i === -1) {
            // header row
            cell1.innerHTML = 'MUSIT-ID'.bold()
            cell2.innerHTML = textItems.headerTaxon[index].bold()
            cell3.innerHTML = textItems.headerCollector[index].bold()
            cell4.innerHTML = textItems.headerDate[index].bold()
            cell5.innerHTML = textItems.headerCountry[index].bold()
            cell6.innerHTML = textItems.headerMunicipality[index].bold()
            cell7.innerHTML = textItems.headerLocality[index].bold()

        } else {
            cell1.innerHTML =  `<a id="objekt-link" href="http://localhost:3000/object/?id=${i}"> ${data[i].catalogNumber} </a>`
            cell2.innerHTML = data[i].scientificName
            cell3.innerHTML = data[i].recordedBy
            cell4.innerHTML = data[i].eventDate
            cell5.innerHTML = data[i].country
            cell6.innerHTML = data[i].county
            cell7.innerHTML = data[i].locality

            // gir de klassen resultTable så de kan styles
            cell1.className = 'row-1 row-ID';
            cell2.className = 'row-2 row-name';
            cell3.className = 'row-3 row-innsamler';
            cell4.className = 'row-4 row-dato';
            cell5.className = 'row-5 row-land';
            cell6.className = 'row-6 row-kommune';
            cell7.className = 'row-7 row-sted';


        }
    }    
}

// vise tidligere søk
// const oldSearch = () => {
//     if (localStorage.getItem('string') === null) {
//     // henter søkeresultatet fra minne
//     stringData = sessionStorage.getItem('string')
//     // parser søkresultatet
//     data = JSON.parse(stringData)
//     // sender det til funksjonen som viser reultatene
//     resultTable(data)
//     }
// }

// //kjør funksjonen
// oldSearch() 


// download search-result to file
function download(filename, text) {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)
    
    element.style.display = 'none'
    document.body.appendChild(element)
   
    element.click()
    
    document.body.removeChild(element)
}


// when download-button is clicked
lastNed.addEventListener('click', (e) => {
    e.preventDefault()
    const searchTerm = search.value
    const valgtSamling = samling.value
    
    const url = 'http://localhost:3000/download/?search=' + searchTerm +'&samling=' + valgtSamling
    fetch(url).then((response) => {
            
        response.text().then((data) => {
            if(data.error) {
                return console.log(data.error)
            } else {
                const downloadData = JSON.parse(data).unparsed
                // Start file download.
                download("download.txt", downloadData)
            }
        })
    })
})

// når noen trykker på søk knappen 
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // slett de forrige søkeresultatene
    sessionStorage.clear() 
    const searchTerm = search.value
    const valgtSamling = samling.value

    // empty table
    table.innerHTML = ""
    resultHeader.innerHTML = ""
    antall.textContent = ""
    nbHits.innerHTML = ""

    // Show please wait
    document.getElementById("pleaseWait").style.display = "block"
    // hide download button
    document.getElementById("downloadButton").style.display = "none"

    // mustChoose
      if (!valgtSamling) {
        resultHeader.innerHTML = textItems.mustChoose[index]
        document.getElementById("pleaseWait").style.display = "none"
    } else {
        const url = 'http://localhost:3000/search/?search=' + searchTerm +'&samling=' + valgtSamling
        fetch(url).then((response) => {
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                    resultHeader.innerHTML = "Server Feil, prøv nytt søk"
                } else {
                    const JSONdata = JSON.parse(data) 
                    
                        const parsedResults = Papa.parse(JSONdata.unparsed, {
                        delimiter: "\t",
                        newline: "\n",
                        quoteChar: '',
                        header: true,
                        }) 
                    //check if there are any hits from the search
                    if ( parsedResults.data === undefined || parsedResults.data.length === 0 ) {
                        resultHeader.innerHTML = "Ingen treff, prøv nytt søk"
                    } else {
                        resultTable(parsedResults.data)
                        drawMap(parsedResults.data)
                        // Show download button
                        document.getElementById("downloadButton").style.display = "block"
                    }
                }
            })
            document.getElementById("pleaseWait").style.display = "none"
        })    
    }
  })


// når noe velger en samling vil det sendes en forespørsel til server om dato på MUSIT-dump fila
samling.addEventListener('change', (e) => {
    e.preventDefault()
    const url = 'http://localhost:3000/footer-date/?&samling=' + e.target.value
        fetch(url).then((response) => {
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {
                    data = JSON.parse(data)
                    StistOppdatert = 'Dataene ble sist oppdatert: ' + data.date
                    oppdatert.textContent = StistOppdatert
                    
                }
            })
        })
})