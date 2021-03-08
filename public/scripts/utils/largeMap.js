const loadString = () => {
    try {
        const searchResult = JSON.parse(sessionStorage.getItem('string'))
        if (searchResult) {
            // loop through - put those which are checked in new array
            const newArray = []
            searchResult.forEach(el => {
                if (el.checked) {newArray.push(el)}
            })
            return newArray
        } else {
            return []
        }
        
    } catch (e) {
        return []
    }
}

const allObject = loadString()

drawMap(allObject)

// var zoomButton = document.getElementById("zoom-button")
//     zoomButton.style.display = "block"
