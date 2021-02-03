function swapStyleSheet(sheet) {
document.getElementById('museumStyle').setAttribute('href', sheet)
console.log('hei');
}

const getMuseum = () => {
    if (window.location.href.includes('um')) {
        swapStyleSheet('/nhm/styles/styles_UM.css')
    } else if (window.location.href.includes('tmu')){
        swapStyleSheet('/nhm/styles/styles_TMU.css')
    } else {
        swapStyleSheet('/nhm/styles/styles_NHM.css')
    }
}

getMuseum()