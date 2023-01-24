const form = document.getElementById('loan-form');

const updateCountryList = () => {
    const countrySelect = document.getElementById("country");
    const options = [];
    const option = document.createElement('option');
    for (let i = 0; i < countryList.length; i++) {
        const element = countryList[i];
        option.text = option.value = element;
        options.push(option.outerHTML);
    }
    countrySelect.insertAdjacentHTML('beforeEnd', options.join('\n'));
}

updateCountryList()

const getLoanItems = (storagKey) => {
    let items = sessionStorage.getItem(storagKey)
    if (items) {
        items = JSON.parse(items)
        return items
    } else {
        return false
    }
}

const getDataAndSendIt = () => {
    const loanInfo = {}
    loanInfo.lenderInfo = {}
    // get list of objects for loan
    let items = getLoanItems("loanItems")
    const formData = new FormData(form);

    // Display the key/value pairs
    for (const pair of formData.entries()) {
        loanInfo.lenderInfo[pair[0]] = pair[1]
    }
    loanInfo.items = []
    
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        loanInfo.items[i] = element
        
    }
    const stringForm = JSON.stringify(loanInfo)
    console.log(loanInfo);
    const url = '/museum/post-loan/' 
    fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: stringForm,
      })
    .then(res => {
        if (!res.ok) {                                   
            throw new Error("HTTP error " + res.status); 
        }                                                
        console.log('Success:', res);     
        // alert('Epost sendt')                         
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// send information to server
form.addEventListener('submit', (event) => {
    event.preventDefault();
    getDataAndSendIt()
});




// resultattabell

// fuctonallity for remove button
const addClickFunc = (buttonId)  => {
    const removeButton = document.getElementById(buttonId)
    removeButton.addEventListener('click', (e) => {
        e.preventDefault()
            console.log('her skal vi slette');
            let items = sessionStorage.getItem("loanItems")
            if (items) {
            items = JSON.parse(items)
            items.splice(document.getElementById(buttonId).value,1)
                
            }
            if (items.length > 0) {
                items = JSON.stringify(items)
                sessionStorage.setItem('loanItems', items)
            } else {
                sessionStorage.removeItem('loanItems')
            }
            // rerender table
            showTable()

    })
}

// creates the headers in the table
// in: table (html-table, to show on the page)
// in: keys (array?, source of header titles)
// is called in loanResultTable(..)
function addHeaders(table, headerItems) {
      const tr = document.createElement('tr'); // Header row
        for( let i = 0; i < headerItems.length; i++ ) {
            const th = document.createElement('th'); //column
            th.classList.add("order")
            const text = document.createTextNode(headerItems[i]); //cell
            th.appendChild(text);
            tr.appendChild(th);
            table.appendChild(tr);
        }
}
    
// creates table for the journals and fills it
// in: children (array, containing content to table, i.e. data on journals) 
// calls addHeaders(..)
// is called in dojournalSearch(..)
const loanResultTable = (children) => {
    const table = document.createElement('table');
    table.setAttribute('id', 'loans-item-table')
    table.setAttribute('class', 'result-table')

    const headerItems = ['catalogNumber', 'scientificName', 'recordedBy', 'country', 'county', 'locality']
    addHeaders(table, headerItems);

    for( let i = 0; i < children.length; ++i ) {
        let child = children[i];
        const row = table.insertRow(); 
        const rowID = 'loanRow' + i
        row.id = rowID        
        for (let i = 0; i < headerItems.length; i++) {
            
            const cell = row.insertCell() 
            const element = headerItems[i];
            for (const [k, v] of Object.entries(child)) { 
                if (k === element) {
                    cell.appendChild(document.createTextNode(''));
                    cell.innerHTML = v 
                } 
            }
        }
        const removeID = 'remove' + i
        const removeButton = row.insertCell().appendChild(document.createElement("button"));
        const newContent = document.createTextNode("Remove Item");
        removeButton.appendChild(newContent);
        removeButton.setAttribute("id", removeID);
        removeButton.setAttribute("value", i);
        
    }
    // send tabellen til frontend
    document.getElementById('table-container').appendChild(table);
    // add functionallity to removebutton
    for( let i = 0; i < children.length; ++i ) {
        const removeID = 'remove' + i
        addClickFunc(removeID)
    }
}

const showTable = () => {
    var tbl = document.getElementById('loans-item-table');
    if( tbl) {
        tbl.parentNode.removeChild(tbl)
    }

    let items = getLoanItems("loanItems")
    if (items) {
    loanResultTable(items)
    } else  {
        alert(' there has been some error, please return to the searchpage and try again')
    }
}

showTable()