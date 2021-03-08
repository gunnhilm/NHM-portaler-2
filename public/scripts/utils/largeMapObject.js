const loadStringObjectMapPage = () => {
    let objectJSON = ''
    //if( sessionStorage.getItem('databaseSearch') === 'musit' ) {
        objectJSON = sessionStorage.getItem('string')
    //} else if (sessionStorage.getItem('databaseSearch') === 'corema') {
    //    objectJSON = sessionStorage.getItem('coremaString')
    //}
    try {
        return objectJSON ? JSON.parse(objectJSON) : []
    } catch (e) {
        return []
    }
}

const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')

const allObject = loadStringObjectMapPage()

const object = allObject.find(x => x.catalogNumber === id)

drawMapObject(object)

// var zoomButton = document.getElementById("zoom-button")
//     zoomButton.style.display = "block"
