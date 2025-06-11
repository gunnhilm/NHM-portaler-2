function searchTab(evt, searchType ) {
    document.getElementById("obj-panel").style.display = "block"
    document.getElementById("advanced-panel").style.display = "block"
    
    // Declare all variables
    let i, tabcontent, tablinks;
    
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(searchType).style.display = "block";

    
    evt.currentTarget.className += " active";
      
  }

// render search-fields in search-page; HTML elements
const renderAdvSearchFields = (searchFields) => {   
    const advTable = document.getElementById("adv_table");
    const row = advTable.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    cell1.className = 'adv_cell';
    cell2.className = 'adv_cell';

    searchFields.forEach((el, index) => {
        const inputElement = document.createElement("input");
        inputElement.id = el;
        inputElement.type = "text";
        inputElement.className = "input-tight";
        inputElement.style = "margin-bottom:10px; margin-left:10px";
        const targetCell = index < searchFields.length / 2 ? cell1 : cell2;
        targetCell.append(inputElement);
    });

    // radio-buttons for photos
    const radioConfigs = [
        { id: 'hasPhoto', label: 'Has Photo' }, 
        { id: 'hasNotPhoto', label: 'No Photo' }, 
        { id: 'irrPhoto', label: 'Irrelevant Photo' }
    ];

    radioConfigs.forEach(config => {
        const radioDiv = document.createElement("div");
        radioDiv.id = "radio-form";
        radioDiv.style = "float:left; width:200px";
        cell2.append(radioDiv);

        const radioButton = document.createElement("input");
        radioButton.id = config.id;
        radioButton.type = "radio";
        radioButton.name = "radio-photo";
        radioDiv.append(radioButton);

        const radioLabel = document.createElement("label");
        radioLabel.htmlFor = config.id;
        radioLabel.id = config.id + 'Label';
        radioLabel.className = "label-tight";
        radioLabel.textContent = config.label; // Adding label text
        radioDiv.append(radioLabel);
    });

    const buttonDiv = document.createElement("div");
    buttonDiv.style = "float:right; width:60px; display:inline";
    cell2.append(buttonDiv);

    const advSearchButton = document.createElement("button");
    advSearchButton.className = "blue-button";
    advSearchButton.id = "adv-search-button";
    advSearchButton.style = "float:right";
    advSearchButton.innerHTML = textItems.searchButton[index];
    buttonDiv.append(advSearchButton); // Add button to the buttonDiv
};


const advSearchForm = document.querySelector('#adv-search-form') 
const termNameArray = ["adv-species", "adv-collector", "adv-date", "adv-country", "adv-county", "adv-municipality", "adv-locality", "adv-collNo", "adv-taxType"]

// render search fields

renderAdvSearchFields(termNameArray)
fillSearchFields()
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
    // // delete the previous search results
    // sessionStorage.removeItem('string')
    // sessionStorage.removeItem('currentPage')
    // sessionStorage.removeItem('numberPerPage')
    // sessionStorage.removeItem('propsSorted')
    // document.getElementById("map-search").innerHTML = ""  
    // reset searchFailed value
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

    searchFailed = false
    let museum = getCurrentMuseum()   
    resetSortedBoolean() // set all booleans in propsSorted-array in PaginateAndRender.js to false
    //clean up previous search
    resetSessionStorage(collection, search, limit, museum)
    // hide download button
    emptyResultElements()

    sessionStorage.setItem('advSearchArray', [searchSpecies,searchCollector,searchDate,searchCountry,searchMunicipality,searchLocality,searchCollNo,searchTaxType])
    const chosenCollection = collection.value
    sessionStorage.setItem('chosenCollection', chosenCollection)
    searchLineNumber = limit
    sessionStorage.setItem('limit', limit)

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
    else {
        const url = urlPath + '/advSearch/?searchSpecies=' + searchSpecies + '&searchCollector=' + searchCollector + 
        '&searchDate=' + searchDate + '&searchCountry=' + searchCountry + '&searchCounty=' + searchCounty + 
        '&searchMunicipality=' + searchMunicipality + '&searchLocality=' + searchLocality + '&searchCollNo=' + searchCollNo + '&searchTaxType=' + searchTaxType + '&museum=' + museum + 
        '&samling=' + chosenCollection + '&linjeNumber=0' + '&limit=' + limit  + '&hasPhoto=' + hasPhoto
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
                            const parsedResults = JSONdata.unparsed.results
                            sessionStorage.setItem('searchLineNumber', JSONdata.unparsed.count)

                            //check if there are any hits from the search
                            if ( parsedResults === undefined || parsedResults.length === 0 ) {
                                nbHitsElement.innerHTML = textItems.noHits[index]
                            } else {
                                try {
                                    // hvis vi får flere enn 2000 treff må vi si i fra om det
                                    if(parsedResults.length > 3999){
                                        nbHitsElement.textContent = textItems.tooManyHits[index]
                                        nbHitsElement.style.color = 'red'
                                    } else {
                                        nbHitsElement.textContent = parsedResults.length
                                        nbHitsElement.style.color = 'black'
                                    }
                                    nbHitsHeader.innerHTML = textItems.nbHitsText[index]
                                    nbHitsHeader.style.display = 'inline'
                                    // replace , with . if necessary
                                    if(chosenCollection === 'fossiler' || chosenCollection === 'palTyper') {
                                        let coordString = ''
                                        const regex = /,/i;
                                        parsedResults.forEach(function(item, index) {

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
                                    sessionStorage.setItem('string', JSON.stringify(parsedResults))                                    
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
advSearchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    doAdvancedSearch(4000) // vi skal få tilbake maks 1000 linjer med svar
})  

const doObjListSearch = (limit = 20) => {
    // delete the previous search results
    // sessionStorage.removeItem('string')
    // sessionStorage.removeItem('currentPage')
    // sessionStorage.removeItem('numberPerPage')
    // sessionStorage.removeItem('propsSorted')
    // document.getElementById("map-search").innerHTML = ""  
    
    // reset searchFailed value
    searchFailed = false
    let museum = getCurrentMuseum()   
    resetSortedBoolean() // set all booleans in propsSorted-array in PaginateAndRender.js to false
    //clean up previous search
    resetSessionStorage(collection, search, limit, museum)

    const searchObjects = document.querySelector('#obj-list-input').value
        
    sessionStorage.setItem('objList', searchObjects)
    const chosenCollection = collection.value
    sessionStorage.setItem('chosenCollection', chosenCollection)
    searchLineNumber = limit
    sessionStorage.setItem('limit', limit)
   

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
        
    } 
    //else if (chosenCollection === "utad") {
      //  const  url = urlPath + 
    //} 
    else {
        const url = urlPath + '/objListSearch/?searchObjects=' + searchObjects + '&museum=' + museum + 
        '&samling=' + chosenCollection + '&linjeNumber=0' + '&limit=' + limit
        
        fetch(url).then((response) => {
            if (!response.ok) {
                errorMessage.innerHTML = 'feil i url-lengde'
                throw 'noe går galt med objektliste-søk, respons ikke ok'
                
            } else {
                try {
                    console.log(url)
                    response.text().then((data) => {
                        if(data.error) {
                            errorMessage.innerHTML = textItems.serverError[index]
                            return console.log(data.error)
                        } else {

                            const JSONdata = JSON.parse(data)  
                            console.log(JSONdata);
                            
                            const parsedResults = JSONdata.unparsed.results
                            sessionStorage.setItem('searchLineNumber', JSONdata.unparsed.count)
                            
 
                            //check if there are any hits from the search
                            if ( parsedResults === undefined || parsedResults.length === 0 ) {
                                nbHitsElement.innerHTML = textItems.noHits[index]
                            } else {
                                try {
                                    // hvis vi får flere enn 2000 treff må vi si i fra om det
                                    if(parsedResults.length > 3999){
                                        nbHitsElement.textContent = textItems.tooManyHits[index]
                                        nbHitsElement.style.color = 'red'
                                    } else {
                                        nbHitsElement.textContent = parsedResults.length
                                        nbHitsElement.style.color = 'black'
                                    }
                                    nbHitsHeader.innerHTML = textItems.nbHitsText[index]
                                    nbHitsHeader.style.display = 'inline'
                                    // replace , with . if necessary
                                    if(chosenCollection === 'fossiler' || chosenCollection === 'palTyper') {
                                        let coordString = ''
                                        const regex = /,/i;
                                        parsedResults.forEach(function(item, index) {

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

                                    sessionStorage.setItem('string', JSON.stringify(parsedResults))      
                                    
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
            nbHitsElement.innerHTML = textItems.serverErrorObj[index]
            
            document.getElementById("please-wait").style.display = "none"
        })
    }
}                  


// when somebody clicks search-button
document.getElementById('obj-list-form').addEventListener('submit', (e) => {
    e.preventDefault()
    doObjListSearch(4000) // vi skal få tilbake maks 1000 linjer med svar
})  


