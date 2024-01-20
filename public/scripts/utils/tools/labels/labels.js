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
        const newElement = element.split('|')[0];
        boxSelector.add({
            value: newElement,
            text: newElement
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

// Function to toggle the display of the "Please Wait" image based on the input variable, true or false
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
            // loop tabel and get the names
            scientificNames = getInformationFromTable();
            // delete the choosen names
            clearTable('box-list');
        } else  if(labelType === 'unit') {
            scientificNames = selector?.getValue() || [];
            selector.clear();
        } else  if(labelType === 'numbers') {
          scientificNames = getNumberInput()

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

const getNumberInput = () => {
  const museumsNumbers = document.getElementById('input-numbers').value
  const numberArray = museumsNumbers.split("\n")
  const expandedArray = [];

  numberArray.forEach(element => {
    if (element.includes("..")) {
      const [start, end] = element.split("..").map(Number);
      for (let i = start; i <= end; i++) {
        expandedArray.push(i.toString());
      }
    } else {
      expandedArray.push(element);
    }
  });
 
return expandedArray
}




const getCollections = async (museum) => {
    const url = urlPath + '/collections?museum=' + museum 
    const response = await fetch(url);
    const collections = await response.json();
    return collections;
}


const getValidNames = async (museum, collection, labelType) => {
    
    try {
      const url = urlPath + '/labels?museum=' + museum + '&collection=' + collection + '&labelType=' + labelType
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
        const labelType = true
        const validNames = await getValidNames(valgtMuseum, valgtSamling, labelType);


        for (let i = 0; i < validNames.length; i++) {
            const element = validNames[i];
            const newElement = element.replace(/\|/g, ' ')
            selector.add({
                value: newElement,
                text: newElement
            });
        }

        addBoxNames(validNames) 

        document.getElementById('dropdown-container').style.display = "block";
        document.getElementById('box-div').style.display = "block";
        document.getElementById('number-page').style.display = "block";
        // document.getElementById('dropdown-box-container').style.display = "block";        
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

function populateBoxTable(names) {
    const nameInput = document.getElementById('box-name-input');
    const numberInput = document.getElementById('box-number-input');
    const table = document.getElementById('box-list');
  
    // for å unngå en tom rad på toppen av tabellen
    if (!tableExists) {
      tableExists = true;
      // Remove any existing rows from the table
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
    }
  
    // Remove the first value from the names array, selectr modulen leggger til en tom verdi
    names.shift();
  
    // Add new rows to the table
    const rowId = "row-" + table.rows.length; // Generate a unique rowId
    const row = table.insertRow(-1);
    row.id = rowId; // Assign the rowId to the row element
  
    // Add label number column to the left
    const labelNumCell = row.insertCell(0);
    labelNumCell.id = "box-label-number";
    labelNumCell.textContent = table.rows.length;
  
    const nameCell = row.insertCell(1);
    nameCell.innerHTML = names.join(" | ");
    const deleteCell = row.insertCell(2);
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('descrete-button');
    deleteButton.textContent = 'x';
    deleteButton.setAttribute("data-row-id", rowId); // Assign the rowId as the data-row-id attribute
    deleteCell.appendChild(deleteButton);
  
    // Show makeLabels button and table
    const boxListForm = document.getElementById("box-list-form");
    const boxNameSubmitButton = document.getElementById("box-name-submit");
    boxNameSubmitButton.style.display = "block";
    boxListForm.style.display = "inline-block"
  
    const deleteButtons = document.getElementsByClassName("descrete-button");
    for (let i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener("click", deleteRow);
    }
    deleteButton.addEventListener('click', () => deleteRow(rowId));
  }
  
  function deleteRow(event) { 
    const rowId = event.target.getAttribute('data-row-id');
    const row = document.getElementById(rowId);
  
    if (row) {
      const table = row.parentNode;
      const rowIndex = row.rowIndex;
  
      // Delete the row
      table.deleteRow(rowIndex);
  
      // Update the label numbers and data-row-id attributes
      for (let i = rowIndex; i < table.rows.length; i++) {
        const row = table.rows[i];
        const labelNumCell = row.cells[0];
        const deleteButton = row.cells[2].querySelector('.descrete-button');
  
        // Update label number
        labelNumCell.textContent = i + 1;
        // Update data-row-id attribute
        row.id = 'row-' + (i + 1);
        deleteButton.setAttribute('data-row-id', 'row-' + (i + 1));
      }
    }
  }
  

function getInformationFromTable() {
    const table = document.getElementById("box-list");
    const rows = table.getElementsByTagName("tr");
    
    const rowData = [];
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      const column2Value = cells[1].innerHTML;
      const names = column2Value.includes('|') ? column2Value.split('|').map(value => value.trim()) : [column2Value.trim()];
      const number = cells[2].innerHTML;
      
      rowData.push({ names, number });
    }
    
    return rowData;
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
    let userInputType;
    
    if (submitButtonId === 'box-name-list') {
        userInputType = 'box';
    
        const boxNames = boxSelector?.getValue() || [];
        populateBoxTable(boxNames)  
        boxSelector.clear(); // denne kan sikkert også brukes

    } else if (submitButtonId === 'box-name-submit') {
        userInputType = 'box'; 
        getUserInput(userInputType);
    } else if (submitButtonId === 'label-name-submit') {
      userInputType = 'unit';
      getUserInput(userInputType);
    } else if (submitButtonId === 'numbers-submit') {
      userInputType = 'numbers';
      getUserInput(userInputType);
    }
    // to make sure that the headers fit contence
    updateTableStyling('box-list');
  });
  