// urlPath er definert i textItems.js
const forms = document.getElementById('labels');
// const form = document.getElementById('label-names');
const select = document.getElementById("collection-select");
const nameSelect = document.getElementById("scientific-names");
let tableExists = false


const selector =   new Selectr('#scientific-names', {
    multiple: true,
    searchable: true,
    width: 300
})

const boxSelector =   new Selectr('#scientific-box-names', {
    multiple: true,
    searchable: true,
    width: 300
})


function addBoxNames(validNames) {
    for (let i = 0; i < validNames.length; i++) {
        const element = validNames[i];
        boxSelector.add({
            value: element,
            text: element
        });
    }
}

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

// Function to toggle the display of the "Please Wait" image based on the input variable
function togglePleaseWait(showImage) {
    const pleaseWaitImage = document.getElementById("please-wait");
    pleaseWaitImage.style.display = showImage ? "inline" : "none";
  }
  
// make label doc file on server
const getUserInput = async (labelType, extraInfo = 'false') => {
    const el = document.getElementById('collection-select');
    const valgtSamling = el.options[el.selectedIndex].text
    const valgtMuseum = document.getElementById('museum-select').value;
    let scientificNames  = ''
    // Get scientificNames using selector.getValue() or set it to an empty array if selector is undefined
        if(labelType === 'box') {
            scientificNames = boxSelector?.getValue() || [];
            // delete the choosen names
            clearTable('box-list');
        } else  if(labelType === 'unit') {
            scientificNames = selector?.getValue() || [];
        }

    
    const urlPath = getMuseumPath();
    const url = `${urlPath}/labels`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ museum: valgtMuseum, collection: valgtSamling, search:scientificNames, labelType:labelType, extraInfo:extraInfo  })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                console.log(data);
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

        addBoxNames(validNames) 

        document.getElementById('dropdown-container').style.display = "block";
        const dropdownBoxContainer = document.getElementById('dropdown-box-container');
        dropdownBoxContainer.style.display = "block ";
        dropdownBoxContainer.style.backgroundColor = 'rgba(144, 238, 144, 0.1)';
        document.getElementById('sorry').style.display = "none";
        
    } catch (error) {
        document.getElementById('dropdown-container').style.display = "none";
        document.getElementById('sorry').innerText = "Beklager, det er ingen etiketter tilgjengelig for denne samlingen. Sorry, no labels available for this collection.";
        document.getElementById('sorry').style.display = "block";
  
    }
});


// Function for creating and populating collection dropdown
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
  
// when the window is loaded, select sopp
window.addEventListener('DOMContentLoaded', async function() {
    const museumSelect = document.getElementById('museum-select');
    updateDefaultValue(museumSelect,'NHM');
    await createDropdown();
    await delay(1000)
    document.getElementById('collection-select').value = 'sopp';
    document.getElementById('collection-select').dispatchEvent(new Event('change'));
    togglePleaseWait(false)
});

function clearTable(tableId) {
    const table = document.getElementById(tableId);
    // Clear existing rows from the table
    while (table.rows.length > 1) {
    table.deleteRow(-1);
    }
}


// function populateBoxTable(names, includeBoxNumbers) {
//     const nameInput = document.getElementById('box-name-input');
//     const numberInput = document.getElementById('box-number-input');
//     const table = document.getElementById('box-list');

//     // for å unngå en tom rad på toppen av tabellen
//     if (!tableExists) {
//         tableExists = true;
//         // Remove any existing rows from the table
//         while (table.rows.length > 0) {
//             table.deleteRow(0);
//         }
//     }

//     // Remove the first value from the names array, selectr modulen leggger til en tom verdi
//     names.shift();
    
//     // Add new rows to the table
//     const rowId = "row-" + (table.rows.length + 1); // Generate a unique rowId
//     const row = table.insertRow(-1);
//     row.id = rowId; // Assign the rowId to the row element
//     const nameCell = row.insertCell(0);
//     const numberCell = row.insertCell(1);
//     const deleteCell = row.insertCell(2);
//     nameCell.colSpan = 2;
//     nameCell.innerHTML = names.join(", ");
//     numberCell.innerHTML = includeBoxNumbers ? 'ja' : 'nei';
//     deleteCell.innerHTML = '<button type="button" class="descrete-button" data-row-id="' + rowId + '">Slett</button>';

//     // Show makeLabels button and table
//     const boxNameSubmitButton = document.getElementById("box-name-submit");
//     const boxListTable = document.getElementById("box-list");
//     boxNameSubmitButton.style.display = "block";
//     boxListTable.style.display = "table";

//     const deleteButtons = document.getElementsByClassName("descrete-button");
//     for (let i = 0; i < deleteButtons.length; i++) {
//         deleteButtons[i].addEventListener("click", deleteRow);
//     }
// }

function populateBoxTable(names, includeBoxNumbers) {
    const nameInput = document.getElementById('box-name-input');
    const numberInput = document.getElementById('box-number-input');
    const table = document.getElementById('box-list');

    // for å unngå en tom rad på toppen av tabellen
    if (!tableExists) {
        tableExists = true;
        // Remove any existing rows from the table
        while (table.rows.length > 0) {
            table.deleteRow(0);
        }
    }

    // Remove the first value from the names array, selectr modulen leggger til en tom verdi
    names.shift();
    
    // Add new rows to the table
    const rowId = "row-" + (table.rows.length + 1); // Generate a unique rowId
    const row = table.insertRow(-1);
    row.id = rowId; // Assign the rowId to the row element

    // Add label number column to the left
    const labelNumCell = row.insertCell(0);
    labelNumCell.id = "box-label-number";
    labelNumCell.textContent = "Ektikett no.: " + table.rows.length;

    const nameCell = row.insertCell(1);
    const numberCell = row.insertCell(2);
    const deleteCell = row.insertCell(3);
    nameCell.colSpan = 2;
    nameCell.innerHTML = names.join(", ");
    numberCell.innerHTML = includeBoxNumbers ? 'ja' : 'nei';
    deleteCell.innerHTML = '<button type="button" class="descrete-button" data-row-id="' + rowId + '">Slett</button>';

    // Show makeLabels button and table
    const boxNameSubmitButton = document.getElementById("box-name-submit");
    const boxListTable = document.getElementById("box-list");
    boxNameSubmitButton.style.display = "block";
    boxListTable.style.display = "table";

    const deleteButtons = document.getElementsByClassName("descrete-button");
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", deleteRow);
    }
}


function deleteRow(event) {
    const rowId = event.target.dataset.rowId;
    const row = document.getElementById(rowId);
    if (row) {
        const table = row.parentNode;
        if (table.rows.length > 1) {
            row.parentNode.removeChild(row);
        }
    }
}

// to make sure that the headers fit contence
function updateTableStyling(tableId) {
    const table = document.getElementById(tableId);
    const thElements = table.querySelectorAll('th');
  
    // Update the width of table headers
    thElements.forEach((th) => {
      th.style.width = 'auto';
    });
  } 


// add names to box table
forms.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const submitButtonId = event.submitter.getAttribute('id');
    // alert('eventlistner sumbitt: ' + submitButtonId)
    console.log(submitButtonId);
    let userInputType;
    
    if (submitButtonId === 'box-name-list') {
        console.log('adding box labels...');
        userInputType = 'box';
    
        const boxNames = boxSelector?.getValue() || [];
    
        const includeBoxNumbers = document.getElementById('box-numbers').checked;
    
        if (boxNames.length > 3 && includeBoxNumbers) {
          alert('Du kan maks ha 2 navne på en etikett hvis du vil ha nummer i tillegg.');
          return;
        }
        populateBoxTable(boxNames, includeBoxNumbers)  
       // boxSelector.clear(); // denne kan sikkert også brukes
        boxSelector.reset()

    } else if (submitButtonId === 'box-name-submit') {
        userInputType = 'box'; 
        getUserInput(userInputType);
    } else if (submitButtonId === 'label-name-submit') {
      console.log('Creating unit labels...');
      userInputType = 'unit';
      getUserInput(userInputType);
    }
    // to make sure that the headers fit contence
    updateTableStyling('box-list');

    
  });
  