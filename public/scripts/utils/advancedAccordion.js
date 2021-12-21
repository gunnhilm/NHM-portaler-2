
// accordion
var acc = document.getElementsByClassName("accordion");
var accIcons = document.getElementsByClassName("accordion-icon")
var i;
for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
            console.log(this.children[1])
            this.children[1].innerHTML = '+'
        } else {
            panel.style.display = "block";
            this.children[1].innerHTML = '-'
        }
    });
}


const advSearchForm = document.querySelector('#adv-search-form') 
const termNameArray = ["adv-object", "adv-species", "adv-collector", "adv-date", "adv-country", "adv-county", "adv-municipality", "adv-locality", "adv-collNo", "adv-taxType"]

document.querySelector('#hasPhotoLabel').innerHTML = textItems.hasPhoto[index]
document.querySelector('#hasNotPhotoLabel').innerHTML = textItems.hasNotPhoto[index]
document.querySelector('#irrPhotoLabel').innerHTML = textItems.irrPhoto[index]

// deletes previous search results, resets value that says if search failed, resets Boolean sorting-values for result, hides buttons, performs search
// in: limit (number, line number of search result where search stops)
// calls resetSortedBoolean in paginateAndRender.js
//      emptyTable() in resultElementsOnOff.js
//      emptyResultElements() in resultElementOnOff.js
// is called by searchForm.eventlistener
const doAdvancedSearch = (limit = 20) => {
    // delete the previous search results
    sessionStorage.removeItem('string')
    sessionStorage.removeItem('currentPage')
    sessionStorage.removeItem('numberPerPage')
    sessionStorage.removeItem('propsSorted')
    document.getElementById("map-search").innerHTML = ""  
    // reset searchFailed value
    searchFailed = false
    resetSortedBoolean() // set all booleans in propsSorted-array in PaginateAndRender.js to false

    const searchSpecies = document.querySelector('#adv-species').value
    const searchCollector = document.querySelector('#adv-collector').value
    const searchDate = document.querySelector('#adv-date').value
    const searchCountry = document.querySelector('#adv-country').value
    const searchCounty = document.querySelector('#adv-county').value
    const searchMunicipality = document.querySelector('#adv-municipality').value
    const searchLocality = document.querySelector('#adv-locality').value
    const searchCollNo = document.querySelector('#adv-collNo').value
    const searchTaxType = document.querySelector('#adv-taxType').value
    let hasPhoto
    if (document.querySelector('#hasPhoto').checked) {
        hasPhoto = "hasPhoto"
    } else if (document.querySelector ('#hasNotPhoto').checked) {
        hasPhoto = "hasNotPhoto"
    } else {
        hasPhoto = "irr"
    }

    
    sessionStorage.setItem('advSearchArray', [searchSpecies,searchCollector,searchDate,searchCountry,searchMunicipality,searchLocality,searchCollNo,searchTaxType])
    const chosenCollection = collection.value
    sessionStorage.setItem('chosenCollection', JSON.stringify(chosenCollection))
    searchLineNumber = limit
    sessionStorage.setItem('limit', limit)

    let museum = getCurrentMuseum()   

    sessionStorage.setItem('museum',museum)
    emptyTable()

    // Show please wait
    document.getElementById("please-wait").style.display = "block"
    // hide download button
    emptyResultElements()
    console.log(chosenCollection)
    // mustChoose
    if (!chosenCollection) {
        errorMessage.innerHTML = textItems.mustChoose[index]
        document.getElementById("please-wait").style.display = "none"
        
    } 
    //else if (chosenCollection === "utad") {
      //  const  url = urlPath + 
    //} 
    else {
        const url = urlPath + '/advSearch/?searchSpecies=' + searchSpecies + '&searchCollector=' + searchCollector + 
        '&searchDate=' + searchDate + '&searchCountry=' + searchCountry + '&searchCounty=' + searchCounty + 
        '&searchMunicipality=' + searchMunicipality + '&searchLocality=' + searchLocality + '&searchCollNo=' + searchCollNo + '&searchTaxType=' + searchTaxType + '&museum=' + museum + 
        '&samling=' + chosenCollection + '&linjeNumber=0' + '&limit=' + limit  + '&hasPhoto=' + hasPhoto
        fetch(url).then((response) => {
            if (!response.ok) {
                console.log('her')
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
                            sessionStorage.setItem('advSearchArray', [searchSpecies,searchCollector,searchDate,searchCountry,searchMunicipality,searchLocality,searchCollNo,searchTaxType])
    
                            // sessionStorage.setItem('searchSpecies', searchSpecies)
                            // sessionStorage.setItem('searchCounty', searchCounty)
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
                                    if(parsedResults.data.length > 999){
                                        nbHitsElement.textContent = textItems.tooManyHits[index]
                                        nbHitsElement.style.color = 'red'
                                    } else {
                                        nbHitsElement.textContent = parsedResults.data.length
                                        nbHitsElement.style.color = 'black'
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
advSearchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    doAdvancedSearch(1000) // vi skal få tilbake maks 1000 linjer med svar
})  

const doObjListSearch = (limit = 20) => {
    // delete the previous search results
    sessionStorage.removeItem('string')
    sessionStorage.removeItem('currentPage')
    sessionStorage.removeItem('numberPerPage')
    sessionStorage.removeItem('propsSorted')
    document.getElementById("map-search").innerHTML = ""  
    // reset searchFailed value
    searchFailed = false
    resetSortedBoolean() // set all booleans in propsSorted-array in PaginateAndRender.js to false

    const searchObjects = document.querySelector('#obj-list-input').value
        
    sessionStorage.setItem('objList', searchObjects)
    const chosenCollection = collection.value
    sessionStorage.setItem('chosenCollection', JSON.stringify(chosenCollection))
    searchLineNumber = limit
    sessionStorage.setItem('limit', limit)

    let museum = getCurrentMuseum()   

    sessionStorage.setItem('museum',museum)
    emptyTable()

    // Show please wait
    document.getElementById("please-wait").style.display = "block"
    // hide download button
    emptyResultElements()
    console.log(chosenCollection)
    // mustChoose
    if (!chosenCollection) {
        errorMessage.innerHTML = textItems.mustChoose[index]
        document.getElementById("please-wait").style.display = "none"
        
    } 
    //else if (chosenCollection === "utad") {
      //  const  url = urlPath + 
    //} 
    else {
        const url = urlPath + '/objListSearch/?searchObjects=' + searchObjects + '&museum=' + museum + 
        '&samling=' + chosenCollection + '&linjeNumber=0' + '&limit=' + limit
        fetch(url).then((response) => {
            if (!response.ok) {
                console.log('her')
                throw 'noe går galt med objektliste-søk, respons ikke ok'
                
            } else {
                try {

                    response.text().then((data) => {
                        if(data.error) {
                            errorMessage.innerHTML = textItems.serverError[index]
                            return console.log(data.error)
                        } else {
                            const JSONdata = JSON.parse(data)  
                            
                            sessionStorage.setItem('searchLineNumber', JSONdata.unparsed.count)
                            sessionStorage.setItem('objList', searchObjects)
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
                                    if(parsedResults.data.length > 999){
                                        nbHitsElement.textContent = textItems.tooManyHits[index]
                                        nbHitsElement.style.color = 'red'
                                    } else {
                                        nbHitsElement.textContent = parsedResults.data.length
                                        nbHitsElement.style.color = 'black'
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
document.getElementById('obj-list-form').addEventListener('submit', (e) => {
    e.preventDefault()
    doObjListSearch(1000) // vi skal få tilbake maks 1000 linjer med svar
})  