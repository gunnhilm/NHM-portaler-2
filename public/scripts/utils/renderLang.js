const textItems = {
    // header
    searchButtonHeader: ["Søk", "Search"],
    aboutButton: ["Om sidene", "About"],
    helpButton: ["Hjelp", "Help"],
    logo: ["/images/uio_nhm_segl_a.png", "/images/uio_nhm_seal_a_eng.png"],
    
    // index page
    sok_i_samlingene: ["Søk i samlingene", "Search the collections"],
    velg_samling: ["Velg en samling", "Choose a collection" ],
    vennligst: ["--Vennligst gjør et valg--", "--Please make a choice--"],
    sok_knapp: ["Søk", "Search"],
    karplanter: ["Karplanter", "Vascular plants"],
    sopp: ["Sopp", "Fungi"],
    moser: ["Moser", "Mosses"],
    lav: ["Lav", "Lichens"],
    alger: ["Alger", "Algae"],
    insekter: ["Insekter", "Insects"],
    downloadLink: ["Last ned resultater", "Download"],
    searchResultHeadline: ["Resultat", "Search result"],
    nbHitsText: ["Antall treff: ", "Number of hits: "],
    headerTaxon: ["Takson", "Taxon"],
    headerCollector: ["Innsamler", "Collector"],
    headerDate: ["Dato", "Date"],
    headerCountry: ["Land", "Country"],
    headerMunicipality: ["Kommune", "Municipality"],
    headerLocality: ["Sted", "Locality"],
    mustChoose: ["Du må velge en samling", "You must choose a collection"],
    placeholder: ["søk", "Search"],

    // object page
    objectPageHeader: ['Objektvisning', 'Object view'],
    name: ['Vitenskapelig navn: ', 'Scientific name: '],
    det: ['Bestemt av: ', 'Determined by: '],
    detDate: ['Dato for bestemming: ', 'Date of determination: '],
    collDate: ['Innsamlingsdato: ', 'Collection date: '],
    collector: ['Innsamler: ', 'Collector: '],
    locality: ['Lokalitet: ', 'Locality: '],
    coordinates: ['Koordinater: ', 'Coordinates: '],
    artsobs: ['Artsobservasjon ID: ', 'Species Observation ID: '],
    photoAlt: ['Det finnes ikke noe bilde for dette objektet, eller det kan ikke vises', 'There is no photo for this object, or it cannot be shown.'],

    // about page
    aboutHeader: ["Om NHMs samlingsportal", "About NHM's collection portal"],
    aboutText: ["Nettportalen er laget av Eirik Rindal og Gunnhild Marthinsen ", "The web portal is made by Eirik Rindal and Gunnhild Marthinsen"],

    // help page
    helpHeader: ["Hjelpeside", "Help page"],
    helpText: ["Her kommer en hjelpetekst", "Help-text to come"]
}


const renderText = function(lang) {
    if (lang === "Norwegian") {
        index = 0
    } else if (lang === "English") {
        index = 1
    }
    
    //header
    document.querySelector('#searchButtonHeader').innerHTML = textItems.searchButtonHeader[index]
    document.querySelector('#aboutButton').innerHTML = textItems.aboutButton[index]
    document.querySelector('#helpButton').innerHTML = textItems.helpButton[index]
    document.querySelector('#logo').src = textItems.logo[index]

    //index page
    if (!location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help')) {
        document.querySelector('#sok_i_samlingene').innerHTML = textItems.sok_i_samlingene[index]
        document.querySelector('#velg_en_samling').innerHTML = textItems.velg_samling[index]
        document.querySelector('#vennligst').innerHTML = textItems.vennligst[index]
        document.querySelector('#sok').innerHTML = textItems.sok_knapp[index]
        document.querySelector('#karplanter').innerHTML = textItems.karplanter[index]
        document.querySelector('#sopp').innerHTML = textItems.sopp[index]
        document.querySelector('#moser').innerHTML = textItems.moser[index]
        document.querySelector('#lav').innerHTML = textItems.lav[index]
        document.querySelector('#alger').innerHTML = textItems.alger[index]
        document.querySelector('#insekter').innerHTML = textItems.insekter[index]
        document.querySelector('#downloadButton').innerHTML = textItems.downloadLink[index]

        document.querySelector('#search-text').placeholder = textItems.placeholder[index]
    }

    if (location.href.includes('object')) {
    // object page
    
        document.getElementById("object_page_header").innerHTML = textItems.objectPageHeader[index]
        document.getElementById("name").innerHTML = textItems.name[index]
        document.getElementById("det").innerHTML = textItems.det[index]
        document.getElementById("detDate").innerHTML = textItems.detDate[index]
        document.getElementById("collDate").innerHTML = textItems.collDate[index]
        document.getElementById("coll").innerHTML = textItems.collector[index]
        document.getElementById("locality").innerHTML = textItems.locality[index]
        document.getElementById("coordinates").innerHTML = textItems.coordinates[index]

        document.getElementById("photo_box").alt = textItems.photoAlt[index]

        if (objekt.ArtObsID) {
            document.getElementById("artsobs").innerHTML = textItems.artsobs[index]
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
    }

}

let language = document.querySelector('#language').value
renderText(language)


document.querySelector('#language').addEventListener('change', (e) => {
    language = e.target.value
    renderText(language)
   
    if (!location.href.includes('object') & !location.href.includes('about') & !location.href.includes('help')) {
        if (document.getElementById("resultHeader").innerHTML) {

            if (language === "Norwegian") {
                index = 0
            } else if (language === "English") {
                index = 1
            }

            document.getElementById("resultHeader").innerHTML = textItems.searchResultHeadline[index]
            document.getElementById('nbHits').innerHTML = textItems.nbHitsText[index]

            document.getElementById('downloadButtonId').innerHTML = textItems.downloadLink[index]

            const headerRow = document.getElementById("myTable").rows[0]

            headerRow.cells[1].innerHTML = textItems.headerTaxon[index].bold()
            headerRow.cells[2].innerHTML = textItems.headerCollector[index].bold()
            headerRow.cells[3].innerHTML = textItems.headerDate[index].bold()
            headerRow.cells[4].innerHTML = textItems.headerCountry[index].bold()
            headerRow.cells[5].innerHTML = textItems.headerMunicipality[index].bold()
            headerRow.cells[6].innerHTML = textItems.headerLocality[index].bold()
        }
    }
})


