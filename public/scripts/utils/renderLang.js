// urlPath er definert i textItems.js


// textItems[] is in separate file textItems.js

const renderText = function(lang) {
    if (lang === "English") {
        index = 1
    } else {
        index = 0
    }
    
    //header
    document.querySelector('#help-link').innerHTML = textItems.helpButton[index]
    document.querySelector('#statistikk-link').innerHTML = textItems.statistikkButton[index]
    document.querySelector('#search-page-link').innerHTML = textItems.searchPageLink[index]
    document.querySelector('#journal-link').innerHTML = textItems.journalLink[index]
    document.querySelector('#menu_help-link').innerHTML = textItems.helpButton[index]
    document.querySelector('#menu_statistikk-link').innerHTML = textItems.statistikkButton[index]
    document.querySelector('#menu_search-page-link').innerHTML = textItems.searchPageLink[index]
    document.querySelector('#menu_journal-link').innerHTML = textItems.journalLink[index]
    document.querySelector('#mobileMenuBtn').innerHTML = textItems.mobileMenuBtn[index]

    let logo = document.querySelector('#logo')
    if (window.location.href.includes('tmu')) {
        logo.src = textItems.logoTMU[index]
    } else if (window.location.href.includes('um')) {
        logo.src = textItems.logoUM[index]
    } else {
        logo.src = textItems.logoNHM[index]
    }
    
    

    /* When the user clicks on the menu-button (mobile-screens),
    toggle between hiding and showing the dropdown content */
    document.getElementById("mobileMenuBtn").onclick = function () {
        document.getElementById("myDropdown").classList.toggle("show");
    }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
    

    //Dropdown med valg av samlinger, index page og stat page
    if (!location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help') & !location.href.includes('corema') & !location.href.includes('map') & !location.href.includes('journaler') & !location.href.includes('getDOI')) {
        // document.querySelector('#specimensOptgroup').innerHTML = textItems.specimensOptgroup[index]
        document.querySelector('#karplanter').innerHTML = textItems.karplanter[index]
        document.querySelector('#sopp').innerHTML = textItems.sopp[index]
        document.querySelector('#moser').innerHTML = textItems.moser[index]
        document.querySelector('#lav').innerHTML = textItems.lav[index]
        document.querySelector('#alger').innerHTML = textItems.alger[index]
        document.querySelector('#insekter').innerHTML = textItems.insekter[index]
        // document.querySelector('#coremaopt').innerHTML = textItems.coremaopt[index]
        document.querySelector('#fugler').innerHTML = textItems.fugler[index]
        document.querySelector('#pattedyr').innerHTML = textItems.pattedyr[index]
        document.querySelector('#dna_karplanter').innerHTML = textItems.karplanter[index]
        document.querySelector('#dna_insekter').innerHTML = textItems.insekter[index]
        document.querySelector('#dna_fish_herptiles').innerHTML = textItems.fishHerp[index]
        document.querySelector('#dna_fungi_lichens').innerHTML = textItems.fungiLichens[index]
        document.querySelector('#dna_other').innerHTML = textItems.other[index]
        
    }

    // index page
    if (!location.href.includes('showStat') & !location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help') & !location.href.includes('corema') & !location.href.includes('map') & !location.href.includes('journaler')& !location.href.includes('getDOI')) {
        
        document.querySelector('#vennligst').innerHTML = textItems.vennligst[index] 
        
        document.querySelector('#search-button').innerHTML = textItems.searchButton[index]
        document.querySelector('#empty-search-button').innerHTML = textItems.emptySearch[index]
        document.querySelector('#header-search-page').innerHTML = textItems.headerSearchPage[index]
        //document.querySelector('#select-collection-label').innerHTML = textItems.selectCollectionLabel[index]
        document.querySelector('#hits-per-page').innerHTML = textItems.hitsPerPage[index]
        if (sessionStorage.getItem('string')) {
            document.getElementById("head-nb-hits").innerHTML = textItems.nbHitsText[index]
        }
        document.querySelector('#download-button').innerHTML = textItems.downloadLink[index]
        document.querySelector('#download-photo-button').innerHTML = textItems.downloadPhoto[index]
        document.querySelector('#search-text').placeholder = textItems.placeholder[index]
        document.getElementById('zoom-expl-popup').innerHTML = textItems.mapHelpContent[index]
        document.querySelector('#zoom-button').innerHTML = textItems.zoomButton[index]
        document.querySelector('#large-map-button').innerHTML = textItems.largeMapButton[index]
        document.querySelector('#export-png').innerHTML = textItems.downloadMapButton[index]
        document.querySelector('#checkedInMap').innerHTML = textItems.checkedInMap[index]
        document.querySelector('#first').value = textItems.firstButton[index]
        document.querySelector('#previous').value = textItems.previousButton[index]
        document.querySelector('#next').value = textItems.nextButton[index]
        document.querySelector('#last').value = textItems.lastButton[index]
        document.querySelector('#first1').value = textItems.firstButton[index]
        document.querySelector('#previous1').value = textItems.previousButton[index]
        document.querySelector('#next1').value = textItems.nextButton[index]
        document.querySelector('#last1').value = textItems.lastButton[index]
        if(document.getElementById("resultPageText").innerHTML) {
            document.getElementById("resultPageText").innerHTML = textItems.page[index]
        }
        if(document.getElementById("resultPageAlert").innerHTML) {
            document.getElementById("resultPageAlert").innerHTML = textItems.lastPageAlert[index]
        }
        if(document.getElementById("resultPageText1").innerHTML) {
            document.getElementById("resultPageText1").innerHTML = textItems.page[index]
        }
        if(document.getElementById("resultPageAlert1").innerHTML) {
            document.getElementById("resultPageAlert1").innerHTML = textItems.lastPageAlert[index]
        }
        // what did we mean here?
        // kutt
        // if(!document.querySelector("#map-search").innerHTML) {
        //     document.querySelector("#map-search").innerHTML = textItems.mapSearchAlt[index]
        // }
    }

    // object page
    if (location.href.includes('object')) {
        // read string and get the object from sessionStorage (for the object-page)
        const loadString = () => {
            
            const objectJSON = sessionStorage.getItem('string')
            
            try {//object
                return objectJSON ? JSON.parse(objectJSON) : []
            } catch (e) {
                return []
            }
        }
        //get the object from session storage
        const allObject = loadString()
        
        // get the id from the url
        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('id')

        const object = allObject.find(x => x.catalogNumber === id)
        

        
        document.querySelector("#head-species-name").innerHTML = textItems.headSpeciesName[index]
        document.querySelector("#head-det").innerHTML = textItems.headDet[index]
        document.querySelector("#head-det-date").innerHTML = textItems.headDetDate[index]
        document.querySelector("#head-coll-date").innerHTML = textItems.headCollDate[index]
        document.querySelector("#head-coll").innerHTML = textItems.headColl[index]
        document.querySelector("#head-locality").innerHTML = textItems.headLocality[index]
        document.querySelector("#head-coordinates").innerHTML = textItems.headCoordinates[index]

        document.querySelector("#photo-box").alt = textItems.photoAlt[index]
        document.querySelector("#next-photo").innerHTML = textItems.nextPhoto[index]
        document.querySelector("#previous-photo").innerHTML = textItems.previousPhoto[index]
        
        if(!object.decimalLatitude | !object.decimalLongitude) {
            document.querySelector("#map-object").innerHTML = textItems.mapAlt[index]
        }

        if (object.ArtObsID) {
            document.querySelector("#head-artsobs").innerHTML = textItems.headArtsobs[index]
        }
        if (object.habitat ) {
            document.querySelector("#head-habitat").innerHTML = "Habitat: "
        }
        if (object.sex) {
            document.querySelector("#head-sex").innerHTML = textItems.headSex[index]
        }
        if (object.lifeStage) {
            document.querySelector("#head-lifeStage").innerHTML = textItems.headLifeStage[index]
        }
        if (object.samplingProtocol) {
            document.querySelector("#head-samplingProtocol").innerHTML = textItems.headSamplingProtocol[index]
        }
        if (object.kingdom || object.class || object.order || object.family) {
            document.querySelector("#head-taxonomy").innerHTML = textItems.headTaxonomy[index]
        }
        if (object.typeStatus) {
            document.querySelector("#head-typeStatus").innerHTML = textItems.headTypeStatus[index]
        }
        
        //document.querySelector("#itemsHeader").innerHTML = textItems.itemsHeader[index]
        if (!window.location.href.includes('um') && !window.location.href.includes('tmu')) {
            document.querySelector("#preservedSp").innerHTML = textItems.preservedSp[index]
        }
        


        document.getElementById('zoom-expl-popup').innerHTML = textItems.mapHelpContent[index]
        document.getElementById('large-map-object-button').innerHTML = textItems.largeMapButton[index]
     
    }
    
    // Stat page
    if (location.href.includes('showStat')) {
        document.querySelector('#showStatHeader').innerHTML = textItems.showStatHeader[index]
        document.querySelector('#showStatText').innerHTML = textItems.showStatText[index]
        document.querySelector('#total').innerHTML = textItems.total[index] // ekstra valg på dropp dawn
        document.querySelector('#Collection_header').innerHTML = textItems.collectionHeader[index]
        document.querySelector('#NbObj_header').innerHTML = textItems.nbObjHeader[index]
        document.querySelector('#NbPhoto_header').innerHTML = textItems.nbPhotoHeader[index]
        document.querySelector('#NbCoord_header').innerHTML = textItems.nbCoordHeader[index]
        document.querySelector('#Vascular_header').innerHTML = textItems.karplanter[index]
        document.querySelector('#Mosses_header').innerHTML = textItems.moser[index]
        document.querySelector('#Fungi_header').innerHTML = textItems.sopp[index]
        document.querySelector('#Lichen_header').innerHTML = textItems.lav[index]
        document.querySelector('#Insects_header').innerHTML = textItems.insekter[index]
        document.querySelector('#Birds_header').innerHTML = textItems.fugler[index]
        document.querySelector('#Mammals_header').innerHTML = textItems.pattedyr[index]
        
    }

    // about page
    if (location.href.includes('about')) {
        document.querySelector('#aboutHeader').innerHTML = textItems.aboutHeader[index]
        document.querySelector('#aboutText').innerHTML = textItems.aboutText[index]
    }

    // help page
    if (location.href.includes('help')) {
        document.querySelector('#helpHeader').innerHTML = textItems.helpHeader[index]
        document.querySelector('#helpText').innerHTML = textItems.helpText[index]
    }

    // journals page
    if (location.href.includes('journaler')) {
        document.querySelector('#header-journal-page').innerHTML = textItems.journalHeader[index]
        //document.querySelector('#helpText').innerHTML = textItems.helpText[index]
    }

    // getDOI page
    if (location.href.includes('getDOI')) {
        document.querySelector('#getDOIHeader').innerHTML = textItems.getDOIHeader[index]
        document.querySelector('#selectCollection').innerHTML = textItems.selectCollection[index] 
        document.querySelector('#onloggingData').innerHTML = textItems.onloggingData[index]
        document.querySelector('#emailRequest').innerHTML = textItems.emailRequest[index]
        document.querySelector('#usernameRequest').innerHTML = textItems.usernameRequest[index]
        document.querySelector('#passwordRequest').innerHTML = textItems.passwordRequest[index]
        document.querySelector('#pasteRequest').innerHTML = textItems.pasteRequest[index]
        document.querySelector('#resetButton').innerHTML = textItems.resetButton[index]
        document.querySelector('#results').innerHTML = textItems.results[index]
    }
}

let language
if (sessionStorage.language) {
    language = sessionStorage.getItem('language')
    document.querySelector('#language').value = language
} else {
    language = document.querySelector('#language').value
    sessionStorage.setItem('language', language)
}

renderText(language)


document.querySelector('#language').addEventListener('change', (e) => {
    language = e.target.value
    renderText(language)
    sessionStorage.setItem('language', language)
   
    if (!location.href.includes('showStat') & !location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help') & !location.href.includes('corema') & !location.href.includes('map') & !location.href.includes('journaler') & !location.href.includes('getDOI')) {
        if (document.querySelector("#head-nb-hits").innerHTML) {

            if (language === "Norwegian") {
                index = 0
            } else if (language === "English") {
                index = 1
            }

            document.querySelector('#head-nb-hits').innerHTML = textItems.nbHitsText[index]
            document.querySelector('#download-button').innerHTML = textItems.downloadLink[index]
            document.querySelector('#download-photo-button').innerHTML = textItems.downloadPhoto[index]
            document.querySelector('#large-map-button').innerHTML = textItems.largeMapButton[index]
            document.querySelector('#export-png').innerHTML = textItems.downloadMapButton[index]
            document.querySelector('#checkedInMap').innerHTML = textItems.checkedInMap[index]   
            document.querySelector('#first').innerHTML = textItems.firstButton[index]
            document.querySelector('#previous').innerHTML = textItems.previousButton[index]
            document.querySelector('#next').innerHTML = textItems.nextButton[index]
            document.querySelector('#last').innerHTML = textItems.lastButton[index]
            document.querySelector('#first1').innerHTML = textItems.firstButton[index]
            document.querySelector('#previous1').innerHTML = textItems.previousButton[index]
            document.querySelector('#next1').innerHTML = textItems.nextButton[index]
            document.querySelector('#last1').innerHTML = textItems.lastButton[index]
            document.getElementById("resultPageText").style.display = "inline-block"
            document.getElementById("resultPageText").innerHTML = textItems.page[index]
            if(document.getElementById("resultPageAlert").innerHTML) {
                document.getElementById("resultPageAlert").innerHTML = textItems.lastPageAlert[index]
            }
            document.getElementById("resultPageText1").style.display = "inline-block"
            document.getElementById("resultPageText1").innerHTML = textItems.page[index]
            if(document.getElementById("resultPageAlert1").innerHTML) {
                document.getElementById("resultPageAlert1").innerHTML = textItems.lastPageAlert[index]
            }

            const headerRow = document.querySelector("#myTable").rows[0]

            cell2 = headerRow.cells[1]
            cell3 = headerRow.cells[2]
            cell4 = headerRow.cells[3]
            cell5 = headerRow.cells[4]
            cell6 = headerRow.cells[5]
            cell7 = headerRow.cells[6]
            cell10 = headerRow.cells[9]
            cell11 = headerRow.cells[10]
 
            cell2.innerHTML = `<button id='scientificNameButton' class='sort'>${textItems.headerTaxon[index].bold()} ${getArrows('scientificName')} </button>`
            cell3.innerHTML = `<button id='collectorButton' class='sort'>${textItems.headerCollector[index].bold()} ${getArrows('recordedBy')}</button>`
            cell4.innerHTML = `<button id='dateButton' class='sort'>${textItems.headerDate[index].bold()} ${getArrows('eventDate')}</button>`
            cell5.innerHTML = `<button id='countryButton' class='sort'>${textItems.headerCountry[index].bold()} ${getArrows('country')}</button>`
            cell6.innerHTML = `<button id='municipalityButton' class='sort'>${textItems.headerMunicipality[index].bold()} ${getArrows('county')}</button>`
            cell7.innerHTML = `<button id='localityButton' class='sort'>${textItems.headerLocality[index].bold()} ${getArrows('locality')}</button>`
            if (document.querySelector('#collection-select option:checked').parentElement.label === 'Specimens') {
                cell10.innerHTML = `<button id='coremaNoButton' class='sort'>${textItems.headerCoremaNo[index].bold()} ${getArrows('coremaNo')}</button>`
            } else {
                cell10.innerHTML = `<button id='sampleTypeButton' class='sort'>${textItems.headerSampleTypes[index].bold()} ${getArrows('sampleType')}</button>`
            }
            cell11.innerHTML = `<select id='checkboxSelect' class='sort'>
                    <option value="select" id="select">${textItems.select[index].bold()}</option>
                    <option value="all" id="selectAll">${textItems.selectAll[index]}</option>
                    <option value="all_on_page" id="selectAllOnPage">${ textItems.selectAllOnPage[index]}</option>
                    <option value="none" id="selectNone">${ textItems.selectNone[index]}</option>
                </select>`


            

            stringData = sessionStorage.getItem('string')
            musitData = JSON.parse(stringData)      
            addSortingText('scientificNameButton', 2, 'scientificName', musitData)
            addSortingText('collectorButton', 3, 'recordedBy', musitData)
            addSortingText('dateButton', 4, 'eventDate', musitData)
            addSortingText('countryButton', 5, 'country', musitData)
            addSortingText('municipalityButton', 6, 'county', musitData)
            addSortingText('localityButton', 7, 'locality', musitData)
                // // addSortingText('sampleTypeButton', 10, 'sampleType', musitData)
                // // addSortingText('processIDButton', 11, 'processID', musitData)
            
        }
    }
})


