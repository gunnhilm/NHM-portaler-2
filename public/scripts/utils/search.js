console.log('client side javascript is loaded')

// on page initially
const collection = document.querySelector('#collection-select') 
const searchForm = document.querySelector('form') 
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
const resultTable = (musitData) => { 
    stringData = JSON.stringify(musitData)
    
    try {
        sessionStorage.setItem('string', stringData)    // Save searchresult to local storage
        const nbHits = musitData.length
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
            const cell8 = row.insertCell(7)
            const cell9 = row.insertCell(8)
            const cell10 = row.insertCell(9)
            const cell11 = row.insertCell(10)
            

            if (i === -1) {
                
                // header row
                function getArrowDown(i) {
                    let arrowDown =  `<img id='uio-arrow-down${i+1}' src='/images/icon-down.svg' width="10" height="10"></img>`
                    return (arrowDown)
                }
                function getArrowUp(i) {
                    let arrowUp = `<img id='uio-arrow-up${i+1}' src='/images/icon-up.svg' width="10" height="10"></img>`
                    return (arrowUp)
                }

                
                
                cell1.innerHTML = `<button class='sort'>${"MUSIT-ID".bold()} ${getArrowDown(0)} ${getArrowUp(0)}</button>` // 
                
                cell1.setAttribute('onclick', "sortTable(0)")
                cell2.innerHTML = `<button class='sort'>${textItems.headerTaxon[index].bold()} ${getArrowDown(1)} ${getArrowUp(1)}</button>`
                cell2.setAttribute('onclick', "sortTable(1)") 
                cell3.innerHTML = `<button class='sort'>${textItems.headerCollector[index].bold()} ${getArrowDown(2)} ${getArrowUp(2)}</button>`
                cell3.setAttribute('onclick', "sortTable(2)") 
                cell4.innerHTML = `<button class='sort'>${textItems.headerDate[index].bold()} ${getArrowDown(3)} ${getArrowUp(3)}</button>`
                cell4.setAttribute('onclick', "sortTable(3)") 
                cell5.innerHTML = `<button class='sort'>${textItems.headerCountry[index].bold()} ${getArrowDown(4)} ${getArrowUp(4)}</button>`
                cell5.setAttribute('onclick', "sortTable(4)") 
                cell6.innerHTML = `<button class='sort'>${textItems.headerMunicipality[index].bold()} ${getArrowDown(5)} ${getArrowUp(5)}</button>`
                cell6.setAttribute('onclick', "sortTable(5)") 
                cell7.innerHTML = `<button class='sort'>${textItems.headerLocality[index].bold()} ${getArrowDown(6)} ${getArrowUp(6)}</button>`
                cell7.setAttribute('onclick', "sortTable(6)") 
                cell8.innerHTML = `<button class='sort'><span class="fas fa-camera"></span>${getArrowDown(7)} ${getArrowUp(7)}</button>`
                cell8.setAttribute('onclick', "sortTable(7)") 
                cell9.innerHTML = `<button class='sort'><span class="fas fa-compass"></span>${getArrowDown(8)} ${getArrowUp(8)}</button>`
                cell9.setAttribute('onclick', "sortTable(8)") 
                cell10.innerHTML = `<button class='sort'>${textItems.headerCoremaAccno[index].bold()} ${getArrowDown(9)} ${getArrowUp(9)}</button>`
                cell10.setAttribute('onclick', "sortTable(9)") 
                cell11.innerHTML = `<button class='sort'>${textItems.headerSequence[index].bold()} ${getArrowDown(10)} ${getArrowUp(10)}</button>`
                cell11.setAttribute('onclick', "sortTable(10)") 
                
            } else {
                cell1.innerHTML =  `<a id="object-link" href="http://localhost:3000/object/?id=${i}"> ${musitData[i].catalogNumber} </a>`
                cell2.innerHTML = musitData[i].scientificName
                if (musitData[i].recordedBy.includes(",")) {
                    let x = musitData[i].recordedBy.indexOf(",")
                    let y = musitData[i].recordedBy.substr(0,x)
                    cell3.innerHTML = y + " et al."    
                } else {
                    cell3.innerHTML = musitData[i].recordedBy
                }
                
                cell4.innerHTML = musitData[i].eventDate
                cell5.innerHTML = musitData[i].country
                cell6.innerHTML = musitData[i].county
                cell7.innerHTML = musitData[i].locality
                if( musitData[i].associatedMedia) {
                    cell8.innerHTML = `<span class="fas fa-camera"></span>`
                }
                if( musitData[i].decimalLongitude) {
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
        document.getElementById("empty-search").style.display = "block"
        if (!searchFailed) {
            drawMap(musitData)    
        }
        
         
    }  
    catch(error) {
        resultHeader.innerHTML = textItems.errorRenderResult[index]
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
    document.getElementById("map-search").innerHTML = ""  
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
    downloadButton.style.display = "none"
    document.getElementById("zoom-button").style.display = "none"
    document.getElementById("large-map-button").style.display = "none"
    document.getElementById("empty-search").style.display = "none"

    // mustChoose
    if (!chosenCollection) {
        resultHeader.innerHTML = textItems.mustChoose[index]
        document.getElementById("please-wait").style.display = "none"
    } else {
        const url = 'http://localhost:3000/search/?search=' + searchTerm +'&samling=' + chosenCollection // normal search
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
                                try {
                                    sessionStorage.setItem('string', JSON.stringify(parsedResults.data))   
                                
                                    resultTable(parsedResults.data)
                                    console.log(parsedResults.data)
                                    
                                } catch (error) {
                                    resultHeader.innerHTML = textItems.errorRenderResult[index]
                                    searchFailed = true // is checked when map is drawn 
                                }
                                 
                            }
                        }
                    })
                }
                catch (error) {
                    console.error(error)
                }
            }
            document.getElementById("please-wait").style.display = "none"
        })
        
    }
})                    
    
  
// when a collection is chosen a request is sent to the server about date of last change of the MUSIT-dump file
collection.addEventListener('change', (e) => {
    e.preventDefault()
    updateFooter()
    if (document.getElementById("search-text").style.display === "none" || document.getElementById("search-button").style.display === "none") {
        document.getElementById("search-text").style.display = "inline" 
        document.getElementById("search-button").style.display = "inline"
        resultHeader.innerHTML = ""
    }
    sessionStorage.setItem('collection', collection.value)
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
            updated.textContent = lastUpdated
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
                
                
                document.getElementById('collection-select').value = sessionStorage.getItem('collection')
                updateFooter()
                
                // sends the data to the functions that show the results
                resultTable(data)
                
            }
        } 
}

//run the function
oldSearch() 

const emptySearch = () => {
    sessionStorage.removeItem('string')
    sessionStorage.removeItem('collection')
    collection.value = "" 
    document.getElementById("search-text").value = ""
    
    // empty table
    table.innerHTML = ""
    resultHeader.innerHTML = ""
    nbHitsElement.textContent = ""
    nbHitsHeader.innerHTML = ""

    // remove old map if any and empty array
    document.getElementById("map-search").innerHTML = "" 
    // hide buttons rendered with search result
    document.getElementById("download-button").style.display = "none"
    document.getElementById("empty-search").style.display = "none"
    document.getElementById("zoom-button").style.display = "none"
    document.getElementById("large-map-button").style.display = "none"
    // empty search-phrase and collection (but these should be kept in oldsearch)
    
}

  
  
//empty-search button (made to test things when fixing bug)
const emptySearchButton = document.querySelector('#empty-search')

emptySearchButton.addEventListener('click', (e) => {
    e.preventDefault()
    // erase the last search result
    emptySearch()
})



// feil for musit regno
function sortTable(n) {
    console.log("sort is called, can take a while")
    
    // får ikke til: // Show please wait
    //document.getElementById("please-wait").style.display = "block"

    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0
    table = document.getElementById("myTable")
    switching = true
    // Set the sorting direction to ascending:
    dir = "asc"
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false
      rows = table.rows
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("td")[n]
        
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true
            break
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true
            break
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
        switching = true
        // Each time a switch is done, increase this count by 1:
        switchcount ++
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc"
          switching = true
        }
      }
      
    }
   
    console.log('sorting is done')
    //document.getElementById("please-wait").style.display = "none"
    if(dir == "asc") {
        document.getElementById(`uio-arrow-down${n+1}`).style.display = "inline"
        document.getElementById(`uio-arrow-up${n+1}`).style.display = "none"
    } else if (dir == "desc") {
        document.getElementById(`uio-arrow-up${n+1}`).style.display = "inline"
        document.getElementById(`uio-arrow-down${n+1}`).style.display = "none"
    }
    for (i = 0; i < 10; i++) {
        if (i === n) {
            continue
        }
        document.getElementById(`uio-arrow-up${i+1}`).style.display = "inline"
        document.getElementById(`uio-arrow-down${i+1}`).style.display = "inline"
    }
    
}


document.getElementById('large-map-button').onclick = () => {
    window.open(href="http://localhost:3000/map")
}
