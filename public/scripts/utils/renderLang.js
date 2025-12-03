// renderLang.js: Renders text in relevant language (Norwegian or English) when page is rendered, and when language is changed

// urlPath er definert i textItems.js
// textItems[] is in separate file textItems.js


// enables species name in italic and author in non-italic
// in: scientific species name; string
// out: two strings (in an array); name in one string and 
// author in another
// is called in showData()
const italicSpeciesname = (string) => {   
    string = string.trim()
    let author = ''
    let array = string.split(" ")
    let name = array[0]
    let nameFinished = false
    for (let i = 1; i< array.length; i++) {
        characters = array[i].split('')
        if (characters.length > 0) {
            if (characters[0] == characters[0].toUpperCase()) {
                nameFinished = true
                author = author + ' ' + array[i]
            } else {
                if (nameFinished == false) {
                    name = name + ' ' + array[i]
                } else {
                    author = author + ' ' + array[i]
                }
            }
        }
    }
    let nameAuthor = [name, author]
    
    return(nameAuthor)
}

// puts placeholder text in search fields in "Advanced Search"
//
const fillSearchFields = () => {
    if (document.querySelector('#adv-object')) {document.querySelector('#adv-object').placeholder = textItems.placeholderObject[index]}
    
    const orgGroup = sessionStorage.getItem('organismGroup')
    if (orgGroup === 'geologi') {
        if (document.querySelector('#adv-species')) {document.querySelector('#adv-species').placeholder = textItems.placeholderGeoSpecies[index]}    
    } else if (orgGroup === 'paleontologi') {
        if (document.querySelector('#adv-species')) {document.querySelector('#adv-species').placeholder = textItems.placeholderPalSpecies[index]}    
    } else {
        if (document.querySelector('#adv-species')) {document.querySelector('#adv-species').placeholder = textItems.placeholderSpecies[index]}
    }
    
    if (document.querySelector('#adv-collector')) {document.querySelector('#adv-collector').placeholder = textItems.placeholderCollector[index]}
    if (document.querySelector('#adv-date')) {document.querySelector('#adv-date').placeholder = textItems.placeholderDate[index]}
    if (document.querySelector('#adv-country')) {document.querySelector('#adv-country').placeholder = textItems.placeholderCountry[index]}
    if (document.querySelector('#adv-county')) {document.querySelector('#adv-county').placeholder = textItems.placeholderCounty[index]}
    if (document.querySelector('#adv-municipality')) {document.querySelector('#adv-municipality').placeholder = textItems.placeholderMunicipality[index]}
    if (document.querySelector('#adv-locality')) {document.querySelector('#adv-locality').placeholder = textItems.placeholderLocality[index]}
    if (document.querySelector('#adv-collNo')) {document.querySelector('#adv-collNo').placeholder = textItems.placeholderCollNo[index]}
    if (document.querySelector('#adv-taxType')) {document.querySelector('#adv-taxType').placeholder = textItems.placeholderTaxType[index]}
    if (document.querySelector('#hasPhotoLabel')) {document.querySelector('#hasPhotoLabel').innerHTML = textItems.hasPhoto[index]}
    if (document.querySelector('#hasNotPhotoLabel')) {document.querySelector('#hasNotPhotoLabel').innerHTML = textItems.hasNotPhoto[index]}
    if (document.querySelector('#irrPhotoLabel')) {document.querySelector('#irrPhotoLabel').innerHTML = textItems.irrPhoto[index]}
    if (document.querySelector('#obj-list-input')) {document.querySelector('#obj-list-input').placeholder = textItems.placeholderList[index]}
}
// renders text and images in html-elements
// in: lang (string, «Norwegian» or «English»)
// out: text or images in relevant HTML-elements
// is called in renderLang.js
function renderText (lang) {
    if (lang === "English") {
        index = 1
    } else {
        index = 0
    }
    
    renderHeaderContent(lang)
    
    // //Dropdown med valg av samlinger, index page og stat page
    const excludedKeywordsDropdown = ['about', 'archive', 'advancedSearch', 'checkCoord', 'corema', 'dataError', 'getDOI', 'help', 'journaler', 'map', 'object', 'showStat', 'tools'];
    if (!excludedKeywordsDropdown.some(keyword => location.href.includes(keyword))) {
        const indexElementsToUpdate = [
            { selector: '#vennligst', key: 'vennligst' },
            { selector: '#vascular', key: 'vascular' },
            { selector: '#sopp', key: 'sopp' },
            { selector: '#moser', key: 'moser' },
            { selector: '#lav', key: 'lav' },
            { selector: '#alger', key: 'alger' },
            { selector: '#entomology', key: 'insekter' },
            { selector: '#entomology_types', key: 'insectTypes' },
            { selector: '#invertebrates', key: 'invertebrates' },
            { selector: '#crustacea', key: 'crustacea' },
            { selector: '#fish', key: 'fish' },
            { selector: '#herptiles', key: 'herptiles'},
            { selector: '#coremaopt', key: 'coremaopt' },
            { selector: '#birds', key: 'fugler' },
            { selector: '#mammals', key: 'pattedyr' },
            { selector: '#dna_vascular', key: 'dna_vascular' },
            { selector: '#dna_entomology', key: 'dna_insekter' },
            // { selector: '#dna_fish_herptiles', key: 'fishHerpDNA' },
            // { selector: '#fish_herptiles', key: 'fishHerp' },
            { selector: '#dna_fungi_lichens', key: 'fungiLichens' },
            { selector: '#dna_other', key: 'other' },
            { selector: '#malmer', key: 'malmer' },
            { selector: '#oslofeltet', key: 'oslofeltet' },
            { selector: '#utenlandskeBergarter', key: 'utenlandskeBA' },
            { selector: '#GeoPalOpt', key: 'GeoPal' },
            { selector: '#otherOpt', key: 'otherOpt' },
            { selector: '#utad', key: 'utad' },
            { selector: '#eco_bot', key: 'eco_bot' },
            { selector: '#bulk', key: 'bulk' },
            { selector: '#bulkProjectHeader', key: 'bulkSelectHeader' },
            { selector: '#vennligstBulk', key: 'searchProject' },
        ];

        indexElementsToUpdate.forEach(element => {
            const { selector, key } = element;
            const elementToUpdate = document.querySelector(selector);
            if (elementToUpdate) {
                elementToUpdate.innerHTML = textItems[key][index];
            }
        });
    }


  // index page
    const excludedKeywordsIndex = ['about', 'archive', 'artsObs', 'barcod', 'checkCoord', 'corema', 'dataError', 'getDOI', 'help', 'journaler', 'labels', 'loanInfo', 'map', 'object', 'showStat', 'tools'];
    if (!excludedKeywordsIndex.some(keyword => location.href.includes(keyword))) {

        const elementsToUpdate = [
            { selector: '#simple-title', key: 'simpleSearch' },
            { selector: '#header-advSearch-page', key: 'headerAdvSearchPage' },
            { selector: '#adv-search-button', key: 'searchButton' },
            { selector: '#list-objects-button', key: 'listObjects' },
            { selector: '#search-obj-list-button', key: 'searchButton' },
            { selector: '#search-button', key: 'searchButton' },
            { selector: '#header-search-page', key: 'headerSearchPage' },
            { selector: '#search-text', key: 'placeholder' },
            { selector: '#advanced-title', key: 'headerAdvSearchPage' },
            { selector: '#objectlist-title', key: 'listObjects' },
            { selector: '#obj-list-input', key: 'placeholderList' },
            { selector: '#botanikk', key: 'botanikk' },
            { selector: '#mykologi', key: 'mykologi' },
            { selector: '#zoologi', key: 'zoologi' },
            { selector: '#geologi', key: 'geologi' },
            { selector: '#paleontologi', key: 'paleontologi' },
            { selector: '#other', key: 'otherCollections' },
            { selector: '#empty-search-button', key: 'emptySearch' },
            { selector: '#hits-per-page', key: 'hitsPerPage' },
            { selector: '#head-nb-hits', key: 'nbHitsText' },
            { selector: '#nb-hits', key: 'tooManyHits' },
            { selector: '#action-option', key: 'actionRecords' },
            { selector: '#download-records', key: 'downloadLink' },
            { selector: '#download-photos', key: 'downloadPhoto' },
            { selector: '#loan-records', key: 'createLoan' },
            { selector: '#check-coordinates', key: 'checkCoordAll' },
            { selector: '#zoom-expl-popup', key: 'mapHelpContent' },
            { selector: '#zoom-button', key: 'zoomButton' },
            { selector: '#large-map-button', key: 'largeMapButton' },
            { selector: '#export-png', key: 'downloadMapButton' },
            { selector: '#checkedInMap', key: 'checkedInMap' },
            { selector: '#first', valueAttr: 'value', key: 'firstButton' },
            { selector: '#previous', valueAttr: 'value', key: 'previousButton' },
            { selector: '#next', valueAttr: 'value', key: 'nextButton' },
            { selector: '#last', valueAttr: 'value', key: 'lastButton' },
            { selector: '#first1', valueAttr: 'value', key: 'firstButton' },
            { selector: '#previous1', valueAttr: 'value', key: 'previousButton' },
            { selector: '#next1', valueAttr: 'value', key: 'nextButton' },
            { selector: '#last1', valueAttr: 'value', key: 'lastButton' },
            { selector: '#resultPageText', innerHtml: true, key: 'page' },
            { selector: '#resultPageAlert', innerHtml: true, key: 'lastPageAlert' },
            { selector: '#resultPageText1', innerHtml: true, key: 'page' },
            { selector: '#resultPageAlert1', innerHtml: true, key: 'lastPageAlert' },
        ];
        
        try {
            for (const element of elementsToUpdate) {
                const { selector, valueAttr, innerHtml, key } = element;
                const elementToUpdate = document.querySelector(selector);
                if (elementToUpdate) {
                    if (innerHtml) {
                        elementToUpdate.innerHTML = textItems[key][index];
                    } else if (valueAttr) {
                        elementToUpdate[valueAttr] = textItems[key][index];
                    } else {
                        elementToUpdate.innerHTML = textItems[key][index];
                    }
                }
            }
        } catch (error) {
            console.log(`RenderLang error: ${error}`);
        }
    }




    // tools page
    if (location.href.includes('tools')) {
        const toolsElementsToUpdate = [
            { selector: '#showToolsHeader', key: 'showToolsHeader' },
            { selector: '#showToolsText', key: 'showToolsText' },
            { selector: '#statistikk-link', key: 'statistikkLink' },
            { selector: '#statistics-text', key: 'statistikkTekst' },
            { selector: '#DOI-link', key: 'DOILink' },
            { selector: '#DOI-text', key: 'DOIText' },
            { selector: '#data-error-link', key: 'dataErrorLink' },
            { selector: '#data-error-text', key: 'dataErrorText' },
            { selector: '#arts-obs-link', key: 'artsObsLink' },
            { selector: '#arts-obs-text', key: 'artsObsText' },
            { selector: '#bc-header', key: 'bcText' },
            { selector: '#bc-fungi-link', key: 'sopp' },
            { selector: '#bc-lichen-link', key: 'lav' },
            { selector: '#bc-mammals-link', key: 'bcPattedyr' },
            { selector: '#bc-lep-link', key: 'bcLep' },
            { selector: '#bc-herptiles-link', key: 'bcHerptiles' },
            { selector: '#bc-birds-link', key: 'bcFugler' },
            { selector: '#loan-info-link', key: 'loanInfoLink' },
            { selector: '#loan-info-text', key: 'loanInfoText' },
            { selector: '#make-label-link', key: 'makeLabelLink' },
            { selector: '#make-label-text', key: 'makeLabeltext' },
        ];
    
        toolsElementsToUpdate.forEach(element => {
            const { selector, key } = element;
            const elementToUpdate = document.querySelector(selector);
            if (elementToUpdate) {
                elementToUpdate.innerHTML = textItems[key][index];
            }
        });
    
        if (window.location.href.includes('/tmu') || window.location.href.includes('/nbh') || window.location.href.includes('/um')) {
            const toolsElementsToHide = [
                '#bc-fungi-link',
                '#bc-mammals-link',
                '#bc-lep-link',
                '#bc-herptiles-link',
                '#bc-lichen-link',
                '#bc-header',
                '#bc-birds-link',
                '#loan-info-link',
                '#loan-info-text',
            ];
    
            toolsElementsToHide.forEach(selector => {
                const elementToHide = document.querySelector(selector);
                if (elementToHide) {
                    elementToHide.style.display = "none";
                }
            });
        }
    }

    // Stat page
    if (location.href.includes('showStat')) {
        document.querySelector('#showStatHeader').innerHTML = textItems.showStatHeader[index]
        document.querySelector('#showStatText').innerHTML = textItems.showStatText[index]
        document.querySelector('#total').innerHTML = textItems.total[index] // ekstra valg på drop down
        document.querySelector('#Collection_header').innerHTML = textItems.collectionHeader[index]
        document.querySelector('#NbObj_header').innerHTML = textItems.nbObjHeader[index]
        document.querySelector('#NbPhoto_header').innerHTML = textItems.nbPhotoHeader[index]
        document.querySelector('#NbCoord_header').innerHTML = textItems.nbCoordHeader[index]
        document.querySelector('#graph_header').innerHTML = textItems.graphHeader[index]
    }

    // about page
    if (location.href.includes('about')) {
        document.querySelector('#aboutHeader').innerHTML = textItems.aboutHeader[index]
        document.querySelector('#aboutText').innerHTML = textItems.aboutText[index]
    }

    // help page
    if (location.href.includes('help')) {
        if (window.location.href.includes('/tmu') || window.location.href.includes('/nbh') || window.location.href.includes('/um')) {
            document.querySelector('#citeHeader').style.display = "none"
            document.querySelector('#citeText').style.display = "none"
        }
        document.querySelector('#helpHeader').innerHTML = textItems.helpHeader[index]
        document.querySelector('#helpText').innerHTML = textItems.helpText[index]
        document.querySelector('#citeHeader').innerHTML = textItems.citeHeader[index]
        document.querySelector('#citeText').innerHTML = textItems.citeText[index]
        document.querySelector('#contact').innerHTML = textItems.contact[index]
        
    }

    // journals page
    if (location.href.includes('journaler')) {
        document.querySelector('#header-journal-page').innerHTML = textItems.journalHeader[index]
        document.querySelector('#text-journal-page').innerHTML = textItems.journalText[index]
        document.querySelector('#search-button').innerHTML = textItems.searchButton[index]
        document.getElementById("head-nb-hits").innerHTML = textItems.nbHitsText[index]
    }
    // archive page
    if (location.href.includes('archive')) {
        const elementsToUpdate = [
            { selector: '#search-button', key: 'searchButton' },
            { selector: '#search-text', key: 'placeholder' },
            { selector: '#hits-per-page', key: 'hitsPerPage' },
            { selector: '#head-nb-hits', key: 'nbHitsText' },
            { selector: '#first', valueAttr: 'value', key: 'firstButton' },
            { selector: '#previous', valueAttr: 'value', key: 'previousButton' },
            { selector: '#next', valueAttr: 'value', key: 'nextButton' },
            { selector: '#last', valueAttr: 'value', key: 'lastButton' },
            { selector: '#first1', valueAttr: 'value', key: 'firstButton' },
            { selector: '#previous1', valueAttr: 'value', key: 'previousButton' },
            { selector: '#next1', valueAttr: 'value', key: 'nextButton' },
            { selector: '#last1', valueAttr: 'value', key: 'lastButton' },
            { selector: '#resultPageText', innerHtml: true, key: 'page' },
            { selector: '#resultPageAlert', innerHtml: true, key: 'lastPageAlert' },
            { selector: '#resultPageText1', innerHtml: true, key: 'page' },
            { selector: '#resultPageAlert1', innerHtml: true, key: 'lastPageAlert' },
            { selector: '#last-updated', innerHtml: true, key: 'lastUpdated' }
            
        ];
        
        try {
            for (const element of elementsToUpdate) {
                const { selector, valueAttr, innerHtml, key } = element;
                const elementToUpdate = document.querySelector(selector);
                if (elementToUpdate) {
                    if (innerHtml) {
                        elementToUpdate.innerHTML = textItems[key][index];
                    } else if (valueAttr) {
                        elementToUpdate[valueAttr] = textItems[key][index];
                    } else {
                        elementToUpdate.innerHTML = textItems[key][index];
                    }
                }
            }
        } catch (error) {
            console.log(`RenderLang error: ${error}`);
        }
        
    }
    // getDOI page
    if (location.href.includes('getDOI')) {
        document.querySelector('#getDOIHeader').innerHTML = textItems.getDOIHeader[index]
        document.querySelector('#selectMuseum').innerHTML = textItems.selectMuseum[index] 
        document.querySelector('#selectCollection').innerHTML = textItems.selectCollection[index] 
        document.querySelector('#onloggingData').innerHTML = textItems.onloggingData[index]
        document.querySelector('#emailRequest').innerHTML = textItems.emailRequest[index]
        document.querySelector('#usernameRequest').innerHTML = textItems.usernameRequest[index]
        document.querySelector('#passwordRequest').innerHTML = textItems.passwordRequest[index]
        document.querySelector('#pasteRequest').innerHTML = textItems.pasteRequest[index]
        document.querySelector('#resetButton').innerHTML = textItems.resetButton[index]
        document.querySelector('#results').innerHTML = textItems.results[index]
        document.querySelector('#DOIText1').innerHTML = textItems.DOIText[index]
        document.querySelector('#DOIText2').innerHTML = textItems.DOIText2[index]
        
    }

    // labels page
    if (location.href.includes('labels')) {
        document.querySelector('#selectMuseum').innerHTML = textItems.selectMuseum[index] 
        document.querySelector('#selectCollection').innerHTML = textItems.selectCollection[index] 
    }

    if (location.href.includes('checkCoord')) {
        document.querySelector('#checkCoordHeader').innerHTML = textItems.checkCoordHeader[index]
    }

    // dataErros page
    if (location.href.includes('dataErrors')) {
        document.querySelector('#dataErrorHeader').innerHTML = textItems.dataErrorHeader[index]
        document.querySelector('#select-collection-label').innerHTML = textItems.selectCollectionError[index] 
        document.querySelector('#GBIF-header').innerHTML = textItems.GBIFHeader[index]
        document.querySelector('#binomia-header').innerHTML = textItems.binomiaHeader[index]
        document.querySelector('#GBIF-text').innerHTML = textItems.GBIFText[index]
        document.querySelector('#binomia-text').innerHTML = textItems.binomiaText[index]
    }
    // loanInfo page
    if (location.href.includes('loanInfo')) {
        document.querySelector('#header-loan-info-page').innerHTML = textItems.loanInfoHeader[index]
        document.querySelector('#text-loan-info-page').innerHTML = textItems.loanExplanation[index] 
        document.querySelector('#search-button').innerHTML = textItems.searchButton[index]

    }
}

let language
if (sessionStorage.language) {
    language = sessionStorage.getItem('language')
} else if (document.querySelector('#language').value) {
    language = document.querySelector('#language').value
    sessionStorage.setItem('language',language)
} else {
    document.querySelector('#language').value = "Norwegian"
    language = "Norwegian"
    sessionStorage.setItem('language',language)
}
if (language === "Norwegian") {
    document.querySelector('#language').innerHTML = "English website"
} else if (language === "English") {
    document.querySelector('#language').innerHTML = "Norwegian website"
}

renderText(language)


document.querySelector('#language').addEventListener('click', (e) => {
    if (language === "Norwegian") {
        language = "English"
        document.querySelector('#language').innerHTML = "Norwegian website"
    } else if (language === "English") {
        language = "Norwegian"
        document.querySelector('#language').innerHTML = "English website"
    }
    renderText(language)
    sessionStorage.setItem('language', language)
   
    const excludedUrls = ['about', 'archive' , 'checkCoord', 'corema', 'dataError', 'getDOI', 'help', 'journaler', 'map', 'object', 'showStat', 'tools'];
    if (!excludedUrls.some(url => location.href.includes(url))) {
        if (document.querySelector("#head-nb-hits").innerHTML) {

            if (language === "Norwegian") {
                index = 0
            } else if (language === "English") {
                index = 1
            }

            // tror det blir feil her, når tabellen er smalere, og celler skal hoppes over
            const headerRow = document.querySelector("#myTable").rows[0]
            const headerCell = Array.from(headerRow.cells);
 
            stringData = sessionStorage.getItem('string')
            musitData = JSON.parse(stringData)      
            const coll = sessionStorage.getItem('chosenCollection')
            if (coll === 'utad') { 
                fillResultHeadersUTAD(headerCell,musitData)
            } else if (coll === 'bulk') {
                fillResultHeadersBulk(headerCell,musitData)
            } else if (coll === 'eco_bot'){
                fillResultHeadersEco_bot(headerCell,musitData)
            } else {
                let org
                if (sessionStorage.getItem('organismGroup').includes('geologi')) {
                    org = 'geologi'
                } else { org = 'other'}

                fillResultHeaders(org,headerCell,musitData)
            }
        
            
            const select = document.getElementById('checkboxSelect')
            pageList = JSON.parse(sessionStorage.getItem('pageList'))
            if(select) {
                select.onchange =() => {
                    checkSeveralBoxes(pageList)
                }
            }
        }
    }
})


