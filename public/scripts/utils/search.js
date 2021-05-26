// search.js: performs searches and add functionality to buttons and selects etc.


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

// figures out which museum we are in
// out: string, abbreviation for museum
// is called by doSearch() and updateFooter()
const getCurrentMuseum = () => {
    console.log(window.location.pathname)
    let museum = window.location.pathname
    museum = museum.slice(8)
    return museum
}

let museum = getCurrentMuseum()   


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

// put organism-group-buttons into array
let buttonArray = [document.querySelector('#botanikk'),document.querySelector('#zoologi'),document.querySelector('#geologi'),document.querySelector('#other')]

function addCollectionsToSelect(orgGroup) {
    sessionStorage.setItem('organismGroup', orgGroup)
    
    collection.style.display = 'block'
    
    let length = collection.options.length
    console.log(length)
    for (i = length-1; i >= 0; i--) {
      collection.options[i] = null
    }
    
    buttonArray.forEach(el => {
        el.className = "white-button"
    })
    document.querySelector('#'+ orgGroup).className = "blue-button"
    document.querySelector('#'+ orgGroup).style.marginRight = "10px"
    const url_coll = urlPath + '/collections/?museum=' + museum + '&orgGroup=' + orgGroup
   
    const vennligst = document.createElement("option")
    vennligst.text = textItems.vennligst[index]
    collection.add(vennligst)
    
    fetch(url_coll).then((response) => {
        if (!response.ok) {
            throw 'noe er galt med respons til samlinger til select'
        } else {
            try {
                response.text().then((data) => {
                    const JSONdata = JSON.parse(data)  
                    JSONdata.forEach(el => {
                        elOption = document.createElement("option")
                        elOption.text = capitalizeFirstLetter(el)
                        elOption.value = el
                        elOption.id = el
                        collection.add(elOption)
                    })
                })
            }
            catch (error) {
                console.log(error)
                reject(error)
            }
        }
    }).catch((error) => {
        console.log('feil i samlinger til select. ' + error)
    })
}

// create options for collection-select dependent on museum
// when category of collection is chosen
buttonArray.forEach(el => {
    el.addEventListener('click', (e) => {
        console.log(el.id)
        addCollectionsToSelect(el.id)
        e.preventDefault()
    })
})



// download search-result to file
// in: filename(string, name of outputfile)
// in: text (string, the text that goes into the file, that is, the search result)
// out: downloaded tab-separated txt-file
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
    // loop through - put those which checked in new array
    const newArray = []
    searchResult.forEach(el => {
        if (el.checked) {newArray.push(el)}
    })
    if (newArray.length == 0) {
        console.log('velg bilder å laste ned')
        zoomModal.style.display = "block";
        zoomModalContent.innerHTML = textItems.mapCheckedMessage[index]

        
    } else {
        if (newArray.some(el => el.associatedMedia)) {
            newArray.forEach( el => {
                const photoToDownload = el.associatedMedia    
                if (photoToDownload) {
                    forceDownload(photoToDownload, `image${el.catalogNumber}.jpg`)
                }
            })
        } else {
            zoomModal.style.display = "block";
            zoomModalContent.innerHTML = textItems.noPhotoMessage[index]
        }
    }
})


// downloads photo
// in: url (url to photo on server)
// in: filename (string, name to be given to downloaded photo)
// is called by downloadPhotoButton.eventlistener
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
    xhr.send()
}



// deletes previous search results, resets value that says if search failed, resets Boolean sorting-values for result, hides buttons, performs search
// in: limit (number, line number of search result where search stops)
// calls resetSortedBoolean in paginateAndRender.js
//      emptyTable() in resultElementsOnOff.js
//      emptyResultElements() in resultElementOnOff.js
// is called by searchForm.eventlistener
const doSearch = (limit = 20) => {
    // delete the previous search results
    sessionStorage.removeItem('string')
    sessionStorage.removeItem('currentPage')
    sessionStorage.removeItem('numberPerPage')
    sessionStorage.removeItem('propsSorted')
    document.getElementById("map-search").innerHTML = ""  
    // reset searchFailed value
    searchFailed = false
    resetSortedBoolean() // set all booleans in propsSorted-array in PaginateAndRender.js to false
    const searchTerm = search.value
    const chosenCollection = collection.value
    searchLineNumber = limit

    let museum = getCurrentMuseum()   
 
    emptyTable()

    // Show please wait
    document.getElementById("please-wait").style.display = "block"
    // hide download button
    emptyResultElements()

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
                                        nbHitsElement.textContent = textItems.tooManyHits[index]
                                        nbHitsElement.style.color = 'red'
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
    searchForm.style.display = "block"
    document.querySelector('#hits-row').style.display = 'block'
    errorMessage.innerHTML = ""

    if (document.getElementById("search-text").style.display === "none" || document.getElementById("search-button").style.display === "none") {
        document.getElementById("search-text").style.display = "inline" 
        document.getElementById("search-button").style.display = "inline"
        //resultHeader.innerHTML = ""
    }
    sessionStorage.setItem('collection', collection.value)
})

// when a collection is chosen a request is sent to the server about date of last change of the MUSIT-dump file
// string (date)
// is called in oldSearch() and collection-select-eventlistener 
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
            document.getElementById("search-text").style.display = "none"
            document.getElementById("search-button").style.display = "none"
        })
    }
}

// shows previous search-result when returning to main-page, if it exists in this session
// calls renderText(language), updateFooter(), load()
// is called in search.js, that is, every time main page is rendered
const oldSearch = () => {
    console.log(sessionStorage.getItem('organismGroup') + 'blabla')
    console.log(sessionStorage.getItem('collection'))
    collection.value = sessionStorage.getItem('collection')

    orgGroup = sessionStorage.getItem('organismGroup')
    ///////gjør dette til en funksjon jeg kan kalle opp
    const url_coll = urlPath + '/collections/?museum=' + museum + '&orgGroup=' + orgGroup
    const vennligst = document.createElement("option")
    vennligst.text = textItems.vennligst[index]
    //collection.add(vennligst)
    


    fetch(url_coll).then((response) => {
        if (!response.ok) {
            throw 'noe er galt med respons til samlinger til select'
        } else {
            try {
                response.text().then((data) => {
                    const JSONdata = JSON.parse(data)  
                    JSONdata.forEach(el => {
                        elOption = document.createElement("option")
                        elOption.text = capitalizeFirstLetter(el)
                        elOption.value = el
                        elOption.id = el
                        collection.add(elOption)
                    })
                })
            }
            catch (error) {
                console.log(error)
                reject(error)
            }
        }
    }).catch((error) => {
        console.log('feil i samlinger til select. ' + error)
    })



    if (sessionStorage.getItem('organismGroup')) {
        // gå gjennom alle knappene og aktiver den relevante
        buttonArray.forEach(el => {
            if (sessionStorage.getItem('organismGroup') == el.id) {
                console.log(el.id)
                el.className = "blue-button"
                
            }
        })
    }
    if (sessionStorage.getItem('collection')) {
        if (sessionStorage.getItem('string')) { //hvis det er søkeresultater i sesion storage, så skal disse vises
            // render correct language
            
            if (!sessionStorage.getItem('language')) {
                language = 'Norwegian'
            } else {
                language = sessionStorage.getItem('language')
            }
            collection.style.display = 'block'
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

// empties session’s search-result (sessionStorage), removes elements from page, resets pagination variables
// calls emptyTable() in resultElementsOnOff.js
//      emptyResultElements() in resultElementsOnOff.js
// is called by emptySearchButton.eventlistener, upateFooter() when error
const emptySearch = () => {
    
    sessionStorage.removeItem('string')
    sessionStorage.removeItem('collection')
    sessionStorage.removeItem('searchLineNumber')
    sessionStorage.removeItem('search-text')
    sessionStorage.removeItem('currentPage')
    sessionStorage.removeItem('numberPerPage')
    
    if (sessionStorage.getItem('organismGroup')) {
        // gå gjennom alle knappene og aktiver den relevante
        buttonArray.forEach(el => {
            if (sessionStorage.getItem('organismGroup') == el.id) {
                console.log(el.id)
                el.className = "blue-button"
                
            }
        })
    }
    // let length = collection.options.length
    // console.log(length)
    // for (i = length-1; i >= 0; i--) {
    //   collection.options[i] = null
    // }
    
    // buttonArray.forEach(el => {
    //     el.className = "white-button"
    // })
    
    document.getElementById("search-text").value = ""
    

    emptyTable()
    
    // remove old map if any and empty array
    document.getElementById("map-search").innerHTML = "" 
    emptyResultElements()

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
    window.open(href= urlPath + "/" + getCurrentMuseum() + "/map")
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

// checks or unchecks several check-boxes and updates searchresult in sessionStorage with this information
// in:data (JSON; part of search result that is rendered on page)
// is called by dropdown-menu with checkbox-options in searchresult-table
const checkSeveralBoxes = (subMusitData) => {
    const nbHitsOnPage = document.getElementById('number-per-page').value
    const select = document.getElementById('checkboxSelect')
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
        console.log(searchResult[0])
        sessionStorage.setItem('string', JSON.stringify(searchResult))
        
        console.log(searchResult[0].checked)
    } else if (select.value == "none") {
        for (i = 0; i < max; i++) {
            document.getElementById(`checkbox${i}`).checked = false
        }
        let searchResult = JSON.parse(sessionStorage.getItem('string'))
        searchResult.forEach(el => el.checked = false)
        sessionStorage.setItem('string', JSON.stringify(searchResult))
    }
}

const select = document.getElementById('checkboxSelect')
if (JSON.parse(sessionStorage.getItem('pageList'))) {
    pageList = JSON.parse(sessionStorage.getItem('pageList'))
}

if(select) {
    select.onchange =() => {
        checkSeveralBoxes(pageList)
    }
}