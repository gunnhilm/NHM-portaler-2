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
const actionSelect = document.getElementById("action-select")

//empty-search button 
const emptySearchButton = document.querySelector('#empty-search-button')

// const checkCoordinates = document.querySelector('#check-coordinates-button')
const checkCoordinates = document.querySelector('#check-coordinates')
// rendered with result table, in footer
const updated = document.querySelector('#last-updated')

actionSelect.addEventListener('change', (e) => {
    if (actionSelect.value == 'download-records') {
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
        download("download.txt", downloadResult)
        actionSelect.value = "action-option"
    } else if (actionSelect.value == "download-photos") {
        e.preventDefault()
            
        const searchResult = JSON.parse(sessionStorage.getItem('string'))
        // loop through - put those which checked in new array
        const newArray = []
        const urls = []
        const catalogNo = []
        searchResult.forEach(el => {
            if (el.checked) {newArray.push(el)}
        })
        
        if (newArray.length === 0) {
            zoomModal.style.display = "block";
            zoomModalContent.innerHTML = textItems.mapCheckedMessage[index]
        } else {
            if (newArray.some(el => el.associatedMedia)) {
                newArray.forEach( el => {
                    urls.push(el.associatedMedia)
                    catalogNo.push(el.catalogNumber)
                })
                downloadAndZip(urls,catalogNo)
            } else {
                zoomModal.style.display = "block";
                zoomModalContent.innerHTML = textItems.noPhotoMessage[index]
            }
        }
        actionSelect.value = "action-option"
    } else if (actionSelect.value == "loan-records") {
        e.preventDefault()
        startLoans()
        openPage()
        actionSelect.value = "action-option"
    } else if (actionSelect.value == "check-coordinates") {
        e.preventDefault()
        let url = window.location.href
        url = url + '/checkCoord'
        window.location.href = url
        actionSelect.value = "action-option"
    }
    
})

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
    const pathArray = window.location.pathname.split('/')
    const museum = pathArray[2]
    return museum
}

const museum = getCurrentMuseum()

// fetches fileList from backend. 
const getFileList = async () => {
    return new Promise((resolve,reject) => {
        url_getFileList = urlPath + '/getFileList/?museum=' + museum
        fetch(url_getFileList).then((response) => {
            if (!response.ok) {
                throw 'noe er galt med respons til getFileList fra museum'
            } else {
                try {
                    response.text().then((data) => {
                        JSONdata = JSON.parse(data)
                         sessionStorage.setItem('fileList',data)
                        resolve(true)
                        // return(data)
                    })
                }
                catch (error) {
                    console.log(error)
                    reject(error)
                }
            }
        })
        
    })
}

const getOrganismGroups = async () => {
    return new Promise((resolve,reject) => {
        try {
            const fileList = sessionStorage.getItem('fileList')
            let tempOrgGroups = []
            const JSONdata = JSON.parse(fileList)
            JSONdata.forEach(el => {
                if (el.orgGroup) {tempOrgGroups.push(el.orgGroup)}
            })
            //remove duplicates:
            let orgGroups = [...new Set(tempOrgGroups)]
            sessionStorage.setItem('organismGroups', orgGroups)
            resolve(true)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}
    
// empties session’s search-result (sessionStorage), removes elements from page, resets pagination variables
// calls emptyTable() in resultElementsOnOff.js
//      emptyResultElements() in resultElementsOnOff.js
// is called by emptySearchButton.eventlistener, upateFooter() when error
const emptySearch = (comesFrom) => {
    if (comesFrom === "organism-button") {
        sessionStorage.removeItem('collection')
        collection.value = "vennligst"
    }

    // close accordions
    document.getElementsByClassName('panel')[0].style.display = 'none'
    document.getElementsByClassName('panel')[1].style.display = 'none'
    document.getElementById("objectlist-accordion-icon").innerHTML = "+"
    document.getElementById("adv-accordion-icon").innerHTML = "+"

    // uncheck radiobuttons
    let  radioButtons = document.getElementsByName('radio-photo')
    radioButtons.forEach (el => el.checked = false)
    
    // remove search-terms
    const inputFields = document.getElementsByClassName('input-tight')
    const inputFields2 = document.getElementsByClassName('input')
    for (el of inputFields) {
        el.value = ''
    }
    for (el of inputFields2) {
        el.value = ''
    }
    
    sessionStorage.removeItem('string')
    sessionStorage.removeItem('searchLineNumber')
    sessionStorage.removeItem('search-text')
    sessionStorage.removeItem('numberPerPage')
    sessionStorage.removeItem('chosenCollection')
    sessionStorage.setItem('currentPage',1)
    currentPage = 1
    
    if (comesFrom == 'window.onload') {
        sessionStorage.removeItem('organismGroup')    
    }
    
    if (sessionStorage.getItem('organismGroup')) {
        // gå gjennom alle knappene og aktiver den relevante
        buttonArray.forEach(el => {
            if (sessionStorage.getItem('organismGroup') == el.id) {
                el.className = "blue-button"  
            }
        })
    }

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

    // empty footer-fields
    updated.textcontent = ''
    document.getElementById("gbif-citation").textContent = ''

}


const emptyCollection = () => {
    sessionStorage.removeItem('collection')
    collection.value = "vennligst"
}


// not in use???
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}


function addTextInOrgButtons(a) {
    const collections = {
      botanikk: textItems.botanikk,
      mykologi: textItems.mykologi,
      zoologi: textItems.zoologi,
      geologi: textItems.geologi,
      paleontologi: textItems.paleontologi,
      other: textItems.otherCollections
    };
  
    return collections[a][index];
  }
  

function makeButtons() {
    const fileList = JSON.parse(sessionStorage.getItem('fileList'))
    orgGroups = sessionStorage.getItem('organismGroups').split(',')
    orgGroups.forEach(el => {
        button = document.createElement("button")
        button.innerHTML = addTextInOrgButtons(el)
        button.id = el
        document.getElementById("button-cell").appendChild(button)
        buttonArray.push(button)   
    })
    buttonArray.forEach(el => {
        el.addEventListener('click', (e) => {
            if (document.getElementById('search-cell').style.display == 'table-cell') {
                emptySearch('organism-button')
                emptyCollection()
                // hvis linja nedenfor er med forsvinner search-cell med søkefelt ved første visning av siden,
                // uten at ny org-gruppe-knapp trykkes på
                // document.getElementById('search-cell').style.display = 'none'
                document.getElementById('map-search').style = "border:none; padding:0px"
            }
            addCollectionsToSelect(el.id, orgGroups, fileList)
            e.preventDefault()
        })
        orgGroup = sessionStorage.getItem('organismGroup')
        if (orgGroup == el.id) {
            el.className = "blue-button" 
        } else {
            el.className = "white-button" 
        }
    })
}

// put organism-group-buttons into array

let buttonArray = []
// addOrgGroups()

function addTextInCollSelect(a) {
    const collections = {
      moser: textItems.moser,
      vascular: textItems.vascular,
      lav: textItems.lav,
      alger: textItems.alger,
      entomology: textItems.insekter,
      evertebrater: textItems.invertebrates,
      invertebrates_with_dna: textItems.invertebrates_with_dna,
      fisk: textItems.fisk,
      birds: textItems.fugler,
      mammals: textItems.pattedyr,
      mammals_no_dna: textItems.bcPattedyr,
      dna_vascular: textItems.dna_vascular,
      dna_fungi_lichens: textItems.fungiLichens,
      dna_entomology: textItems.dna_insekter,
      dna_fish_herptiles: textItems.fishHerp,
      sopp: textItems.sopp,
      dna_other: textItems.other,
      malmer: textItems.malmer,
      oslofeltet: textItems.oslofeltet,
      utenlandskeBergarter: textItems.utenlandskeBA,
      mineraler: textItems.mineraler,
      fossiler: textItems.fossiler,
      palTyper: textItems.palTyper,
      utad: textItems.utad,
      bulk: textItems.bulk,
      crustacea: textItems.crustacea,
      insectTypes: textItems.insectTypes
    };
  
    return collections[a][index];
}
  
    
function addCollectionsToSelect(orgGroup, orgGroups, fileList) {
    sessionStorage.setItem('organismGroup', orgGroup)
    document.querySelector('#select-cell').style.display = 'block'
    let length = collection.options.length
    for (i = length-1; i >= 0; i--) {
      collection.options[i] = null
    }
    const vennligst = document.createElement("option")
    vennligst.text = textItems.vennligst[index]
    vennligst.value = 'vennligst'
    vennligst.id = 'vennligst'
    collection.add(vennligst)
    collection.value = "vennligst"
    
    if (orgGroup) {
        orgGroups.forEach(el => {
            if (el == orgGroup) { 
                document.querySelector('#' + el).className = "blue-button" 
            } else {
                document.querySelector('#' + el).className = "white-button" 
            }
        })
        document.querySelector('#'+ orgGroup).style.marginRight = "10px"
        let coll = []
        fileList.forEach(el => {
            if (el.orgGroup === orgGroup) {
                coll.push(el.name)
            }
        })
        sessionStorage.setItem('options', JSON.stringify(coll))
        coll.forEach(el => {
            elOption = document.createElement("option")
            elOption.text = addTextInCollSelect(el)
            elOption.value = el
            elOption.id = el
            collection.add(elOption)
        })
        if (sessionStorage.getItem('chosenCollection')) {
            collection.value = sessionStorage.getItem('chosenCollection')
        } else {
            collection.value = 'vennligst'
        }

    } else {
        collection.value = 'vennligst'
    }
}



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


// https://huynvk.dev/blog/download-files-and-zip-them-in-your-browsers-using-javascript
const downloadImage = async (url) => {
    return fetch(url).then(resp => resp.blob());
}
  
const downloadMany = urls => {
   return Promise.all(urls.map(url => downloadImage(url)))
}

const downloadAndZip = async (urls, catalogNo) => {
    document.getElementById("please-wait").style.display = "block"
    return downloadMany(urls).then(blobs =>{
        const zip = JSZip();
        blobs.forEach((blob, i) => {
        //   zip.file(`file-${i}.jpg`, blob);
          zip.file(`${catalogNo[i]}.jpg`, blob);
        });
        zip.generateAsync({type: 'blob'}).then(zipFile => {
          const currentDate = new Date().getTime();
          const fileName = `combined-${currentDate}.zip`;
          document.getElementById("please-wait").style.display = "none"
          return saveAs(zipFile, fileName);
        })
   })
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
    sessionStorage.setItem('currentPage',1)
    currentPage = 1
    sessionStorage.removeItem('numberPerPage')
    sessionStorage.removeItem('propsSorted')
    const chosenCollection = collection.value
    if (!chosenCollection === "bulk") { document.getElementById("map-search").innerHTML = "" }
    sessionStorage.removeItem('advSearchArray')
    // reset searchFailed value
    searchFailed = false
    resetSortedBoolean() // set all booleans in propsSorted-array in PaginateAndRender.js to false
    const searchTerm = search.value
    sessionStorage.setItem('searchTerm', searchTerm)
    
    sessionStorage.setItem('chosenCollection',chosenCollection)
    searchLineNumber = limit
    sessionStorage.setItem('limit', limit)

    let museum = getCurrentMuseum()   

    sessionStorage.setItem('museum',museum)
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
                            console.log(error);
                            return console.log(data.error)
                        } else {
                            const JSONdata = JSON.parse(data)  
                            
                            sessionStorage.setItem('searchLineNumber', JSONdata.unparsed.count)
                            //sessionStorage.setItem('searchTerm', searchTerm)
                            const parsedResults = Papa.parse(JSONdata.unparsed.results, {
                                delimiter: "\t",
                                newline: "\n",
                                quoteChar: '',
                                header: true,
                            }) 
                            //check if there are any hits from the search
                            if ( parsedResults.data === undefined || parsedResults.data.length === 0 ) {
                                nbHitsElement.innerHTML = textItems.noHits[index]
                                nbHitsElement.style.display = 'inline'
                            } else {
                                try {
                                    // hvis vi får flere enn 2000 treff må vi si i fra om det
                                    if(parsedResults.data.length > 999){
                                        nbHitsElement.textContent = textItems.tooManyHits[index]
                                        nbHitsElement.style.color = 'red'
                                        nbHitsElement.style.display = 'inline'
                                    } else {
                                        nbHitsElement.textContent = parsedResults.data.length
                                        nbHitsElement.style.color = 'black'
                                        nbHitsElement.style.display = 'inline'
                                    }
                                    
                                    nbHitsHeader.innerHTML = textItems.nbHitsText[index]
                                    nbHitsHeader.style.display = 'inline'
                                    // replace , with . if necessary
                                    if(chosenCollection === 'fossiler' || chosenCollection === 'palTyper') {
                                        let coordString = ''
                                        const regex = /,/i;
                                        parsedResults.data.forEach(function(item, index) {

                                            if(item.decimalLatitude){
                                                coordString = item.decimalLatitude
                                                if (coordString.includes(',')) {
                                                    try {
                                                        coordString = coordString.replace(regex, '.')
                                                        coordString = coordString.trim()
                                                        coordString = coordString + 0
                                                    } finally {
                                                        item.decimalLatitude = coordString
                                                    }
                                                }
                                            }
                                            if(item.decimalLongitude){
                                                coordString = item.decimalLongitude
                                                if (coordString.includes(',')) {
                                                    try {
                                                        coordString = coordString.replace(regex, '.')
                                                        coordString = coordString.trim()
                                                        coordString = coordString + 0
                                                    } finally {
                                                        item.decimalLongitude = coordString
                                                    }
                                                }
                                            }
                                        })
                                    }
                                    sessionStorage.setItem('string', JSON.stringify(parsedResults.data))      
                                    
                                    load() 
                                    
                                    } catch (error) {
                                        console.log(error);
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
            console.log(error);
            errorMessage.innerHTML = textItems.serverError[index]
            document.getElementById("please-wait").style.display = "none"
        })
    }
}                  

// when somebody clicks search-button
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // let museum = getCurrentMuseum() 
    // const p_collection = collection.value
    //whichFileAndDb_main(museum, p_collection)
    doSearch(1000) // vi skal få tilbake maks 1000 linjer med svar
})  


// const collAddEventListener = async () => {
        
//         collection.addEventListener("change", (e) => {
//             e.preventDefault();
//             emptySearch("collection_listener");
//             const orgGroup = sessionStorage.getItem("organismGroup");
//             const advancedAccordion = document.getElementById("advanced-accordion");
//             const collectionValue = collection.value;
//             updateFooter(collectionValue)
//             if (["geologi", "paleontologi", "other"].includes(orgGroup)) {
//             advancedAccordion.style.display = "none";
//             if (collectionValue === "bulk") {
//                 bulkMain();
//             }
//             } else {
//             advancedAccordion.style.display = "block";
//             }
            
//             document.getElementById("search-cell").style.display = "table-cell";
//             errorMessage.innerHTML = "";
//             sessionStorage.setItem("chosenCollection", collectionValue)
//             updateFooter(collectionValue);
//         })
// }


const collAddEventListener = () => {
    
    const advancedAccordion = document.getElementById("advanced-accordion");
    const searchCell = document.getElementById("search-cell");

    const toggleAdvancedAccordion = (orgGroup, collectionValue) => {
        if (["geologi", "paleontologi", "other"].includes(orgGroup)) {
            advancedAccordion.style.display = "none";
            if (collectionValue === "bulk") {
                bulkMain();
            }
        } else {
            advancedAccordion.style.display = "block";
        }
    };

    collection.addEventListener("change", (e) => {
        e.preventDefault();
        emptySearch("collection_listener");

        const orgGroup = sessionStorage.getItem("organismGroup");
        const collectionValue = collection.value;

        toggleAdvancedAccordion(orgGroup, collectionValue);

        searchCell.style.display = "table-cell";
        errorMessage.innerHTML = "";
        sessionStorage.setItem("chosenCollection", collectionValue);

        updateFooter(collectionValue);
    });
};

collAddEventListener(); 


// when a collection is chosen a request is sent to the server about date of last change of the MUSIT-dump file
// string (date)
// is called in oldSearch() and collection-select-eventlistener 

const updateFooter = async (collectionValue) => {
    return new Promise((resolve,reject) => {
        const museum = getCurrentMuseum();
        const fileList = getFileList()
        // const chosenCollection = collection.value;

        // if (chosenCollection) {
        sessionStorage.setItem("chosenCollection", collectionValue);
        const url = `${urlPath}/footer-date/?&samling=${collectionValue}&museum=${museum}`;
        fetch(url)
        .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok, footedate problem");
        }
        return response.text();
        })
        .then((data) => {
            data = JSON.parse(data)
            lastUpdated = textItems.lastUpdated[index] + data.date;
            updated.textContent = lastUpdated;

            let fileList = sessionStorage.getItem('fileList')
            const JSONdata = JSON.parse(fileList);
            let gbifCitation = "";
            JSONdata.forEach((el) => {
            if (el.name === collectionValue) { gbifCitation = el.gbifCitation }
            })
            if (gbifCitation && gbifCitation !== "") {
                document.getElementById("gbif-citation").textContent = textItems.gbifCitation[index] + gbifCitation;
            }
            
            
        })
        .catch((error) => {
            console.error("There is a problem, probably file for collection does not exist", error);
            emptySearch("error in updateFooter()");
            emptyCollection();
            errorMessage.innerHTML = textItems.errorFileNotExisting[index];
            document.getElementById("search-text").style.display = "none";
            document.getElementById("search-button").style.display = "none";
            reject(error)
        })
    })
}
  


const loopButtons = () => {
    orgGroups = sessionStorage.getItem('organismGroups').split(',')
    let orgGroup = sessionStorage.getItem('organismGroup')
    orgGroups.forEach(el => {
        if (el == orgGroup) { 
            document.getElementById(`${el}`).className = "blue-button" 
        } else {
            document.querySelector('#' + el).className = "white-button" 
        }
    })
    
} 

// shows previous search-result when returning to main-page, if it exists in this session
// calls renderText(language), updateFooter(), load()
// is called in search.js, that is, every time main page is rendered
const oldSearch = () => {
    
    
    /////////hva brukes dette til? eksisterer den ikke? nei...
    const vennligst = document.createElement("option")
    vennligst.text = textItems.vennligst[index]
    vennligst.value = 'vennligst'
    vennligst.id = 'vennligst'
    collection.add(vennligst)

    // 'options' is list of collections for the relevant museum
    data = sessionStorage.getItem('options')
    JSONdata = JSON.parse(data)
    JSONdata.forEach(el => {
        elOption = document.createElement("option")
        elOption.text = addTextInCollSelect(el)
        elOption.value = el
        elOption.id = el
        collection.add(elOption)
    })
    if (sessionStorage.getItem('chosenCollection')) {
        collection.value = sessionStorage.getItem('chosenCollection')
    } else {
        collection.value = 'vennligst'
    }

    document.querySelector('#select-cell').style.display = 'block'
    
    if (sessionStorage.getItem('chosenCollection')) {
        if (sessionStorage.getItem('string')) { //hvis det er søkeresultater i sesion storage, så skal disse vises
            // render correct language
            
            if (!sessionStorage.getItem('language')) {
                language = 'Norwegian'
            } else {
                language = sessionStorage.getItem('language')
            }
            
            document.getElementById('search-cell').style.display = 'table-cell'
            renderText(language)
                
            try {
                document.getElementById('collection-select').value = sessionStorage.getItem('chosenCollection')
                document.getElementById('search-text').value = sessionStorage.getItem('searchTerm')
                nbHitsElement.innerHTML = JSON.parse(sessionStorage.getItem('string')).length
                nbHitsElement.style.color = 'black'
            } catch (error) {
                console.log('local storage empty');    
            }
            if (sessionStorage.getItem('numberPerPage')) {
                document.getElementById('number-per-page').value = sessionStorage.getItem('numberPerPage')
            } else {
                document.getElementById('number-per-page').value = '20'
            }
            
            updateFooter(collection.value)                
            // sends the data to the functions that show the results
            load()
        }
    } 
    
}

emptySearchButton.addEventListener('click', (e) => {
    e.preventDefault()
    // erase the last search result
    emptySearch('button')
    // close accordions
    document.getElementsByClassName('panel')[0].style.display = 'none'
    document.getElementsByClassName('panel')[1].style.display = 'none'

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

const select = document.getElementById('checkboxSelect')
if (JSON.parse(sessionStorage.getItem('pageList'))) {
    pageList = JSON.parse(sessionStorage.getItem('pageList'))
}

if(select) {
    select.onchange =() => {
        checkSeveralBoxes(pageList)
    }
}

window.onload = function () {
    if (window.performance) {
        if (performance.navigation.type == 1) {
            emptySearch('window.onload')
            emptyCollection()
        
        } else {
            //run the function
            if (sessionStorage.getItem('organismGroup')) {
                oldSearch() 
            }
        }
    }
}

async function main () {
    await getFileList()
    await getOrganismGroups()
    makeButtons()
    await collAddEventListener() //578
    
}
main()
