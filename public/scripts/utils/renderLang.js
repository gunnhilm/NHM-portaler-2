const textItems = {
    // header
    aboutButton: ["Om sidene", "About"],
    helpButton: ["Hjelp", "Help"],
    logo: ["/images/uio_nhm_a_cmyk.png", "/images/uio_nhm_a_eng_cmyk.png"],
    
    // index page
    emptySearch: ["Tøm søk", "Empty search"],
    headerSearchPage: ["Søk i samlingene", "Search the collections"],
    velg_samling: ["Velg en samling", "Choose a collection" ],
    vennligst: ["--Vennligst gjør et valg--", "--Please make a choice--"],
    searchButton: ["Søk", "Search"],
    karplanter: ["Karplanter", "Vascular plants"],
    sopp: ["Sopp", "Fungi"],
    moser: ["Moser", "Mosses"],
    lav: ["Lav", "Lichens"],
    alger: ["Alger", "Algae"],
    insekter: ["Insekter", "Insects"],
    downloadLink: ["Last ned tab-separert resultatfil", "Download tab-delimited result file"],
    searchResultHeadline: ["Resultat", "Search result"],
    nbHitsText: ["Antall treff: ", "Number of hits: "],
    headerTaxon: ["Takson", "Taxon"],
    headerCollector: ["Innsamler", "Collector"],
    headerDate: ["Dato", "Date"],
    headerCountry: ["Land", "Country"],
    headerMunicipality: ["Kommune", "Municipality"],
    headerLocality: ["Sted", "Locality"],
    mustChoose: ["Du må velge en samling", "You must choose a collection"],
    placeholder: ["Søk", "Search term"],
    serverError: ["Serverfeil, prøv nytt søk", "Server error, try new search"],
    noHits: ["Ingen treff, prøv nytt søk", "No hits, try new search"],
    errorToMuchData: ["For mange treff til å vises, begrens søket med f.eks. flere søkeord", "Too many hits to show, limit the seach by e.g. more search terms"],
    errorFileNotExisting: ["Beklager, noe er feil med valgte samling. Velg en annen samling, kom tilbake senere, eller kontakt oss (se hjelpesiden)",
     "Sorry, something is wrong with the chosen collection. Choose another collection, come back later, or contact us (see help page)"],
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
    mapAlt: ['Kart ikke tilgjengelig', 'Map not available'],

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
    if (!location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help')) {
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
        document.querySelector('#download-button').innerHTML = textItems.downloadLink[index]

        document.querySelector('#search-text').placeholder = textItems.placeholder[index]
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
        
        if(!object.decimalLatitude | !object.decimalLongitude) {
            document.querySelector("#map").innerHTML = textItems.mapAlt[index]
        }

        if (object.ArtObsID) {
            document.querySelector("#head-artsobs").innerHTML = textItems.headArtsobs[index]
        }
        if (object.habitat ) {
            document.querySelector("#head-habitat").innerHTML = "Habitat: "
            
         }
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
   
    if (!location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help')) {
        if (document.querySelector("#result-header").innerHTML) {

            if (language === "Norwegian") {
                index = 0
            } else if (language === "English") {
                index = 1
            }

            document.querySelector("#result-header").innerHTML = textItems.searchResultHeadline[index]
            document.querySelector('#head-nb-hits').innerHTML = textItems.nbHitsText[index]

            document.querySelector('#download-button').innerHTML = textItems.downloadLink[index]

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

