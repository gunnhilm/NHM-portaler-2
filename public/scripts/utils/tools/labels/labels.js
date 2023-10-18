
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

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                // // Generate a download link and trigger the download
                const fileName = data.fileName
                const origin = 'labels'
                const downloadLink = document.createElement('a');
                downloadLink.href = urlPath + '/download/?origin=' + origin + '&fileName=' + fileName;
                downloadLink.download = fileName;
                downloadLink.click();
            } else {
                console.error('Error:', data.error);
            }
        } else {
            console.error('Request failed with status:', response.status);
        }

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


// const getValidNames = async (museum, collection) => {
//     try {
//       const url = urlPath + '/labels?museum=' + museum + '&collection=' + collection
//       const response = await fetch(url);
//       if (response) {
//       const validNames = await response.json();
//       const validNamesArray = JSON.parse(validNames.results);
//       return validNamesArray;
//     } else {
//         return false
//     }
//     } catch (error) {
//       throw error;
//     }
//   }

const getValidNames = async (museum, collection) => {
    try {
      const url = urlPath + '/labels?museum=' + museum + '&collection=' + collection
      const response = await fetch(url);
      if (response.ok) {
        const validNames = await response.json();
        const validNamesArray = JSON.parse(validNames.results);
        return validNamesArray;
      } else {
        throw new Error('Server responded with status ' + response.status);
      }
    } catch (error) {
      throw error;
    }
  }
  


// When somebody selects a collection -> get list of valid names
document.getElementById('collection-select').addEventListener('change', async function () {
    try {
        const valgtSamling = document.getElementById('collection-select').value;
        const valgtMuseum = document.getElementById('museum-select').value;

        const validNames = await getValidNames(valgtMuseum, valgtSamling);


        for (let i = 0; i < validNames.length; i++) {
            const element = validNames[i];
            selector.add({
                value: element,
                text: element
            });
        }

        document.getElementById('dropdown-container').style.display = "block";
        document.getElementById('sorry').style.display = "none";
        
    } catch (error) {
        document.getElementById('dropdown-container').style.display = "none";
        document.getElementById('sorry').innerText = "Beklager, det er ingen etiketter tilgjengelig for denne samlingen. Sorry, no labels available for this collection.";
        document.getElementById('sorry').style.display = "block";
  
    }
});


// Function for creating and populating dropdown
async function createDropdown() {
    const museumSelect = document.getElementById('museum-select');
    const collectionSelect = document.getElementById('collection-select');
  
    museumSelect.addEventListener('change', async () => {
      const valgtMuseum = museumSelect.value;
      const collections = await getCollections(valgtMuseum);
  
      // Clear existing options in collection select and add first option
      collectionSelect.innerHTML = '<option value="">Velg samling</option>';
  
      // Add collection options to the collection select
      for (let i = 0; i < collections.length; i++) {
        const element = collections[i];
        const option = new Option(element, i);
          
        // Set the option id equal to its value
        const optionId = element.toLowerCase().replace(/\s/g, '-');
        option.id = optionId;
        
        collectionSelect.options[collectionSelect.options.length] = option;
  
        // Set the option value equal to its id
        option.value = optionId;
      }
    });
  
    // // Trigger change event for museum select to update collections
    const changeEvent = new Event('change');
    museumSelect.dispatchEvent(changeEvent);
  
    // Set id and value for collection select options
    const options = collectionSelect.querySelectorAll('option');
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const optionId = option.value; // Get the option id
      option.id = optionId.toLowerCase().replace(/\s/g, '-'); // Set the option id and transform to lowercase and replace spaces with hyphens
      option.value = optionId; // Set the option value to the same as the id
    }
  }
  

  // Function for updating default value of dropdown
  function updateDefaultValue(selector, value) {
   // Set default collection value and find index
    selector.value = value.toLowerCase();
  }
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  


window.addEventListener('DOMContentLoaded', async function() {
    const museumSelect = document.getElementById('museum-select');
    updateDefaultValue(museumSelect,'NHM');
    await createDropdown();
    await delay(1000)
    document.getElementById('collection-select').value = 'sopp';
    document.getElementById('collection-select').dispatchEvent(new Event('change'));
});
  


// send information to server
form.addEventListener('submit', (event) => {
    event.preventDefault();
    selector.getValue(true, true);
    getUserInput()
});