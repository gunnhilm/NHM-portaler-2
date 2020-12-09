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
	delimitersToGuess: [ ' ',',', '\t', '|', ';']
}



const getInput = () => {
    let museumsNumbers = document.getElementById('museums-Numbers').value
    // replace all lineshifts with comma
    let arrayOfNumbers = Papa.parse(museumsNumbers, papaParseConfig)

    arrayOfNumbers = Papa.parse(museumsNumbers, papaParseConfig)

    let flatNumbers = arrayOfNumbers.data.flat()
    arrayOfNumbers.length = 0
    console.log(flatNumbers);
    // Remove prefix from numbers
    // flatNumbers = flatNumbers.map(function (el) {
    //     return el.replace(/\D/g,'');
    // });
    console.log(flatNumbers);
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
        "notification_address": [epost],
        "send_notification": "true",
        "created": '2020',
        "predicate": nested_predicate,
    }
return data
}

const getDOI = (downloadKey) => {
    console.log('start på andre nedlstning');
    const metaDataUrl = 'http://api.gbif.org/v1/occurrence/download/' + downloadKey
    fetch(metaDataUrl)
    .then(response => response.json())
    .then(function(result) { 
        console.log(result.doi)
        console.log(result.downloadLink);
        document.getElementById("please-wait").style.display = "none"
        document.getElementById("DOI-result").textContent = 'DOIlink:  https://doi.org/' + result.doi
        document.getElementById("Download-link").textContent = 'Download link: ' + result.downloadLink
        alert(result.doi + '\n' + result.downloadLink)
    });
};

async function sendRequest(request) {
    const brukerNavn = document.getElementById('username').value
    const password = document.getElementById('current-password').value
    const url = 'http://api.gbif.org/v1/occurrence/download/request'
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
            if(xhr.status === 401){
                alert('Feil bruker navn eller passord')
            } else {
            alert('Noe gikk galt. GBif serveren svarte: \n\n' + xhr.status + ': ' + xhr.statusText)   
            }
        document.getElementById("please-wait").style.display = "none"
        return
        }
    };
}

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
        // tøm list
        select.options.length = 0
        // første linje
        let language
        language = sessionStorage.getItem('language')
        if (language === "English") {
            index = 1
        } else {
            index = 0
        }
        select.options[select.options.length] = new Option(textItems.selectCollection[index] , 0);
        select.options[0].disabled = true
        let i=1
        for (const [index] of Object.entries(GBifIdentifiers[valgtMuseum])) {
            select.options[select.options.length] = new Option([index], i);
            i += 1
        }
    }
})

// when somebody clicks submit-button
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    document.getElementById("DOI-result").textContent = ''
    document.getElementById("Download-link").textContent = ''
    if (confirm("Er du sikker på at du vil opprette et datasett på disse dataene. Dette kan ta litt tid, være tolmodig. \n\n museum: " + document.getElementById('museum-select').value + '\n\n samling: ' + document.getElementById('collection-select').options[document.getElementById('collection-select').selectedIndex].text + '\n\n museumsnummer: \n' +document.getElementById('museums-Numbers').value)) {
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

// when somebody chooses a collection submit-button
document.getElementById('collection-select').addEventListener('change',function(){
    const valgtSamling = document.getElementById('collection-select').options[document.getElementById('collection-select').selectedIndex].text
    const valgtMuseum = document.getElementById('museum-select').value
    console.log(valgtSamling);
    try {
        if (valgtSamling === 'other') {
            document.getElementById('collection-key').value = ''
            document.getElementById("collection-key").disabled = false;
            document.getElementById("collection-key").focus();
        } else {
            document.getElementById('collection-key').value = GBifIdentifiers[valgtMuseum][valgtSamling].key;
            document.getElementById("collection-key").disabled = true;
            console.log(GBifIdentifiers[valgtMuseum][valgtSamling].key);
        }
    } catch (error) {
        alert('fant ikke uuiden til samlingen, velg "Other" på museum og skriv inn key manuelt')
            
    }
});