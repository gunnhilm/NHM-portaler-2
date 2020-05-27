const journalSearch = document.getElementById('journal-search-text')
const journalSearchForm = document.getElementById('search-button') 
const errorMessage = document.getElementById('head-nb-hits')
const nbHitsElement = document.getElementById('nb-hits') 
const columnsToShow = 13
// resultattabell
// Lag overskriftraden
function addHeaders(table, keys) {
//   var row = table.insertRow();
  const tr = document.createElement('tr'); // Header row
//   for( let i = 0; i < keys.length; i++ ) {
    for( let i = 0; i < columnsToShow; i++ ) {
        const th = document.createElement('th'); //column
        const text = document.createTextNode(keys[i]); //cell
        th.appendChild(text);
        tr.appendChild(th);
        table.appendChild(tr);
    }
}


// lag innmaten
const journalResultTable = (children) => {
    const table = document.createElement('table');
    table.setAttribute('id', 'journal-result-table')
    table.setAttribute('class', 'result-table')


    for( let i = 0; i < children.length; ++i ) {
        let child = children[i];
        if(i === 0 ) {
            addHeaders(table, Object.keys(child));
        }
        const row = table.insertRow();
        Object.keys(child).forEach(function(k ,index) {
            if (index < columnsToShow) {
                const cell = row.insertCell()
                if (index === 0) {
                    cell.appendChild(document.createTextNode(child[k]))
                    cell.className = 'nowrap'
                } else if(k.includes('Flipbook')) {
                    child[k] = '<a href="https://data.gbif.no/ggbn/flipbook' + child[k] + '"> FlipBook</a>'
                    cell.appendChild(document.createTextNode(''));
                    cell.innerHTML = child[k] 
                } else if (k.includes('PDF')) {
                    child[k] = '<a href="https://data.gbif.no/ggbn/flipbook' + child[k] + '"> PDF</a>'
                    cell.appendChild(document.createTextNode(''));
                    cell.innerHTML = child[k] 
                } else {
                    cell.appendChild(document.createTextNode(child[k]));
                }
            }
        })
    }

    // send tabellen til frontend
    document.getElementById('container').appendChild(table);
}


// hent ut søkeresultater
const doJournalSearch = (limit = 2000) => {

    //slett resultattabellen før vi lager en ny
    const elem = document.getElementById('journal-result-table');
    if (elem)
    {
        document.getElementById('container').removeChild(elem);
    }
    
    const searchTerm = journalSearch.value
    const url = urlPath + '/search/?search=' + searchTerm +'&samling=journaler&linjeNumber=0&limit=' + limit // normal search
        fetch(url).then((response) => {
            if (!response.ok) {
                // throw 'noe går galt med søk, respons ikke ok' + response
                console.error(response);
                errorMessage.innerText = textItems.serverError[index] // Feilmelding som sier   serverError: ["Serverfeil, prøv nytt søk", "Server error, try new search"],
            } else {
                try {
                    response.text().then((data) => {
                        if(data.error) {
                            errorMessage.innerText = textItems.serverError[index]
                            return console.log(data.error)
                        } else {
                            const JSONdata = JSON.parse(data)    
                            const parsedResults = Papa.parse(JSONdata.unparsed.results, {
                                delimiter: "\t",
                                newline: "\n",
                                quoteChar: '',
                                header: true,
                            })  
                            //load results
                            if (parsedResults.data.length > 0){
                                journalResultTable(parsedResults.data)
                                errorMessage.innerText = textItems.nbHitsText[index] 
                                nbHitsElement.innerText = parsedResults.data.length
                            } else {
                                console.log('no results');
                                errorMessage.innerText = textItems.noHits[index]   
                            }
                        }
                    })
                } catch (error) {
                    console.log('Feil med søk');
                    
                }
            }
        })
} 


// when somebody clicks search-button
journalSearchForm.addEventListener('click', (e) => {
    e.preventDefault()
    errorMessage.innerText = "" // fjern feilmeldinger
    doJournalSearch(2000) //
    
})  

// when a collection is chosen a request is sent to the server about date of last change of the journaler file
const updateFooter = () => {
        const url = urlPath + '/footer-date/?&samling=journaler' 
        fetch(url).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.text()
            }
        }).then ((data) => {
            data=JSON.parse(data)
            lastUpdated = 'Dataene ble sist oppdatert: ' + data.date
            document.querySelector('#last-updated').textContent = lastUpdated
        }) .catch((error) => {
            console.error('There is a problem, probably file for collection does not exist', error)
        })
}

updateFooter()


