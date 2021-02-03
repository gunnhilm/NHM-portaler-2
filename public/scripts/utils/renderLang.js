const urlPath = '/nhm'

const textItems = {
    // header
    aboutButton: ["Om sidene", "About"],
    searchPageLink: ["Søkeside", "Search"],
    helpButton: ["Hjelp", "Help"],
    statistikkButton: ["Statistikk", "Statistics"],
    journalLink: ["Journalsøk", "Journal search"],
    mobileMenuBtn: ["Meny", "Menu"],
    logo: [urlPath + "/images/UiO NHM SH V2 RGB.png", urlPath + "/images/uio_nhm_a_eng_cmyk_2.png"],
    // logo: [urlPath + "/images/Tromsø_museum_Logo_Bokmal_2l_Bla.png", urlPath + "/images/Tromsø_museum_Logo_Bokmal_2l_Bla.png"],
//    logo: [urlPath + "/images/UiBlogoUM_white_v.png", urlPath + "/images/UiBlogoUM_white_v.png"],
    
    
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
    
    fishHerp: ["Fisk og herptiler", "Fish and herptiles"],
    fungiLichens: ["Sopp og lav", "Fungi and lichens"],
    other: ["Andre grupper", "Other groups"],
    hitsPerPage: ["Treff per side", "Hits per page"],
    downloadLink: ["Last ned resultat", "Download results"],
    downloadPhoto: ["Last ned bilder", "Download photos"],
    nbHitsText: ["Antall treff: ", "Number of hits: "],
    headerCatNb: ["Katalognr.", "Catalog nb."],
    headerTaxon: ["Takson", "Taxon"],
    headerCollector: ["Innsamler", "Collector"],
    headerDate: ["Dato", "Date"],
    headerCountry: ["Land", "Country"],
    headerMunicipality: ["Kommune", "Municipality"],
    headerLocality: ["Sted", "Locality"],
    headerCoremaNo: ["Corema no", "Corema no"],

    headerSampleTypes: ["Objekttype", "Sample type"],
    select: ["Velg", "Select"],
    selectAll: ["Alle", "All"],
    selectAllOnPage: ["Alle på siden", "All on page"],
    selectNone: ["Ingen", "None"],
    //headerSequence: ["Sekvens ID", "Sequence ID"],
    mustChoose: ["Du må velge en samling", "You must choose a collection"],
    placeholder: [" Søk etter latinsk artsnavn, katalognummer, person, sted... ", " Search for latin species name, catalognumber, person, place... "],
    serverError: ["Serverfeil, prøv nytt søk", "Server error, try new search"],
    noHits: ["Ingen treff, prøv nytt søk", "No hits, try new search"],
    errorRenderResult: ["Noe gikk feil, søk igjen, begrens ev. søket med f.eks. flere søkeord", "Something went wrong, try a new search, possibly limit the seach by e.g. more search terms"],
    errorFileNotExisting: ["Beklager, noe er feil med valgte samling. Velg en annen samling, kom tilbake senere, eller kontakt oss (se hjelpesiden)",
     "Sorry, something is wrong with the chosen collection. Choose another collection, come back later, or contact us (see help page)"],
    mapError: ["Noe er feil i kartmodul", "Something is wrong in map module"],
    zoomButton: ["Informasjon om kart", "Information on map"],
    mapHelpContent: ["Bruk mushjul, eller dobbelklikk for å zoome inn, Shift + dobbelklikk  for å zoome ut. Klikk og dra for å flytte kartutsnitt. <br><br> Bare treff som er listet på sida vises i kartet. For å se alle resultater i kart, velg 'All' i Treff per side.",
    "Use mouse-wheel, or double click to zoom in, Shift + double click to zoom out. Click and drag to move map. <br><br> Only results listed on page are shown in map. To see all hits in map, choose 'All' in Hits per page."],
    mapCheckedMessage: ["Velg post(er) fra listen", "Select record(s) from list"],
    mapHelpContentObjPage: ["Bruk mushjul, eller dobbelklikk for å zoome inn, Shift + dobbelklikk  for å zoome ut. Klikk og dra for å flytte kartutsnitt.", "Use mouse-wheel, or double click to zoom in, Shift + double click to zoom out. Click and drag to move map."],
    zoomToClickText: ["Zoom in og klikk igjen", "Zoom in and click again"],
    largeMapButton: ["Større kart", "Larger map"],
    downloadMapButton: ["Last ned kart", "Download map"],
    checkedInMap: ["Vis valgte poster i kart", "Show selected records in map"],
    mapSearchAlt: ["Kart ikke tilgjengelig: Ingen av objektene på siden har koordinater knyttet til seg, eller de har feil format.", "Map not available: None of the objects on the page have coordinates registered, or they have the wrong format."],
    firstButton: ["Første", "First"],
    previousButton: ["Forrige", "Previous"],
    nextButton: ["Neste", "Next"], 
    lastButton: ["Siste", "Last"],
    page: ["Side ", "Page "],
    lastPageAlert: [" (Siste side)", " (Last page)"],
    b: ["Blod", "Blood"],
    p: ["Konservert objekt", "Preserved specimen"],
    o: ["Osteologisk objekt", "Osteological specimen"],
    ob: ["Observasjon", "Observation"],
    f: ["Fjær", "Feather"],
    n: ["Reir", "Nest"],
    ot: ["Uspesifisert", "Unspecified"],
    sr: ["Spermopptak", "Sperm recording"],
    si: ["Spermbilde", "Sperm image"],
    t: ["Vev", "Tissue"],
    ts: ["Testikler", "Testes"],
    ep: ["Ektoparasitt", "Ectoparasite"],
    bs: ["Blodstryk",  "Blood smear"],
    u: ["Ukjent", "Unknown"],
    cf: ["Kloakkvæske", "Cloacal fluids"],

    
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
    headSex: ['Kjønn:', 'Sex:'],
    headLifeStage: ['Livsstadium:', 'Life stage:'],
    headSamplingProtocol: ['Innsamlingsmetode:', 'Sampling protocol:'],
    headTaxonomy: ['Taksonomi:', 'Taxonomy:'],
    headTypeStatus: ['Typestatus:', 'Type status:'],
    photoAlt: ['Bilde ikke tilgjengelig', 'Photo not available'],
    nextPhoto: ['Neste bilde', 'Next photo'],
    previousPhoto: ['Forrige bilde', 'Previous photo'] ,
    mapAlt: ['Kart ikke tilgjengelig', 'Map not available'],
    itemsHeader: ['Objekttyper:','Specimen types:'],
    preservedSp: ['Har prøve(r) i DNA-banken:', 'Has item(s) in the DNA-bank:'],
    
    samplingDate: ['Dato for prøvetaking:','Date of sampling:'],
    extractionDate: ['Ekstraksjonsdato:', 'Date of extraction:'],
    itemNumber: ['Prøvenummer:','Item number:'],
    preservation: ['Konservering:','Preservation:'],
    method: ['Ekstraksjonsmetode:','Method of extraction:'],
    preparedBy: ['Ekstrahert av:','Prepared by:'],
    concentration: ['DNA konsentrasjon:','DNA concentration'],
    coordPlaceholder: ['&lt;Ingen koordinater&gt;', '&lt;No coordinates&gt;'],

    //ShowStat page
    showStatHeader: ["Statistikk over samlingene", "Statistics from the collections"],
    showStatText: ["Disse tallene reflekterer hva som er registrert i museets databaser. Da kun et fåtall av samlingene har alle objektene registrert i databasene, reflekterer ikke disse tallene nødvendigvis samlingenes totale bredde.",
        "These numbers reflect what is recorded in our databases, not necessarily the true number of items in the collections."],
    collectionHeader: ["Samling", "Collection"],
    nbObjHeader: ["Antall objekter", "Number of objects"],
    nbPhotoHeader: ["Antall med foto", "Records with photo"],
    nbCoordHeader: ["Poster med koordinater", "Records with coordinates"],
    vascularHeader: ["Karplanter", "Vascular plants"],
    mossesHeader: ["Moser", "Mosses"],

    // help page
    helpHeader: ["Hvordan søke", "How to search the collections"],
    helpText: [`Velg samling først, og skriv ett eller flere søkeord i søkefeltet. 
    Du kan søke på latinsk artsnavn, lokalitet, katalognummer (f.eks. musit-nummer), geografi osv. Det skilles ikke på store og små bokstaver. Land må skrives på engelsk, andre felt kan inneholde engelsk eller norsk.<br><br><br>
    <span class="bold" style="font-size: 16pt">Kontaktinformasjon:</span> <br><br> nhm-samlingsportaler@nhm.uio.no`, 
    `Choose collection first, and enter one or more search terms in the search field. 
    You can search for latin species name, locality, catalog number (e.g. musit-number), geography etc. The search is case insensitive. Country is written in english, other fields can be either norwegian or english. <br><br><br>
    <span class="bold" style="font-size: 16pt">Contact information:</span> <br><br> nhm-samlingsportaler@nhm.uio.no`],

    // journals page
    journalHeader: ['Søk i journaler', 'Search journals'],

    // getDOI page
    getDOIHeader: ['Få DOI fra GBIF basert på en liste med museumsnumre','Get DOI from GBIF from a list of museum numbers'],
    selectMuseum: ['--Velg museum--', '--Select museum--'],
    selectCollection: ['--Velg samling--', '--Select collection--'],
    onloggingData: ['GBIF påloggingsdata:', 'GBIF onlogging information:'],
    emailRequest: ['Din epostadresse','Enter your email address'],
    usernameRequest: ['GBIF brukernavn', 'GBIF username'],
    passwordRequest: ['GBIF passord', 'GBIF password'],
    pasteRequest: ['Lim inn museumsnumre', 'Paste museum numbers'],
    resetButton: ['Nullstill skjema', 'Reset form'],
    results: ['Resultater:', 'Results:']
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
    logo.src = textItems.logo[index]
    if (language === "Norwegian") {
        logo.setAttribute("style", "height:30px")
    } else if (language === "English") {
        logo.setAttribute("style", "height:30px")
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
        
        document.querySelector('#karplanter').innerHTML = textItems.karplanter[index]
        document.querySelector('#sopp').innerHTML = textItems.sopp[index]
        document.querySelector('#moser').innerHTML = textItems.moser[index]
        document.querySelector('#lav').innerHTML = textItems.lav[index]
        document.querySelector('#alger').innerHTML = textItems.alger[index]
        document.querySelector('#insekter').innerHTML = textItems.insekter[index]
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
        document.querySelector('#select-collection-label').innerHTML = textItems.velg_samling[index]
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
        document.querySelector("#preservedSp").innerHTML = textItems.preservedSp[index]


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


