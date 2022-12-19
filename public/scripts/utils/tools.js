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
document.querySelector('#bc-fungi-link').href = museumURLPath + '/DNAbarcodes/?museum=nhm&coll=sopp'
document.querySelector('#bc-lichen-link').href = 'https://nhm2.uio.no/lichens/barcode/olich.php'
document.querySelector('#bc-mammals-link').href = museumURLPath + '/DNAbarcodes/?museum=nhm&coll=mammals'
document.querySelector('#bc-lep-link').href = museumURLPath + '/DNAbarcodes/?museum=nhm&coll=Lep'
document.querySelector('#bc-herptiles-link').href = museumURLPath + '/DNAbarcodes/?museum=nhm&coll=herptiles'
document.querySelector('#bc-birds-link').href = museumURLPath + '/DNAbarcodesBirds'

// document.querySelector('#coordinate-link').href = museumURLPath + '/checkCoord'

console.log(museumURLPath)
// if (!museumURLPath === urlPath + "/nhm") {
//     document.querySelector('#bc-fungi-link').style.display = "none"
//     document.querySelector('#bc-mammals-link').style.display = "none"
//     document.querySelector('#bc-lep-link').style.display = "none"
//     document.querySelector('#bc-herptiles-link').style.display = "none"
//     document.querySelector('#bc-lichen-link').style.display = "none"
    
// }