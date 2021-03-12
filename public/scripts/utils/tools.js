//console.log('Tools page javascript loaded');

let museumURLPath
                
if (window.location.href.includes('/um')) { 
    museumURLPath = urlPath + "/um"
} else if (window.location.href.includes('tmu')) {
    museumURLPath = urlPath + "/tmu"
} else {
    museumURLPath = urlPath + "/nhm"
}

document.querySelector('#statistikk-link').innerHTML = textItems.statistikkLink[index]
document.querySelector('#statistikk-link').href = museumURLPath + '/showStat'

document.querySelector('#DOI-link').innerHTML = textItems.DOILink[index]
document.querySelector('#DOI-link').href = museumURLPath + '/getDOI'