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

const getLanguage = () => {
    language = sessionStorage.getItem('language')
    if (language === "English") {
        index = 1
    } else {
        index = 0
    }
    return index
}

const getMuseum = () => {
    const path = window.location.pathname
    const  museum = path.split('/')
    return museum[2]
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


const updateCollectionUUID = (firstTime) => {
    const valgtSamling = document.getElementById('collection-select').options[document.getElementById('collection-select').selectedIndex].text
    const valgtMuseum = getMuseum()
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
        const langIndex = getLanguage()
    }
}

// different colection for differnet museum, see /museum/scripts/utils/tools/getDOI/dataObject.js
const updateCollectionList = () => {
    const museum = getMuseum()
            // tøm list bortsett fra første linje
            select.options.length = 1
            const langIndex = getLanguage()

            select.options[0].disabled = true
            let i=1
            for (const [index] of Object.entries(GBifIdentifiers[museum])) {
                select.options[select.options.length] = new Option([index], i);
                i += 1
            }
            // oppdater UUID til å matche collection
            updateCollectionUUID(true)
}



// when somebody clicks submit-button
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    main()
})  


// when somebody chooses a collection dropdown
document.getElementById('collection-select').addEventListener('change',function(){
    updateCollectionUUID(false)
});

const main = async () => {
    
    // Show please wait
    document.getElementById("please-wait").style.display = "block"
    museumNumbers = getInput() 
    console.log(museumNumbers);
    const request =  putRequestTogether(museumNumbers)
    sendRequest(request)
    document.getElementById("please-wait").style.display = "none"
}


updateCollectionList()
