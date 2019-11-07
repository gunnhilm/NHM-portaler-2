const textItemsObject = {
    objectPageHeader: ['Objektvisning', 'Object view'],
    name: ['Vitenskapelig navn: ', 'Scientific name: '],
    det: ['Bestemt av: ', 'Determined by: '],
    detDate: ['Dato for bestemming: ', 'Date of determination: '],
    collDate: ['Innsamlingsdato: ', 'Collection date: '],
    collector: ['Innsamler: ', 'Collector: '],
    locality: ['Lokalitet: ', 'Locality: '],
    coordinates: ['Koordinater: ', 'Coordinates: '],
    artsobs: ['Artsobservasjon ID: ', 'Species Observation ID: '],
    photoAlt: ['Det finnes ikke noe bilde for dette objektet, eller det kan ikke vises', 'There is no photo for this object, or it cannot be shown.']
}

const renderTextObject = function(lang) {
    if (lang === "Norwegian") {
        index = 0
    } else if (lang === "English") {
        index = 1
    }


    document.getElementById("object_page_header").innerHTML = textItemsObject.objectPageHeader[index]
    document.getElementById("name").innerHTML = textItemsObject.name[index]
    document.getElementById("det").innerHTML = textItemsObject.det[index]
    document.getElementById("detDate").innerHTML = textItemsObject.detDate[index]
    document.getElementById("collDate").innerHTML = textItemsObject.collDate[index]
    document.getElementById("coll").innerHTML = textItemsObject.collector[index]
    document.getElementById("locality").innerHTML = textItemsObject.locality[index]
    document.getElementById("coordinates").innerHTML = textItemsObject.coordinates[index]

    document.getElementById("photo_box").alt = textItemsObject.photoAlt[index]

    if ( objekt.ArtObsID ) {
        document.getElementById("artsobs").innerHTML = textItemsObject.artsobs[index]
    }
}

let language = document.querySelector('#language').value
renderTextObject(language)

document.querySelector('#language').addEventListener('change', (e) => {
    language = e.target.value
    renderTextObject(language)
})

