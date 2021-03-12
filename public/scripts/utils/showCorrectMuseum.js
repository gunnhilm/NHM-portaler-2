function swapStyleSheet(sheet) {
    document.getElementById('museumStyle').setAttribute('href', sheet)
}

const getHostname = (url) => {
    // use URL constructor and return hostname
    return new URL(url).hostname;
  }

const getMuseumStyleSheet = () => {
    // console.log(window.location.href)
    if (window.location.href.includes('/um')) {
        swapStyleSheet('/museum/styles/styles_UM.css')
    } else if (window.location.href.includes('tmu')){
        swapStyleSheet('/museum/styles/styles_TMU.css')
    } else if (window.location.href.includes('/nhm')) {
        swapStyleSheet('/museum/styles/styles_NHM.css')
    } else {
        // hvis det feil i urlen så gjør vi den om til museum/nhm
        
        // myDomain = getHostname(window.location.href)
        // console.log('her kommer domain: ' + myDomain);
        location.replace("/museum/nhm")
    }
}

getMuseumStyleSheet()

