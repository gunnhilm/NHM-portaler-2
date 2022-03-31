// Renders content in journaler.hbs

const journalSearch = document.getElementById('journal-search-text')
const journalSearchForm = document.getElementById('search-button') 
const errorMessage = document.getElementById('head-nb-hits')
const nbHitsElement = document.getElementById('nb-hits') 
const columnsToShow = 14
let journalCollection = ''
// figures out which museum we are in
// out: string, abbreviation for museum
// is called by doSearch() and updateFooter()
const getCurrentMuseum = () => {
    let museum = window.location.pathname
    museum = museum.split('/')
    return museum[2]
}

function addTextInButtons(a) {
    if (a == 'botanikk') {return textItems.botanikk[index]}
    else if (a == 'mykologi') {return textItems.mykologi[index]}
    else if (a == 'zoologi') {return textItems.zoologi[index]}
    else if (a == 'geologi') {return textItems.geologi[index]}
    else if (a == 'paleontologi') {return textItems.paleontologi[index]}
    else if (a == 'other') {return textItems.otherCollections[index]}
}

function removeResults() {
    try {
        const Table = document.getElementById("journal-result-table");
        Table.innerHTML = "";
        const hits = document.getElementById("nb-hits");
        hits.innerHTML = "";
    } catch (error) {
        // do nothing
    }

}
// buttons for the different types of journals
function makeButtons() {
    const buttonArray = []
    journalTypes = sessionStorage.getItem('journals').split(',')
    console.log(journalTypes);
    journalTypes.forEach(el => {
        button = document.createElement("button")
        button.innerHTML = addTextInButtons(el)
        button.id = el
        button.className = "white-button"
        document.getElementById("journal-type").appendChild(button)
        buttonArray.push(button)   
    })
    buttonArray.forEach(el => {
        el.addEventListener('click', (e) => {
            removeResults()
            buttonArray.forEach(el => {
                el.className = "white-button"
            })
            if(el.id === 'paleontologi') {
                journalCollection = 'palJournaler'
                el.className = "blue-button" 
            }
            if(el.id === 'zoologi') {
                journalCollection = 'zooJournaler'
                el.className = "blue-button" 
            }
            e.preventDefault()
        })
    })
}



// resultattabell

// creates the headers in the table
// in: table (html-table, to show on the page)
// in: keys (array?, source of header titles)
// is called in journalResultTable(..)
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


// creates table for the journals and fills it
// in: children (array, containing content to table, i.e. data on journals) 
// calls addHeaders(..)
// is called in dojournalSearch(..)
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
                //if(k.includes('FlipBook')) {
                if (index === 0) {
                    // child[k] = '<a href ="https://data.gbif.no/ggbn/flipbook' + child[k] + '">FlipBook</a>'
                    child[k] = '<a href ="https://samlingsportal.nhm.uio.no/journaler/nhm/' + child[k] + '">FlipBook</a>'
                    cell.appendChild(document.createTextNode(''));
                    cell.innerHTML = child[k] 
                } else if (k.startsWith('PDF')) {
                    // child[k] = '<a href ="https://data.gbif.no/ggbn/flipbook' + child[k] + '"> PDF</a>'
                    child[k] = '<a href ="https://samlingsportal.nhm.uio.no/journaler/nhm/' + child[k] + '"> PDF</a>'
                    cell.appendChild(document.createTextNode(''));
                    cell.innerHTML = child[k] 
                } else  if (k.includes('NHM ID')) {
                    cell.appendChild(document.createTextNode(child[k]))
                    cell.className = 'nowrap'
                } else {
                    cell.appendChild(document.createTextNode(child[k]));
                }
            }
        })
    }

    // send tabellen til frontend
    document.getElementById('container').appendChild(table);
}


const getJournalGroup = () => {
    sessionStorage.setItem('journals', 'zoologi,paleontologi');
    const journalGroups = ['Zoology', 'Palaeontology']
    return journalGroups
}

// performs search and fetches data
// in: limit (integer; maximum number of records to display)
// calls journalResultTable(..)
// is called in journalSearchForm.eventlistener
const doJournalSearch = (limit = 2000) => {
    //slett resultattabellen før vi lager en ny
    const elem = document.getElementById('journal-result-table');
    if (elem)
    {
        document.getElementById('container').removeChild(elem);
    }
    let museum = getCurrentMuseum() 
    const searchTerm = journalSearch.value
    if(!journalCollection) {
        journalCollection = 'zooJournaler'
    }
    // const url = urlPath + '/search/?search=' + searchTerm + '&museum=' + museum + '&samling=zooJournaler&linjeNumber=0&limit=' + limit // normal search
    const url = urlPath + '/search/?search=' + searchTerm + '&museum=' + museum + '&samling='+ journalCollection + '&linjeNumber=0&limit=' + limit // normal search
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
        updateFooter()
} 


// when somebody clicks search-button
journalSearchForm.addEventListener('click', (e) => {
    e.preventDefault()
    errorMessage.innerText = "" // fjern feilmeldinger
    doJournalSearch(2000) //
    
})  

// sends request to server for date of last change of the journal-datafile
// is called in this file (journaler.js)
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

getJournalGroup()
makeButtons()


// updateFooter()
// doJournalSearch()


