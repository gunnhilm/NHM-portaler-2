console.log('client side javascript is loaded')
// urlPath er definert i textItems.js
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
const downloadPhotoButton = document.getElementById('download-photo-button')
//empty-search button 
const emptySearchButton = document.querySelector('#empty-search-button')

// rendered with result table, in footer
const updated = document.querySelector('#last-updated');

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
    console.log("nå er vi i search.js; download")
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
        
    // Start file download
    const searchResult = JSON.parse(sessionStorage.getItem('string'))
    // loop through - put those wich checked in new array
    const newArray = []
    let downloadResult
    searchResult.forEach(el => {
        if (el.checked) {newArray.push(el)}
    })
    if (newArray.length == 0) {
        downloadResult = Papa.unparse(searchResult, {
            delimiter: "\t",
        })
    } else {
        downloadResult = Papa.unparse(newArray, {
            delimiter: "\t",
        })
    }
    //download("download.txt", downloadData.unparsed.results)
    download("download.txt", downloadResult)
})


downloadPhotoButton.addEventListener('click', (e) => {
    e.preventDefault()
    
    const url = urlPath + '/downloadImage/'
        console.log(url);
        
        
    const searchResult = JSON.parse(sessionStorage.getItem('string'))
    // loop through - put those wich checked in new array
    const newArray = []
    searchResult.forEach(el => {
        if (el.checked) {newArray.push(el)}
    })
    console.log(newArray)
    // legger til kode her
    if (newArray.length == 0) {
        console.log('velg bilder å laste ned')
        zoomModal.style.display = "block";
        zoomModalContent.innerHTML = textItems.mapCheckedMessage[index]

        
    } else {
        newArray.forEach( el => {
            const photoToDownload = el.associatedMedia    
            console.log(photoToDownload)
            forceDownload(photoToDownload, `image${el.catalogNumber}.jpg`)
        })
    }
})



function forceDownload(url, fileName){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}

const getCurrentMuseum = () => {
    // finn ut hvilket museum 
    let museum = window.location.pathname
    console.log(window.location.pathname)
    museum = museum.slice(5)
    return museum
}

const doSearch = (limit = 20) => {
    console.log('vi søker');
     
    // delete the previous search results
    sessionStorage.removeItem('string')
    document.getElementById("map-search").innerHTML = ""  
    // reset searchFailed value
    searchFailed = false
    resetSortedBoolean() // set all booleans in propsSorted-array in PaginateAndRender.js to false
    const searchTerm = search.value
    console.log(search.value)
    const chosenCollection = collection.value
    searchLineNumber = limit

    let museum = getCurrentMuseum()   
 
    // empty table
    table.innerHTML = ""
    nbHitsElement.textContent = ""
    nbHitsHeader.innerHTML = ""
    errorMessage.innerHTML = ""

    // Show please wait
    document.getElementById("please-wait").style.display = "block"
    // hide download button
    downloadButton.style.display = "none"
    downloadPhotoButton.style.display = "none"
    document.getElementById("head-nb-hits").innerHTML = ""
    document.getElementById("zoom-button").style.display = "none"
    document.getElementById("large-map-button").style.display = "none"
    document.getElementById("export-png").style.display = "none"
    document.getElementById("checkedInMap").style.display = "none"
    document.getElementById("empty-search-button").style.display = "none"
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

    // mustChoose
    if (!chosenCollection) {
        errorMessage.innerHTML = textItems.mustChoose[index]
        document.getElementById("please-wait").style.display = "none"
    } else {
        const url = urlPath + '/search/?search=' + searchTerm + '&museum=' + museum + '&samling=' + chosenCollection + '&linjeNumber=0' + '&limit=' + limit // normal search
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
                                    // hvis vi får flere enn 2000 treff må vi si i fra om det
                                    if(parsedResults.data.length > 1999){
                                        nbHitsElement.textContent = 'mer enn 2000'
                                    } else {
                                        nbHitsElement.textContent = parsedResults.data.length
                                    }
                                    nbHitsHeader.innerHTML = textItems.nbHitsText[index]
                                    sessionStorage.setItem('string', JSON.stringify(parsedResults.data))      
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
        }).catch((error) => {
            console.log('her er den nye feilen' + error);
            errorMessage.innerHTML = textItems.serverError[index]
            document.getElementById("please-wait").style.display = "none"
        })
        
    }
}                  

// when somebody clicks search-button
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    doSearch(2000) // vi skal få tilbake maks 2000 linjer med svar
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
    let museum = getCurrentMuseum()  
    const chosenCollection = collection.value
    if (chosenCollection) {
        sessionStorage.setItem('collection', chosenCollection)
        const url =  urlPath + '/footer-date/?&samling=' + chosenCollection + '&museum=' + museum

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
            console.error('There is a problem, probably file for collection does not exist', error)
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
                nbHitsElement.innerHTML = JSON.parse(sessionStorage.getItem('string')).length
            } catch (error) {
                console.log('local storage empty');    
            }
            if (sessionStorage.getItem('numberPerPage')) {
                document.getElementById('number-per-page').value = sessionStorage.getItem('numberPerPage')
            } else {
                document.getElementById('number-per-page').value = '20'
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
    sessionStorage.removeItem('currentPage')
    sessionStorage.removeItem('numberPerPage')
    
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
    document.getElementById("download-photo-button").style.display = "none"
    document.getElementById("head-nb-hits").innerHTML = ""
    document.getElementById("empty-search-button").style.display = "none"
    document.getElementById("zoom-button").style.display = "none"
    document.getElementById("large-map-button").style.display = "none"
    document.getElementById("export-png").style.display = "none"
    document.getElementById("checkedInMap").style.display = "none"
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
    window.open(href= urlPath + "/map")
}


// checkboxes
// catch records that are checked

const getCheckedRecords = () => {
    searchResult.forEach(el => {
        if (el.checked) {
            console.log(el.catalogNumber)
            console.log(el.checked)
        }
    })
}

//Download map as png-file
document.getElementById('export-png').addEventListener('click', function() {
    map.once('postcompose', function(event) {
      var canvas = event.context.canvas;
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
      } else {
        var link = document.getElementById('image-download');
        link.href = canvas.toDataURL();
        link.click();
      }
    });
    map.renderSync();
})

// show selected records in map
document.getElementById('checkedInMap').addEventListener('click', function() {
    const searchResult = JSON.parse(sessionStorage.getItem('string'))
    // loop through - put those which are checked in new array
    const newArray = []
    searchResult.forEach(el => {
        if (el.checked) {newArray.push(el)}
    })
    if (newArray.length == 0) {
        zoomModal.style.display = "block"
        zoomModalContent.innerHTML = textItems.mapCheckedMessage[index]
    } else {
        drawMap(newArray)
    }
    
})


const select = document.getElementById('checkboxSelect')
if(select) {
    select.onchange =() => {
        const nbHitsOnPage = document.getElementById('number-per-page').value
        let max
        if (currentPage == numberOfPages) {
            max = list.length - ((numberOfPages-1) * numberPerPage)
        } else {
            max = nbHitsOnPage
        }
        if (select.value == "all") {
            for (i = 0; i < max; i++) {
                document.getElementById(`checkbox${i}`).checked = true
            }
            let searchResult = JSON.parse(sessionStorage.getItem('string'))
            searchResult.forEach(el => el.checked = true)
            sessionStorage.setItem('string', JSON.stringify(searchResult))
        } else if (select.value == "all_on_page") {
            // keep all on other pages that are checked
            // find those in subMusitData in searchResult and check them, and save searchresult
            for (i = 0; i < max; i++) {
                document.getElementById(`checkbox${i}`).checked = true
            }
            let searchResult = JSON.parse(sessionStorage.getItem('string'))
            let subArray = []
            subMusitData.forEach(el => subArray.push(el.catalogNumber))
            searchResult.forEach(el => {
                if (subArray.includes(el.catalogNumber)) {
                    el.checked = true
                }
            })
            sessionStorage.setItem('string', JSON.stringify(searchResult))
        } else if (select.value == "none") {
            for (i = 0; i < max; i++) {
                document.getElementById(`checkbox${i}`).checked = false
            }
            let searchResult = JSON.parse(sessionStorage.getItem('string'))
            searchResult.forEach(el => el.checked = false)
            sessionStorage.setItem('string', JSON.stringify(searchResult))
        }
    }
}

