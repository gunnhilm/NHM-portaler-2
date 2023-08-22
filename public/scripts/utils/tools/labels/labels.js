
// urlPath er definert i textItems.js

console.log('labels');
// for the download button 
const form = document.getElementById('label-names');
const select = document.getElementById("collection-select");


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

const getUserInput = () => {
    const scientificNames = document.getElementById("scientific-names");
    console.log(scientificNames.value);
    const urlPath = getMuseumPath()
    const url = urlPath + '/labels/?search=' + scientificNames.value 
    fetch(url)
    .then(response => {
        if (!response.ok) {        
            console.log('fail',  response);                      
            return Promise.reject(response);
        }                                                
        console.log('Success:', response);
        return response.json();                              
    })
    .catch((response) => {
        // 3. get error messages, if any
        response.json().then((data) => {
          console.log(data.unparsed);
          alert('Ai Ai her gikk det feil, serveren sier: '+ response.status + ' ' + response.statusText + ' ' + data.unparsed)
        })
    })
}

const getCollections = async (museum) => {
    const url = urlPath + '/collections?museum=' + museum 
    const response = await fetch(url);
    const collections = await response.json();
    return collections;
}


// When sombody selct a museum -> update the collections available
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


// send information to server
form.addEventListener('submit', (event) => {
    event.preventDefault();
    getUserInput()
});