const textItems = {
    // header
    aboutButton: ["Om sidene", "About"],
    helpButton: ["Hjelp", "Help"],
    logo: ["/images/uio_nhm_a_cmyk.png", "/images/uio_nhm_a_eng_cmyk.png"],
    
    // index page
    emptySearch: ["Tøm søk", "Empty search"],
    headerSearchPage: ["Søk i samlingene", "Search the collections"],
    velg_samling: ["", "" ], //["Velg en samling", "Choose a collection" ],
    vennligst: ["--Velg en samling--", "--Choose a collection--"],
    searchButton: ["Søk", "Search"],
    //----Specimens
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
    dna_fish_herptiles: ["Fisk & Herpentiler (DNA)", "Fish & Herptiles (DNA)"],
    dna_fungi_lichens: ["Sopp & Lav (DNA)", "Fungus & Lichens (DNA)"],
    dna_other: ["Andre grupper (DNA)", "Other groups (DNA)"],

    downloadLink: ["Last ned tab-separert resultatfil", "Download tab-delimited result file"],
    searchResultHeadline: ["Resultat", "Search result"],
    nbHitsText: ["Antall treff: ", "Number of hits: "],
    headerTaxon: ["Takson", "Taxon"],
    headerCollector: ["Innsamler", "Collector"],
    headerDate: ["Dato", "Date"],
    headerCountry: ["Land", "Country"],
    headerMunicipality: ["Kommune", "Municipality"],
    headerLocality: ["Sted", "Locality"],
    headerCoremaAccno: ["DNA-bank nr.", "DNA-bank nb."],
    headerSequence: ["Sekvens ID", "Sequence ID"],
    mustChoose: ["Du må velge en samling", "You must choose a collection"],
    placeholder: ["Søk etter latinsk artsnavn, musit-nr, person, sted... Flere søkeord i ett søk er mulig.", "Search for latin species name, musit-nb, person, place... Several terms possible."],
    serverError: ["Serverfeil, prøv nytt søk", "Server error, try new search"],
    noHits: ["Ingen treff, prøv nytt søk", "No hits, try new search"],
    errorRenderResult: ["Noe gikk feil, søk igjen, begrens ev. søket med f.eks. flere søkeord", "Something went wrong, try a new search, possibly limit the seach by e.g. more search terms"],
    errorFileNotExisting: ["Beklager, noe er feil med valgte samling. Velg en annen samling, kom tilbake senere, eller kontakt oss (se hjelpesiden)",
     "Sorry, something is wrong with the chosen collection. Choose another collection, come back later, or contact us (see help page)"],
    mapHelpContent: ["Bruk mushjul, eller dobbelklikk for å zoome inn, Shift + dobbelklikk  for å zoome ut. Klikk og dra for å flytte kartutsnitt", "Use mouse-wheel, or double click to zoom in, Shift + double click to zoom out. Click and drag to move map."],
    largeMapButton: ["Større kart", "Larger map"],
    
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

    // corema data page
    //coremaHeader: ["DNA-bank data", "DNA-bank data"],
    //coremaDummyText: ["her kommer corema tekst", "here comes corema text"],
    
    // about page
    // aboutHeader: ["Om NHMs samlingsportal", "About NHM's collection portal"],
    // aboutText: ["Kontaktinformasjon: \<br><br> eirik.rindal@nhm.uio.no \<br> gunnhilm@nhm.uio.no \<br><br>", "Contact information: <br><br> eirik.rindal@nhm.uio.no <br> gunnhilm@nhm.uio.no <br><br>"],

    // help page
    backToSearchFromHelp: ['Tilbake til søkeside', 'Back to search-page'],
    helpHeader: ["Hvordan søke", "How to search the collections"],
    helpText: [`Velg samling først, og skriv ett eller flere søkeord i søkefeltet. 
    Du kan søke på latinsk artsnavn, lokalitet, musit-nummer, geografi osv. Stor/liten bokstav må være rett. Land må skrives på engelsk, andre felt kan inneholde engelsk eller norsk.<br><br><br>
    <span class="bold" style="font-size: 16pt">Kontaktinformasjon:</span> <br><br> gunnhilm@nhm.uio.no <br> eirik.rindal@nhm.uio.no`, 
    `Choose collection first, and enter one or more search terms in the search field. 
    You can search for latin species name, locality, musit-number, geography etc. Big cap/small cap must be correct. Country is written in english, other fields can be either norwegian or english. <br><br><br>
    <span class="bold" style="font-size: 16pt">Contact information:</span> <br><br> gunnhilm@nhm.uio.no  <br> eirik.rindal@nhm.uio.no`]
}


const renderText = function(lang) {
    if (lang === "Norwegian") {
        index = 0
    } else if (lang === "English") {
        index = 1
    } else {
        index = 0
    }
    
    //header
    //document.querySelector('#about-button').innerHTML = textItems.aboutButton[index]
    document.querySelector('#help-button').innerHTML = textItems.helpButton[index]
        
    let logo = document.querySelector('#logo')
    logo.src = textItems.logo[index]
    if (language === "Norwegian") {
        logo.setAttribute("style", "height:15px")
    } else if (language === "English") {
        logo.setAttribute("style", "height:30px")
    }
    

    //index page
    if (!location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help') & !location.href.includes('corema') & !location.href.includes('map')) {
        document.querySelector('#empty-search').innerHTML = textItems.emptySearch[index]
        document.querySelector('#header-search-page').innerHTML = textItems.headerSearchPage[index]
        document.querySelector('#select-collection-label').innerHTML = textItems.velg_samling[index]
        document.querySelector('#vennligst').innerHTML = textItems.vennligst[index]
        document.querySelector('#search-button').innerHTML = textItems.searchButton[index]
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

        document.querySelector('#download-button').innerHTML = textItems.downloadLink[index]
        document.querySelector('#search-text').placeholder = textItems.placeholder[index]
        document.getElementById('zoom-expl-popup').innerHTML = textItems.mapHelpContent[index]
        document.querySelector('#large-map-button').innerHTML = textItems.largeMapButton[index]
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

        const object = allObject[id]
    
        document.querySelector('#searchButtonHeader').innerHTML = textItems.searchButtonHeader[index]
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
        document.getElementById('zoom-expl-popup').innerHTML = textItems.mapHelpContent[index]
        document.getElementById('large-map-object-button').innerHTML = textItems.largeMapButton[index]
    }
    
    // corema page
    if (location.href.includes('corema')) {
        document.querySelector('#coremaHeader').innerHTML = textItems.coremaHeader[index]
        document.querySelector('#coremaDummyText').innerHTML = textItems.coremaDummyText[index]
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
        document.querySelector('#backToSearchFromHelp').innerHTML = textItems.backToSearchFromHelp[index]
    //     document.querySelector('#backToSearch').addEventListener('click', (e) => {
    //     e.preventDefault()
    //    // erase the last search result
    //     })
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
   
    if (!location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help') & !location.href.includes('corema')) {
        if (document.querySelector("#result-header").innerHTML) {

            if (language === "Norwegian") {
                index = 0
            } else if (language === "English") {
                index = 1
            }

            document.querySelector("#result-header").innerHTML = textItems.searchResultHeadline[index]
            document.querySelector('#head-nb-hits').innerHTML = textItems.nbHitsText[index]
            document.querySelector('#download-button').innerHTML = textItems.downloadLink[index]
            document.querySelector('#large-map-button').innerHTML = textItems.largeMapButton[index]

            const headerRow = document.querySelector("#myTable").rows[0]

            headerRow.cells[1].innerHTML = textItems.headerTaxon[index].bold()
            headerRow.cells[2].innerHTML = textItems.headerCollector[index].bold()
            headerRow.cells[3].innerHTML = textItems.headerDate[index].bold()
            headerRow.cells[4].innerHTML = textItems.headerCountry[index].bold()
            headerRow.cells[5].innerHTML = textItems.headerMunicipality[index].bold()
            headerRow.cells[6].innerHTML = textItems.headerLocality[index].bold()
        }
    }
})


