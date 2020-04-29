console.log('client side javascript is loaded')

// on page initially
const collection = document.querySelector('#collection-select') 
const searchForm = document.querySelector('form') 
const search = document.querySelector('input')
let searchLineNumber = 0

const nbHitsElement = document.getElementById('nb-hits') 
const nbHitsHeader = document.getElementById("head-nb-hits")
const errorMessage = document.getElementById("error-message")


// for the download button 
const downloadButton = document.getElementById('download-button')
//empty-search button 
const emptySearchButton = document.querySelector('#empty-search-button')
//Page navigation
// const nextPage = document.getElementById('next-page')
// const previousPage = document.getElementById('previous-page')


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
    
    const url = '/download/?search=' + searchTerm +'&samling=' + chosenCollection + '&linjeNumber=0' + '&limit=none' // vi laster ned hele søkeresultatet, begynner på første linje og tar med alle resultater
    fetch(url).then((response) => {
            
        response.text().then((data) => {
            if(data.error) {
                return console.log(data.error)
            } else {
                const downloadData = JSON.parse(data)
                
                // Start file download
                download("download.txt", downloadData.unparsed.results)
            }
        })
    })
})


 const doSearch = (limit = 20) => {
     console.log('vi søker');
     
    // delete the previous search results
    sessionStorage.removeItem('string')
    document.getElementById("map-search").innerHTML = ""  
    // reset searchFailed value
    searchFailed = false
    resetSortedBoolean() // set all booleans in propsSorted-array in PaginateAndRender.js to false
    const searchTerm = search.value
    const chosenCollection = collection.value
    searchLineNumber = limit
 
    // empty table
    table.innerHTML = ""
    nbHitsElement.textContent = ""
    nbHitsHeader.innerHTML = ""
    errorMessage.innerHTML = ""

    // Show please wait
    document.getElementById("please-wait").style.display = "block"
    // hide download button
    downloadButton.style.display = "none"
    document.getElementById("head-nb-hits").innerHTML = ""
    document.getElementById("zoom-button").style.display = "none"
    document.getElementById("large-map-button").style.display = "none"
    document.getElementById("empty-search-button").style.display = "none"
    document.getElementById("first").style.display = "none"
    document.getElementById("previous").style.display = "none"
    document.getElementById("next").style.display = "none"
    document.getElementById("last").style.display = "none"
    document.getElementById("resultPageText").innerHTML = ""
    document.getElementById("resultPageNb").innerHTML = ""
    document.getElementById("resultPageAlert").innerHTML = ""

    // mustChoose
    if (!chosenCollection) {
        errorMessage.innerHTML = textItems.mustChoose[index]
        document.getElementById("please-wait").style.display = "none"
    } else {

        const url = '/search/?search=' + searchTerm +'&samling=' + chosenCollection + '&linjeNumber=0' + '&limit=' + limit // normal search
        fetch(url).then((response) => {
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
                            sessionStorage.setItem('searchTerm', searchTerm)
                            const parsedResults = Papa.parse(JSONdata.unparsed.results, {
                                delimiter: "\t",
                                newline: "\n",
                                quoteChar: '',
                                header: true,
                            }) 
                            //check if there are any hits from the search
                            if ( parsedResults.data === undefined || parsedResults.data.length === 0 ) {
                                nbHitsElement.innerHTML = textItems.noHits[index]
                            } else {
                                try {
                                    // hvis vi får flere enn 4000 treff må vi si i fra om det
                                    if(parsedResults.data.length > 3999){
                                        nbHitsElement.textContent = 'mer enn 4000'
                                    } else {
                                        nbHitsElement.textContent = parsedResults.data.length
                                    }
                                    nbHitsHeader.innerHTML = textItems.nbHitsText[index]
                                    sessionStorage.setItem('string', JSON.stringify(parsedResults.data))   
                                    // resultTable() 
                                    load()
                                } catch (error) {
                                    errorMessage.innerHTML = textItems.errorRenderResult[index]
                                    searchFailed = true // is checked when map is drawn 
                                }
                                 
                            }
                        }
                    })
                }
                catch (error) {
                    console.error(error)
                    reject(error);
                }
            }
            document.getElementById("please-wait").style.display = "none"
        })
        
    }
}                  

// when somebody clicks search-button
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    doSearch(4000) // vi skal få tilbake maks 4000 linjer med svar
})  



collection.addEventListener('change', (e) => {
    e.preventDefault()
    updateFooter()
    errorMessage.innerHTML = ""

    if (document.getElementById("search-text").style.display === "none" || document.getElementById("search-button").style.display === "none") {
        document.getElementById("search-text").style.display = "inline" 
        document.getElementById("search-button").style.display = "inline"
        //resultHeader.innerHTML = ""
    }
    sessionStorage.setItem('collection', collection.value)
})

// when a collection is chosen a request is sent to the server about date of last change of the MUSIT-dump file
const updateFooter = () => {
    const chosenCollection = collection.value
    if (chosenCollection) {
        sessionStorage.setItem('collection', chosenCollection)
        const url = '/footer-date/?&samling=' + chosenCollection
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
            errorMessage.innerHTML = textItems.errorFileNotExisting[index]
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
    if (sessionStorage.getItem('collection')) {
            if (sessionStorage.getItem('string')) { //hvis det er søkeresultater i sesion storage, så skal disse vises
                // render correct language
                if (!sessionStorage.getItem('language')) {
                    language = 'Norwegian'
                } else {
                    language = sessionStorage.getItem('language')
                }
                renderText(language)
                try {
                document.getElementById('collection-select').value = sessionStorage.getItem('collection')
                document.getElementById('search-text').value = sessionStorage.getItem('searchTerm')
                nbHitsElement.innerHTML=JSON.parse(sessionStorage.getItem('string')).length
                
                }
                catch {
                    console.log('local storage empty');
                    
                }
                updateFooter()                
                // sends the data to the functions that show the results
                load()
            }
        } 
}

//run the function
oldSearch() 

const emptySearch = () => {
    sessionStorage.removeItem('string')
    sessionStorage.removeItem('collection')
    sessionStorage.removeItem('searchLineNumber')
    sessionStorage.removeItem('search-text')
    collection.value = "" 
    document.getElementById("search-text").value = ""
    
    // empty table
    table.innerHTML = ""
    //resultHeader.innerHTML = ""
    nbHitsElement.textContent = ""
    nbHitsHeader.innerHTML = ""
    errorMessage.innerHTML = ""

    // remove old map if any and empty array
    document.getElementById("map-search").innerHTML = "" 
    // hide buttons rendered with search result
    document.getElementById("download-button").style.display = "none"
    document.getElementById("head-nb-hits").innerHTML = ""
    document.getElementById("empty-search-button").style.display = "none"
    document.getElementById("zoom-button").style.display = "none"
    document.getElementById("large-map-button").style.display = "none"
    document.getElementById("first").style.display = "none"
    document.getElementById("previous").style.display = "none"
    document.getElementById("next").style.display = "none"
    document.getElementById("last").style.display = "none"
    document.getElementById("resultPageText").innerHTML = ""
    document.getElementById("resultPageNb").innerHTML = ""
    document.getElementById("resultPageAlert").innerHTML = ""

    // set pagination variables to default / empty
    list.length = 0;
    pageList.length = 0;
    currentPage = 1;
    numberPerPage = 20;
    numberOfPages = 0; // calculates the total number of pages
    document.getElementById('number-per-page').value = '20'
    
}


emptySearchButton.addEventListener('click', (e) => {
    e.preventDefault()
    // erase the last search result
    emptySearch()
})


document.getElementById('large-map-button').onclick = () => {
    window.open(href="/map")
}
