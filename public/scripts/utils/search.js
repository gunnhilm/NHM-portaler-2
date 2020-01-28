console.log('client side javascript is loaded')

// on page initially
const collection = document.querySelector('#collection-select') 
const searchForm = document.querySelector('form') //// bruk konsekvent querySelector eller get elementbyid?
const search = document.querySelector('input')

// rendered with result table (used in function resultTable())
const resultHeader = document.getElementById("result-header")
const nbHitsElement = document.getElementById('nb-hits') 
const nbHitsHeader = document.getElementById("head-nb-hits")
const table = document.getElementById("myTable")

// for the download button
const downloadButton = document.getElementById('download-button')

// rendered with result table, in footer
const updated = document.querySelector('#last-updated') 

// to decide wether map is to be drawn
let searchFailed = false

// decides which language is rendered

if (sessionStorage.language) {
    language = sessionStorage.getItem('language')
} else {
    language = document.querySelector('#language').value
    sessionStorage.setItem('language', language)
}

// render result table
const resultTable = (data) => {

    stringData = JSON.stringify(data)
    
    try {
        sessionStorage.setItem('string', stringData)    // Save searchresult to local storage
        const nbHits = data.length
        nbHitsElement.textContent = nbHits
        
        resultHeader.innerHTML = textItems.searchResultHeadline[index]
        nbHitsHeader.innerHTML = textItems.nbHitsText[index]
    
        table.innerHTML = "";
        for (i = -1; i < nbHits; i++) {
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
                cell1.innerHTML =  `<a id="object-link" href="http://localhost:3000/object/?id=${i}"> ${data[i].catalogNumber} </a>`
                cell1.setAttribute('style','text-align:left')
                cell2.innerHTML = data[i].scientificName
                cell3.innerHTML = data[i].recordedBy
                cell4.innerHTML = data[i].eventDate
                cell5.innerHTML = data[i].country
                cell6.innerHTML = data[i].county
                cell7.innerHTML = data[i].locality
    
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
    catch(error) {
        resultHeader.innerHTML = textItems.errorToMuchData[index]
        searchFailed = true // is checked when map is drawn 
    }
}

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
downloadButton.addEventListener('click', (e) => {
    e.preventDefault()
    const searchTerm = search.value
    const chosenCollection = collection.value
    
    const url = 'http://localhost:3000/download/?search=' + searchTerm +'&samling=' + chosenCollection
    fetch(url).then((response) => {
            
        response.text().then((data) => {
            if(data.error) {
                return console.log(data.error)
            } else {
                const downloadData = JSON.parse(data).unparsed
                // Start file download
                download("download.txt", downloadData)
            }
        })
    })
})

// when somebody clicks search-button
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // delete the previous search results
    sessionStorage.removeItem('string') 
    // reset searchFailed value
    searchFailed = false
    const searchTerm = search.value
    const chosenCollection = collection.value
    
    // empty table
    table.innerHTML = ""
    resultHeader.innerHTML = ""
    nbHitsElement.textContent = ""
    nbHitsHeader.innerHTML = ""

    // Show please wait
    document.getElementById("please-wait").style.display = "block"
    // hide download button
    document.getElementById("download-button").style.display = "none"

    // mustChoose
      if (!chosenCollection) {
        resultHeader.innerHTML = textItems.mustChoose[index]
        document.getElementById("pleaseWait").style.display = "none"
    } else {
        const url = 'http://localhost:3000/search/?search=' + searchTerm +'&samling=' + chosenCollection
        fetch(url).then((response) => {
            if (!response.ok) {
                throw 'noe går galt med søk, respons ikke ok'
            } else {
                try {
                    response.text().then((data) => {
                        if(data.error) {
                            resultHeader.innerHTML = textItems.serverError[index]
                            return console.log(data.error)
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
                                resultHeader.innerHTML = textItems.noHits[index]
                            } else {
                            
                                resultTable(parsedResults.data)
                                if (!searchFailed) {
                                    drawMap(parsedResults.data)
                                } 
                            
                                // Show download button
                                if (!searchFailed) {
                                    document.getElementById("download-button").style.display = "block"
                                }
    
                            }
                        }
                    })
                }
                catch(error) {
                    console.error(error)
                }
            }
            document.getElementById("please-wait").style.display = "none"
        })    
    }
})

// .catch((error) => {
//     console.error('There is a problem, probably file for collections does not exist', error)
//     emptySearch()
//     resultHeader.innerHTML = textItems.errorFileNotExisting[index]
// })

// when a collection is chosen a request is sent to the server about date of last change of the MUSIT-dump file
collection.addEventListener('change', (e) => {
    e.preventDefault()
    updateFooter()
    if (document.getElementById("search-text").style.display === "none" || document.getElementById("search-button").style.display === "none") {
        document.getElementById("search-text").style.display = "inline" 
        document.getElementById("search-button").style.display = "inline"
        resultHeader.innerHTML = ""
    }
})

const updateFooter = () => {
    const chosenCollection = collection.value
    if (chosenCollection) {
        sessionStorage.setItem('collection', chosenCollection)
        const url = 'http://localhost:3000/footer-date/?&samling=' + chosenCollection
        fetch(url).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.text()
            }
        }).then ((data) => {
            data=JSON.parse(data)
            lastUpdated = 'Dataene ble sist oppdatert: ' + data.date
            updated.textcontent = lastUpdated
        }) .catch((error) => {
            console.error('There is a problem, probably file for collections does not exist', error)
            emptySearch()
            resultHeader.innerHTML = textItems.errorFileNotExisting[index]
            // disable search...
            // <input id="search-text" type="text" class="input">
                        //             <button id="search-button"></button>
            document.getElementById("search-text").style.display = "none"
            document.getElementById("search-button").style.display = "none"
        })
    }
}

// show previous search-result
const oldSearch = () => {
    if (sessionStorage.getItem('collection') !== "null") 
        {
            if (sessionStorage.getItem('string') !== "null") {
                // gets search result from storage
                stringData = sessionStorage.getItem('string')
                // parsing search result
                data = JSON.parse(stringData)
                // render correct language
                if (sessionStorage.getItem('language') === "null") {
                    language = 'Norwegian'
                } else {
                    language = sessionStorage.getItem('language')
                }
                renderText(language)
                document.getElementById("download-button").style.display = "inline"
                updateFooter()
                
                // sends the data to the functions that show the results
                resultTable(data)
                drawMap(data)
                
            }
        } 
}

//run the function
oldSearch() 

const emptySearch = () => {
    sessionStorage.removeItem('string') 
    
    // empty table
    table.innerHTML = ""
    resultHeader.innerHTML = ""
    nbHitsElement.textContent = ""
    nbHitsHeader.innerHTML = ""

    // remove old map if any and empty array
    document.getElementById("map").innerHTML = "" 
    // hide download-button
    document.getElementById("download-button").style.display = "none"
    // empty search-phrase and collection (but these should be kept in oldsearch)
}

//empty-search button (made to test things when fixing bug)
const emptySearchButton = document.querySelector('#empty-search')
emptySearchButton.addEventListener('click', (e) => {
    e.preventDefault()
    // erase the last search result
    emptySearch()
})

// document.getElementById("download-button").style.display = "inline"
//få fram igjen søkemuligheter