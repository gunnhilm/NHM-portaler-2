const urlPath = '/nhm'

const textItems = {
    // header
    aboutButton: ["Om sidene", "About"],
    searchPageLink: ["Søkeside", "Search"],
    helpButton: ["Hjelp", "Help"],
    statistikkButton: ["Statistikk", "Statistics"],
    journalLink: ["Journalsøk", "Journal search"],
    logo: [urlPath + "/images/uio_nhm_a_cmyk.png", urlPath + "/images/uio_nhm_a_eng_cmyk.png"],
    
    // index page
    emptySearch: ["Tøm søk", "Empty search"],
    headerSearchPage: ["Søk i samlingene", "Search the collections"],
    velg_samling: ["", "" ], //["Velg en samling", "Choose a collection" ],
    vennligst: ["--Velg en samling--", "--Choose a collection--"],
    searchButton: ["Søk", "Search"],
    //----Specimens
    total: ["Alle samlingene","All collections"],
    karplanter: ["Karplanter", "Vascular plants"],
    sopp: ["Sopp", "Fungi"],
    moser: ["Moser", "Mosses"],
    lav: ["Lav", "Lichens"],
    alger: ["Alger", "Algae"],
    insekter: ["Insekter", "Insects"],
    fugler: ["Fugler", "Birds"],
    pattedyr: ["Pattedyr", "Mammals"],
    // ---------DNA
    dna_karplanter: ["Karplanter (DNA)", "Vascular plants (DNA)"],
    dna_insekter: ["Insekter (DNA)", "Insects (DNA)"],
    dna_fish_herptiles: ["Fisk & Herptiler (DNA)", "Fish & Herptiles (DNA)"],
    dna_fungi_lichens: ["Sopp & Lav (DNA)", "Fungi & Lichens (DNA)"],
    dna_other: ["Andre grupper (DNA)", "Other groups (DNA)"],
    // --------------specimens and DNA
    fungi_specimens_dna: ["Sopp - specimens og DNA", "Fungi - specimens and DNA"],   //DNAlink

    hitsPerPage: ["Treff per side", "Hits per page"],
    downloadLink: ["Last ned resultat", "Download results"],
    nbHitsText: ["Antall treff: ", "Number of hits: "],
    headerCatNb: ["Katalognr.", "Catalog nb."],
    headerTaxon: ["Takson", "Taxon"],
    headerCollector: ["Innsamler", "Collector"],
    headerDate: ["Dato", "Date"],
    headerCountry: ["Land", "Country"],
    headerMunicipality: ["Kommune", "Municipality"],
    headerLocality: ["Sted", "Locality"],
    headerSampleTypes: ["Objekttyper", "Sample types"],
    headerSequence: ["Sekvens ID", "Sequence ID"],
    mustChoose: ["Du må velge en samling", "You must choose a collection"],
    placeholder: ["Søk etter latinsk artsnavn, katalognummer, person, sted... Flere søkeord i ett søk er mulig.", "Search for latin species name, catalognumber, person, place... Several terms possible."],
    serverError: ["Serverfeil, prøv nytt søk", "Server error, try new search"],
    noHits: ["Ingen treff, prøv nytt søk", "No hits, try new search"],
    errorRenderResult: ["Noe gikk feil, søk igjen, begrens ev. søket med f.eks. flere søkeord", "Something went wrong, try a new search, possibly limit the seach by e.g. more search terms"],
    errorFileNotExisting: ["Beklager, noe er feil med valgte samling. Velg en annen samling, kom tilbake senere, eller kontakt oss (se hjelpesiden)",
     "Sorry, something is wrong with the chosen collection. Choose another collection, come back later, or contact us (see help page)"],
    mapError: ["Noe er feil i kartmodul", "Something is wrong in map module"],
    zoomButton: ["Informasjon om kart", "Information on map"],
    mapHelpContent: ["Bruk mushjul, eller dobbelklikk for å zoome inn, Shift + dobbelklikk  for å zoome ut. Klikk og dra for å flytte kartutsnitt. <br><br> Bare treff som er listet på sida vises i kartet. For å se alle resultater i kart, velg 'All' i Treff per side.",
    "Use mouse-wheel, or double click to zoom in, Shift + double click to zoom out. Click and drag to move map. <br><br> Only results listed on page are shown in map. To see all hits in map, choose 'All' in Hits per page."],
    mapHelpContentObjPage: ["Bruk mushjul, eller dobbelklikk for å zoome inn, Shift + dobbelklikk  for å zoome ut. Klikk og dra for å flytte kartutsnitt.", "Use mouse-wheel, or double click to zoom in, Shift + double click to zoom out. Click and drag to move map."],
    zoomToClickText: ["Zoom in og klikk igjen", "Zoom in and click again"],
    largeMapButton: ["Større kart", "Larger map"],
    mapSearchAlt: ["Kart ikke tilgjengelig: Ingen av objektene på siden har koordinater knyttet til seg, eller de har feil format.", "Map not available: None of the objects on the page have coordinates registered, or they have the wrong format."],
    firstButton: ["Første", "First"],
    previousButton: ["Forrige", "Previous"],
    nextButton: ["Neste", "Next"], 
    lastButton: ["Siste", "Last"],
    page: ["Side ", "Page "],
    lastPageAlert: [" (Siste side)", " (Last page)"],
    
    // object page
    searchButtonHeader: ["Tilbake til søkeresultat", "Back to search result"],
    objectPageHeader: ['Objektvisning', 'Object view'],
    headSpeciesName: ['Vitenskapelig navn: ', 'Scientific name: '],
    headDet: ['Bestemt av: ', 'Determined by: '],
    headDetDate: ['Dato for bestemming: ', 'Date of determination: '],
    headCollDate: ['Innsamlingsdato: ', 'Collection date: '],
    headColl: ['Innsamler: ', 'Collector: '],
    headLocality: ['Lokalitet: ', 'Locality: '],
    headCoordinates: ['Koordinater: ', 'Coordinates: '],
    headArtsobs: ['Artsobservasjon ID: ', 'Species Observation ID: '],
    photoAlt: ['Bilde ikke tilgjengelig', 'Photo not available'],
    nextPhoto: ['Neste bilde', 'Next photo'],
    mapAlt: ['Kart ikke tilgjengelig', 'Map not available'],
    itemsHeader: ['Objekter:','Objects:'],
    samplingDate: ['Dato for prøvetaking:','Date of sampling:'],
    extractionDate: ['Ekstraksjonsdato:', 'Date of extraction:'],
    itemNumber: ['Prøvenummer:','Item number:'],
    preservation: ['Konservering:','Preservation:'],
    method: ['Ekstraksjonsmetode:','Method of extraction:'],
    concentration: ['DNA konsentrasjon:','DNA concentration'],
    coordPlaceholder: ['&lt;Ingen koordinater&gt;', '&lt;No coordinates&gt;'],


    // corema data page
    //coremaHeader: ["DNA-bank data", "DNA-bank data"],
    //coremaDummyText: ["her kommer corema tekst", "here comes corema text"],
    
    //ShowStat page
    showStatHeader: ["Statistikk over samlingene", "Statistics from the collections"],
    showStatText: ["Disse tallene reflekterer hva som er registrert i museets databaser. Da kun et fåtall av samlingene har alle objektene registrert i databasene, reflekterer ikke disse tallene nødvendigvis samlingenes totale bredde.",
        "These numbers reflect what is recorded in our databases, not necessarily the true number of items in the collections."],
    
    // about page
    // aboutHeader: ["Om NHMs samlingsportal", "About NHM's collection portal"],
    // aboutText: ["Kontaktinformasjon: \<br><br> eirik.rindal@nhm.uio.no \<br> gunnhilm@nhm.uio.no \<br><br>", "Contact information: <br><br> eirik.rindal@nhm.uio.no <br> gunnhilm@nhm.uio.no <br><br>"],

    // help page
    helpHeader: ["Hvordan søke", "How to search the collections"],
    helpText: [`Velg samling først, og skriv ett eller flere søkeord i søkefeltet. 
    Du kan søke på latinsk artsnavn, lokalitet, katalognummer (f.eks. musit-nummer), geografi osv. Det skilles ikke på store og små bokstaver. Land må skrives på engelsk, andre felt kan inneholde engelsk eller norsk.<br><br><br>
    <span class="bold" style="font-size: 16pt">Kontaktinformasjon:</span> <br><br> nhm-samlingsportaler@nhm.uio.no`, 
    `Choose collection first, and enter one or more search terms in the search field. 
    You can search for latin species name, locality, catalog number (e.g. musit-number), geography etc. The search is case insensitive. Country is written in english, other fields can be either norwegian or english. <br><br><br>
    <span class="bold" style="font-size: 16pt">Contact information:</span> <br><br> nhm-samlingsportaler@nhm.uio.no`],

    // journals page
    journalHeader: ['Søk i journaler', 'Search journals']

}


const renderText = function(lang) {
    // if (lang === "Norwegian") {
    //     index = 0
    // } else 
    if (lang === "English") {
        index = 1
    } else {
        index = 0
    }
    
    //header
    //document.querySelector('#about-button').innerHTML = textItems.aboutButton[index]
    document.querySelector('#help-link').innerHTML = textItems.helpButton[index]
    document.querySelector('#statistikk-link').innerHTML = textItems.statistikkButton[index]
    document.querySelector('#search-page-link').innerHTML = textItems.searchPageLink[index]
    document.querySelector('#journal-link').innerHTML = textItems.journalLink[index]

    let logo = document.querySelector('#logo')
    logo.src = textItems.logo[index]
    if (language === "Norwegian") {
        logo.setAttribute("style", "height:15px")
    } else if (language === "English") {
        logo.setAttribute("style", "height:30px")
    }
    

    //Doppdown med valg av samlinger, index page og stat page
    if (!location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help') & !location.href.includes('corema') & !location.href.includes('map') & !location.href.includes('journaler')) {
        
       
        
        document.querySelector('#karplanter').innerHTML = textItems.karplanter[index]
        document.querySelector('#sopp').innerHTML = textItems.sopp[index]
        document.querySelector('#moser').innerHTML = textItems.moser[index]
        document.querySelector('#lav').innerHTML = textItems.lav[index]
        document.querySelector('#alger').innerHTML = textItems.alger[index]
        document.querySelector('#insekter').innerHTML = textItems.insekter[index]
        document.querySelector('#fugler').innerHTML = textItems.fugler[index]
        document.querySelector('#pattedyr').innerHTML = textItems.pattedyr[index]
        //-------------------------- DNA
        document.querySelector('#dna_karplanter').innerHTML = textItems.dna_karplanter[index]
        document.querySelector('#dna_insekter').innerHTML = textItems.dna_insekter[index]
        document.querySelector('#dna_fish_herptiles').innerHTML = textItems.dna_fish_herptiles[index]
        document.querySelector('#dna_fungi_lichens').innerHTML = textItems.dna_fungi_lichens[index]
        document.querySelector('#dna_other').innerHTML = textItems.dna_other[index]
        //------------------------- Specimens and DNA
        document.querySelector("#fungi_specimens_dna").innerHTML = textItems.fungi_specimens_dna[index] //DNAlink
    }
    // index page
    if (!location.href.includes('showStat') & !location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help') & !location.href.includes('corema') & !location.href.includes('map') & !location.href.includes('journaler')) {
        document.querySelector('#vennligst').innerHTML = textItems.vennligst[index] 
        
        document.querySelector('#search-button').innerHTML = textItems.searchButton[index]
        document.querySelector('#empty-search-button').innerHTML = textItems.emptySearch[index]
        document.querySelector('#header-search-page').innerHTML = textItems.headerSearchPage[index]
        document.querySelector('#select-collection-label').innerHTML = textItems.velg_samling[index]
        document.querySelector('#hits-per-page').innerHTML = textItems.hitsPerPage[index]
        if (sessionStorage.getItem('string')) {
            document.getElementById("head-nb-hits").innerHTML = textItems.nbHitsText[index]
        }
        document.querySelector('#download-button').innerHTML = textItems.downloadLink[index]
        document.querySelector('#search-text').placeholder = textItems.placeholder[index]
        //document.getElementById('zoom-expl-popup').innerHTML = textItems.mapHelpContent[index]
        document.querySelector('#zoom-button').innerHTML = textItems.zoomButton[index]
        document.querySelector('#large-map-button').innerHTML = textItems.largeMapButton[index]
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
        // if(document.querySelector("#map-search").innerHTML) {
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
        
        if(!object.decimalLatitude | !object.decimalLongitude) {
            document.querySelector("#map-object").innerHTML = textItems.mapAlt[index]
        }

        if (object.ArtObsID) {
            document.querySelector("#head-artsobs").innerHTML = textItems.headArtsobs[index]
        }
        if (object.habitat ) {
            document.querySelector("#head-habitat").innerHTML = "Habitat: "
        }

        document.querySelector("#itemsHeader").innerHTML = textItems.itemsHeader[index]


        document.getElementById('zoom-expl-popup').innerHTML = textItems.mapHelpContent[index]
        document.getElementById('large-map-object-button').innerHTML = textItems.largeMapButton[index]
    }
    
    // // corema page
    // if (location.href.includes('corema')) {
    //     document.querySelector('#coremaHeader').innerHTML = textItems.coremaHeader[index]
    //     document.querySelector('#coremaDummyText').innerHTML = textItems.coremaDummyText[index]
    // }
    // Stat page
    if (location.href.includes('showStat')) {
        document.querySelector('#showStatHeader').innerHTML = textItems.showStatHeader[index]
        document.querySelector('#showStatText').innerHTML = textItems.showStatText[index]
        document.querySelector('#total').innerHTML = textItems.total[index] // ekstra valg på dropp dawn
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
   
    if (!location.href.includes('showStat') & !location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help') & !location.href.includes('corema') & !location.href.includes('map') & !location.href.includes('journaler')) {
        if (document.querySelector("#head-nb-hits").innerHTML) {

            if (language === "Norwegian") {
                index = 0
            } else if (language === "English") {
                index = 1
            }

            //document.querySelector("#result-header").innerHTML = textItems.searchResultHeadline[index]
            document.querySelector('#head-nb-hits').innerHTML = textItems.nbHitsText[index]
            document.querySelector('#download-button').innerHTML = textItems.downloadLink[index]
            document.querySelector('#large-map-button').innerHTML = textItems.largeMapButton[index]
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

            // headerRow.cells[1].innerHTML = `<button id='scientificNameButton' class='sort'>${textItems.headerTaxon[index].bold()} ${getArrowDown(1)} ${getArrowUp(1)}</button>`
            // headerRow.cells[2].innerHTML = `<button id='collectorButton' class='sort'>${textItems.headerCollector[index].bold()} ${getArrowDown(2)} ${getArrowUp(2)}</button>`
            // headerRow.cells[3].innerHTML = `<button id='dateButton' class='sort'>${textItems.headerDate[index].bold()} ${getArrowDown(3)} ${getArrowUp(3)}</button>`
            // headerRow.cells[4].innerHTML = `<button id='countryButton' class='sort'>${textItems.headerCountry[index].bold()} ${getArrowDown(4)} ${getArrowUp(4)}</button>`
            // headerRow.cells[5].innerHTML = `<button id='municipalityButton' class='sort'>${textItems.headerMunicipality[index].bold()} ${getArrowDown(5)} ${getArrowUp(5)}</button>`
            // headerRow.cells[6].innerHTML = `<button id='localityButton' class='sort'>${textItems.headerLocality[index].bold()} ${getArrowDown(6)} ${getArrowUp(6)}</button>`
            
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
            cell10.innerHTML = `<button id='sampleTypeButton' class='sort'>${textItems.headerSampleTypes[index].bold()} ${getArrows('sampleType')}</button>`
            cell11.innerHTML = `<button id='processIDButton' class='sort'>${textItems.headerSequence[index].bold()} ${getArrows('processID')}</button>`

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


