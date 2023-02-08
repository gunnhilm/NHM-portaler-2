const searchForm = document.querySelector('form') 
const select = document.getElementById("collection-select");

const papaParseConfig = {
	delimiter: "",	// auto-detect
	newline: "",	// auto-detect
	quoteChar: '"',
	escapeChar: '"',
	header: false,
	transformHeader: undefined,
	dynamicTyping: false,
	skipEmptyLines: 'greedy',
	delimitersToGuess: [',', '\t', '|', ';']
}


const getInput = () => {
    let museumsNumbers = document.getElementById('museums-Numbers').value
    // replace all lineshifts with comma
    let arrayOfNumbers = Papa.parse(museumsNumbers, papaParseConfig)

    arrayOfNumbers = Papa.parse(museumsNumbers, papaParseConfig)

    let flatNumbers = arrayOfNumbers.data.flat()
    arrayOfNumbers.length = 0
    // Remove prefix from numbers
    // flatNumbers = flatNumbers.map(function (el) {
    //     return el.replace(/\D/g,'');
    // });
    // Fjern tomme felter i array
    flatNumbers = flatNumbers.filter(Boolean)
    console.log(flatNumbers);
    return flatNumbers
}

const putRequestTogether = (arrayOfNumbers) => {
    const currentCollectioID = document.getElementById('collection-key').value
    const epost = document.getElementById('email').value
    const brukerNavn = document.getElementById('username').value
    const dataset_predicate = {'type': 'equals', 'key': 'DATASET_KEY', 'value': currentCollectioID}
    const nested_predicate = {
        'type': 'and',
        'predicates': [
        dataset_predicate,
        {
        'type': 'in',
        'key': "CATALOG_NUMBER",
        'values': arrayOfNumbers
        }
        ]
    }
    const data = {
        "creator": brukerNavn,
        "notificationAddress": [epost],
        "sendNotification": "true",
        "format": "DWCA",
        "predicate": nested_predicate,
    }
    console.log(data);
return data
}

const getDOI = (downloadKey) => {
    var downLoadDate = new Date().toLocaleDateString();
    console.log('start på andre nedlstning');
    const metaDataUrl = 'https://api.gbif.org/v1/occurrence/download/' + downloadKey
    fetch(metaDataUrl)
    .then(response => response.json())
    .then(function(result) { 
        console.log(result.doi)
        console.log(result.downloadLink);
        document.getElementById("please-wait").style.display = "none"
        document.getElementById("Citation").textContent = 'Citation: GBIF.org (' + (downLoadDate)  + ') GBIF Occurrence Download  https://doi.org/' + result.doi
        document.getElementById("DOI-result").textContent = 'DOIlink:  https://doi.org/' + result.doi
        document.getElementById("Download-link").textContent = 'Download link: ' + result.downloadLink
        // alert(result.doi + '\n' + result.downloadLink)
    });
};

async function sendRequest(request) {
    const brukerNavn = document.getElementById('username').value
    const password = document.getElementById('current-password').value
    const url = 'https://api.gbif.org/v1/occurrence/download/request'
    const xhr = new XMLHttpRequest();
    const passstring = brukerNavn + ':' + password;
    const base64Credentials = btoa(passstring)

    xhr.open("POST", url, true);
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("Authorization", "Basic " + base64Credentials);
    xhr.send(JSON.stringify(request));
    xhr.onload = function() {
        if(xhr.status < 399 ){
       getDOI(this.responseText)
        } else {
            language = sessionStorage.getItem('language')
            if (language === "English") {
                index = 1
            } else {
                index = 0
            }
            if(xhr.status === 401){
                alert(textItems.errorLogin[index])
            } else {
            alert(textItems.errorServer[index] + xhr.status + ': ' + xhr.statusText)   
            }
        document.getElementById("please-wait").style.display = "none"
        return
        }
    };
}

//*********************************

// Set up a help table that show how the catalouge numbers should be formatted
const columnsToShow = 2

// resultattabell

// creates the headers in the table
// in: table (html-table, to show on the page)
// in: keys (array?, source of header titles)
// is called in journalResultTable(..)
function addHeaders(table, item1, item2) {
    let text = ''
  const tr = document.createElement('tr'); // Header row
    for( let i = 0; i < columnsToShow; i++ ) {
        const th = document.createElement('th'); //column
        if (i === 0){
            text = document.createTextNode(item1); //cell
        } else if (i === 1){
            text = document.createTextNode(item2); //cell 
        }
        th.appendChild(text);
        tr.appendChild(th);
        table.appendChild(tr);
    }
}


// creates table for the journals and fills it
// in: children (array, containing content to table, i.e. data on journals) 
// calls addHeaders(..)
// is called in dorournalSearch(..)
const catalougeHelpTable = (children) => {

    const elem = document.getElementById('catalouge-number-help-table');
    if (elem)
    {
        document.getElementById('container').removeChild(elem);
    }

    const table = document.createElement('table');
    table.setAttribute('id', 'catalouge-number-help-table')
    table.setAttribute('class', 'result-table')
    addHeaders(table, 'Collection', 'Catalouge number style');
let i = 0
    for (const [key, value] of Object.entries(children)) {
        let child = value;
        const row = table.insertRow();
        Object.entries(child).forEach(function(k) {
                const cell = row.insertCell()
                if (i === 0) {
                    cell.appendChild(document.createTextNode(key))
                    cell.className = 'nowrap'
                } else if(k.includes('CatalogueNumber')) {
                    cell.appendChild(document.createTextNode(''));
                    cell.innerHTML = k[1] 
                }
            ++i
        })
    i=0    
    }
    // send tabellen til frontend
    document.getElementById('container').appendChild(table);
}



//************************************* */





// When sombody selct a museum -> update the collections available
document.getElementById('museum-select').addEventListener('change',function(){
    const valgtMuseum = document.getElementById('museum-select').value
    if(valgtMuseum === 'other-museum') {
        // tøm list
        select.options.length = 0
        // put other i lista
        select.options[0] = new Option('other', 0)
        document.getElementById('collection-key').value = ''
        document.getElementById("collection-key").disabled = false;
        document.getElementById("collection-key").focus();
    } else {
        // tøm list bortsett fra første linje
        select.options.length = 1
        let language
        language = sessionStorage.getItem('language')
        if (language === "English") {
            index = 1
        } else {
            index = 0
        }
        // første linje
        //select.options[select.options.length - 1] = new Option(textItems.selectCollection[index] , 0);
        select.options[0].disabled = true
        let i=1
        for (const [index] of Object.entries(GBifIdentifiers[valgtMuseum])) {
            select.options[select.options.length] = new Option([index], i);
            i += 1
        }
        // oppdater UUID til å matche collection
        updateCollectionUUID(true)
        // opdater hjelpe tabell
        const helpobject  = GBifIdentifiers[valgtMuseum]
        catalougeHelpTable(helpobject)
    }
})

// when somebody clicks submit-button
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    document.getElementById("DOI-result").textContent = ''
    document.getElementById("Download-link").textContent = ''
    
    language = sessionStorage.getItem('language')
    if (language === "English") {
        langIndex = 1
    } else {
        langIndex = 0
    }
    
    if (confirm( textItems.areYouSure[langIndex] + "\n\n Museum: " + document.getElementById('museum-select').value + '\n\n' + textItems.collection[langIndex] + document.getElementById('collection-select').options[document.getElementById('collection-select').selectedIndex].text + '\n\n' + textItems.catNumbers[langIndex] + '\n' + document.getElementById('museums-Numbers').value)) {
        // Show please wait
        document.getElementById("please-wait").style.display = "block"
        museumNumbers = getInput() 
        const request =  putRequestTogether(museumNumbers)
        console.log(request);
        sendRequest(request)
      } else {
       return
      }
})  



const updateCollectionUUID = (firstTime) => {
    const valgtSamling = document.getElementById('collection-select').options[document.getElementById('collection-select').selectedIndex].text
    const valgtMuseum = document.getElementById('museum-select').value
    let gbifLink = 'https://www.gbif.org/occurrence/search?dataset_key='
    console.log(valgtSamling)
    try {
        if (valgtSamling === 'other') {
            document.getElementById('collection-key').value = ''
            document.getElementById("collection-key").disabled = false;
            document.getElementById("collection-key").focus();
        } else {
            document.getElementById('collection-key').value = GBifIdentifiers[valgtMuseum][valgtSamling].key;
            document.getElementById("collection-key").disabled = true;
            document.getElementById('museums-Numbers').value = GBifIdentifiers[valgtMuseum][valgtSamling].CatalogueNumber;
            gbifLink = gbifLink + GBifIdentifiers[valgtMuseum][valgtSamling].key
            document.getElementById('gbif-Link').setAttribute('href', gbifLink)
        }
    } catch (error) {
        language = sessionStorage.getItem('language')
        if (language === "English") {
            index = 1
        } else {
            index = 0
        }
        if(firstTime == false) {
        alert(textItems.noUUID[index])
        }
    }
}

// when somebody chooses a collection dropdown
document.getElementById('collection-select').addEventListener('change',function(){
    updateCollectionUUID(false)
});