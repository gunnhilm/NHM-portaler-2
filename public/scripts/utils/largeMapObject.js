// Calls function that draw map for a single object.

// fetches JSON-version of search-result from session Storage
// is called in this file (largeMapObject.js)
const loadStringObjectMapPage = () => {
    let objectJSON = ''
        objectJSON = sessionStorage.getItem('string')
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

