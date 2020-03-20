// read string and get the object from sessionStorage
const loadCoremaData = () => {
    const coremaDataObject = sessionStorage.getItem('coremaData')
    console.log(coremaDataObject)
    try {
        return coremaDataObject ? JSON.parse(coremaDataObject) : []
    } catch (e) {
        return []
    }
}



//get the object from session storage
const coremaData = loadCoremaData()
console.log(coremaData)