function swapStyleSheet(sheet) {
    document.getElementById('museumStyle').setAttribute('href', sheet)
}

const getMuseumStyleSheet = () => {
    console.log(window.location.href)
    if (window.location.href.includes('/um')) {
        swapStyleSheet('/museum/styles/styles_UM.css')
    } else if (window.location.href.includes('tmu')){
        swapStyleSheet('/museum/styles/styles_TMU.css')
    } else if (window.location.href.includes('nhm')) {
        swapStyleSheet('/museum/styles/styles_NHM.css')
    }
}

getMuseumStyleSheet()

