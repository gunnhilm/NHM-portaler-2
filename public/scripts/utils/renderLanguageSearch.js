const textItems = {
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
    downloadLink: ["Last ned", "Download"],
    searchResultHeadline: ["Resultat", "Search result"],
    nbHitsText: ["Antall treff: ", "Number of hits: "],
    headerTaxon: ["Takson", "Taxon"],
    headerCollector: ["Innsamler", "Collector"],
    headerDate: ["Dato", "Date"],
    headerCountry: ["Land", "Country"],
    headerMunicipality: ["Kommune", "Municipality"],
    headerLocality: ["Sted", "Locality"],
    mustChoose: ["Du må velge en samling", "You must choose a collection"],
    placeholder: ["søk", "Search"]

}


const renderText = function(lang) {
    if (lang === "Norwegian") {
        index = 0
    } else if (lang === "English") {
        index = 1
    }
    
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

    document.querySelector('#downloadLink').innerHTML = textItems.downloadLink[index]
    document.querySelector('#search-text').placeholder = textItems.placeholder[index]
}


renderText(language)


document.querySelector('#language').addEventListener('change', (e) => {
    language = e.target.value
    renderText(language)
   
    if (document.getElementById("resultHeader").innerHTML) {
        
        if (language === "Norwegian") {
            index = 0
        } else if (language === "English") {
            index = 1
        }
        
        document.getElementById("resultHeader").innerHTML = textItems.searchResultHeadline[index]
        document.getElementById('nbHits').innerHTML = textItems.nbHitsText[index]
        
        const headerRow = document.getElementById("myTable").rows[0]
           
        headerRow.cells[1].innerHTML = textItems.headerTaxon[index].bold()
        headerRow.cells[2].innerHTML = textItems.headerCollector[index].bold()
        headerRow.cells[3].innerHTML = textItems.headerDate[index].bold()
        headerRow.cells[4].innerHTML = textItems.headerCountry[index].bold()
        headerRow.cells[5].innerHTML = textItems.headerMunicipality[index].bold()
        headerRow.cells[6].innerHTML = textItems.headerLocality[index].bold()  
    }
})

