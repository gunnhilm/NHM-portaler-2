//sets attribute to css-file
// in: sheet (string, name and path to css-file)
// is called in getMuseumStyleSheet()
function swapStyleSheet(sheet) {
    document.getElementById('museumStyle').setAttribute('href', sheet)
}


// figures out which museum we are in
// and redirects if we are using the old url https://samlingsportal.nhm.uio.no/nhm/ to https://samlingsportal.nhm.uio.no/museum/nhm/
// needs proxypass in apache server ProxyPass /nhm http://localhost:3000
const redirectIfWrong = () => {
    let museum = window.location.pathname
    host = window.location.origin
    museum = museum.split('/')
    if (museum[1].toLowerCase() === 'nhm'){
        location.replace(host + "/museum/nhm")
    }  
}



// swaps styel sheet when another museum is chosen in url
// is called in this file
const getMuseumStyleSheet = () => {
    if (window.location.href.includes('/um')) {
        swapStyleSheet('/museum/styles/styles_UM.css')
    } else if (window.location.href.includes('tmu')){
        swapStyleSheet('/museum/styles/styles_TMU.css')
    } else if (window.location.href.includes('/nbh')) {
        swapStyleSheet('/museum/styles/styles_NBH.css')
    } else if (window.location.href.includes('/nhm')) {
        swapStyleSheet('/museum/styles/styles_NHM.css')
    } else {
        // hvis det feil i urlen så gjør vi den om til museum/nhm
        location.replace("/museum/nhm")
    }
}

redirectIfWrong()

getMuseumStyleSheet()

