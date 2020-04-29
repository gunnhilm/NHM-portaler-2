const journalSearch = document.getElementById('journal-search-text')
const journalSearchForm = document.getElementById('journal-search-button') 
const limit = 4000


// resultattabell
// Lag overskriftraden
function addHeaders(table, keys) {
//   var row = table.insertRow();
  const tr = document.createElement('tr'); // Header row
  for( let i = 0; i < keys.length; i++ ) {
    // var cell = row.insertCell();
    // cell.appendChild(document.createTextNode(keys[i]));

    const th = document.createElement('th'); //column
    const text = document.createTextNode(keys[i]); //cell
    th.appendChild(text);
    tr.appendChild(th);
    table.appendChild(tr);
  }
}
// lag innmaten
const jorurnalResultTable = (children) => {
const table = document.createElement('table');
table.setAttribute('id', 'journal-result-table')
for( let i = 0; i < children.length; ++i ) {

  let child = children[i];
  if(i === 0 ) {
    addHeaders(table, Object.keys(child));
  }
  const row = table.insertRow();
  Object.keys(child).forEach(function(k) {
    // console.log(k);
    const cell = row.insertCell();
    if(k === 'Flipbook indexfil') {
        console.log('hei');
        child[k] = '<a href="https://data.gbif.no/ggbn/flipbook' + child[k] + '"> FlipBook</a>'
        cell.appendChild(document.createTextNode(''));
        cell.innerHTML = child[k] 
    } else if (k === 'Link for nedlasting av PDF') {
        child[k] = '<a href="https://data.gbif.no/ggbn/flipbook' + child[k] + '"> PDF</a>'
        cell.appendChild(document.createTextNode(''));
        cell.innerHTML = child[k] 
    } else {
    cell.appendChild(document.createTextNode(child[k]));
    }
  })
}

 // send tabellen til frontend
document.getElementById('container').appendChild(table);
}





// hent ut søkeresultater
const doJournalSearch = (limit = 2000) => {
    console.log(journalSearch.value);


    //slett resultattabellen før vi lager en ny
    const elem = document.getElementById('journal-result-table');
    if (elem)
    {
        document.getElementById('container').removeChild(elem);
    }
    // document.getElementById('container').removeChild('container')
    
    const searchTerm = journalSearch.value
    const url = '/search/?search=' + searchTerm +'&samling=journaler&linjeNumber=0&limit=' + limit // normal search
        fetch(url).then((response) => {
            if (!response.ok) {
                throw 'noe går galt med søk, respons ikke ok'
            } else {
                try {
                    response.text().then((data) => {
                        if(data.error) {
                            errorMessage.innerHTML = textItems.serverError[index]
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
                            jorurnalResultTable(parsedResults.data)
                            
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
    doJournalSearch(2000) //
})  