console.log('client side javascript is loaded');

// når noen trykker på søk
const searchForm = document.querySelector('form')
const search = document.querySelector('input')
const antall = document.querySelector('#antall-treff')
const samling = document.querySelector('#collection-select')

const resultTable = (data) => {
    localStorage.clear() 
    localStorage.setItem('string', data)    // Save searchresult to local storage
    data = JSON.parse(data)
    console.log(data)

    const antallTreff = data.results.length
    antall.textContent = antallTreff
    
    const resultHeader = document.getElementById("resultHeader")
    resultHeader.innerHTML = "Resultat"
    const nbHits = document.getElementById("nbHits")
    nbHits.innerHTML = "Antall treff: "


    const table = document.getElementById("myTable")
    table.innerHTML = "";
    for (i = -1; i < antallTreff; i++) {
        const row = table.insertRow(-1)

        const cell1 = row.insertCell(0)
        const cell2 = row.insertCell(1)
        const cell3 = row.insertCell(2)
        const cell4 = row.insertCell(3)
        if (i === -1) {
            // header row
            cell1.innerHTML = 'MUSIT nummer'.bold()
            cell2.innerHTML = 'Takson'.bold()
            cell3.innerHTML = 'Land'.bold()
            cell4.innerHTML = 'Innsamler'.bold()
        } else {
            cell1.innerHTML =  `<a id="objekt-link" href="http://localhost:3000/object/?id=${i}"> ${data.results[i].catalogNumber} </a>`
            cell2.innerHTML = data.results[i].scientificName
            cell3.innerHTML = data.results[i].country
            cell4.innerHTML = data.results[i].recordedBy
        }
    }    
}


searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = search.value
        console.log(searchTerm);
    const valgtSamling = samling.value
        console.log(valgtSamling);
    // Show please wait
    document.getElementById("pleaseWait").style.display = "block"
    
    if (!valgtSamling) {
        resultHeader.innerHTML = "Du må velge samling før du kan søke"
    } else {
        const url = 'http://localhost:3000/search/?search=' + searchTerm +'&samling=' + valgtSamling
        fetch(url).then((response) => {
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {
                    resultTable(data)
                }
            })
            document.getElementById("pleaseWait").style.display = "none"
        })    
    }
})

