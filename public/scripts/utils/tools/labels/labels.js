
// urlPath er definert i textItems.js

const form = document.getElementById('label-names');
const select = document.getElementById("collection-select");
const nameSelect = document.getElementById("scientific-names");

const selector =   new Selectr('#scientific-names', {
    multiple: true,
    searchable: true,
    width: 300
    })

function getMuseumPath() {
    let museumURLPath = ''
    if (window.location.href.includes('/um')) { 
        museumURLPath = urlPath + "/um"
    } else if (window.location.href.includes('tmu')) {
        museumURLPath = urlPath + "/tmu"
    } else if (window.location.href.includes('nbh')) {
        museumURLPath = urlPath + "/nbh"
    } else {
        museumURLPath = urlPath + "/nhm"
    }
    return museumURLPath
}


const getUserInput = async () => {
    const el = document.getElementById('collection-select');
    const valgtSamling = el.options[el.selectedIndex].text
    const valgtMuseum = document.getElementById('museum-select').value;

    // Get scientificNames using selector.getValue() or set it to an empty array if selector is undefined
    const scientificNames = selector?.getValue() || [];
    
    const urlPath = getMuseumPath();
    const url = `${urlPath}/labels`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ museum: valgtMuseum, collection: valgtSamling, search:scientificNames  })
        });

        if (!response.ok) {
            const responseData = await response.json();
            console.log('Fail:', response);
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error(error);
        alert(`Oops! Something went wrong.\nServer says: ${error.message}`);
    }
};

const getCollections = async (museum) => {
    const url = urlPath + '/collections?museum=' + museum 
    const response = await fetch(url);
    const collections = await response.json();
    return collections;
}

const getValidNames = async (museum, collection) => {
    const url = urlPath + '/labels?museum=' + museum + '&collection=' + collection
    console.log(url);
    const response = await fetch(url);
    const validNames = await response.json()
    const validNamesArray = JSON.parse(validNames.results);
    return validNamesArray;
}


// When somebody selct a museum -> update the collections available
document.getElementById('museum-select').addEventListener('change',async function(){
    const valgtMuseum = document.getElementById('museum-select').value

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
        select.options[0].disabled = true
        // add collections
        getCollections(valgtMuseum).then(collections => {
            for (let i = 0; i < collections.length; i++) {

                const element = collections[i];
                select.options[select.options.length] = new Option([element], i);   
            }
        })
})


// When somebody selct a collection -> get list of valid names
document.getElementById('collection-select').addEventListener('change',async function(){
    const valgtSamling = document.getElementById('collection-select').value
    const valgtMuseum = document.getElementById('museum-select').value
    getValidNames(valgtMuseum, valgtSamling)
    .then(validNames => {
            for (let i = 0; i < validNames.length; i++) {
                const element = validNames[i];
                selector.add({
                    value: element,
                    text: element
                });
            }
            document.getElementById('dropdown-container').style.display = "block"
        })  
})

// send information to server
form.addEventListener('submit', (event) => {
    event.preventDefault();
    selector.getValue(true, true);
    getUserInput()
});