//sets attribute to css-file
// in: sheet (string, name and path to css-file)
// is called in getMuseumStyleSheet()
function swapStyleSheet(sheet) {
    document.getElementById('museumStyle').setAttribute('href', sheet)
}

const getHostname = (url) => {
    // use URL constructor and return hostname
    return new URL(url).hostname;
  }

// swaps styel sheet when another museum is chosen in url
// is called in this file
const getMuseumStyleSheet = () => {
    if (window.location.href.includes('/um')) {
        swapStyleSheet('/museum/styles/styles_UM.css')
    } else if (window.location.href.includes('tmu')){
        swapStyleSheet('/museum/styles/styles_TMU.css')
    } else if (window.location.href.includes('/nhm')) {
        swapStyleSheet('/museum/styles/styles_NHM.css')
    } else {
        // hvis det feil i urlen så gjør vi den om til museum/nhm
        location.replace("/museum/nhm")
    }
}

getMuseumStyleSheet()

