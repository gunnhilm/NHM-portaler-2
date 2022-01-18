//Renders content in tools.hbs

let museumURLPath
                
if (window.location.href.includes('/um')) { 
    museumURLPath = urlPath + "/um"
} else if (window.location.href.includes('tmu')) {
    museumURLPath = urlPath + "/tmu"
} else if (window.location.href.includes('nbh')) {
    museumURLPath = urlPath + "/nbh"
} else {
    museumURLPath = urlPath + "/nhm"
}


document.querySelector('#statistikk-link').href = museumURLPath + '/showStat'
document.querySelector('#DOI-link').href = museumURLPath + '/getDOI'
document.querySelector('#data-error-link').href = museumURLPath + '/dataErrors'
document.querySelector('#arts-obs-link').href = museumURLPath + '/artsObs'
// document.querySelector('#coordinate-link').href = museumURLPath + '/checkCoord'