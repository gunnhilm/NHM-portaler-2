const form = document.getElementById('loan-form');
const urlPath = '/museum'


form.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    // Display the key/value pairs
    for (const pair of form.entries()) {
        console.log(`${pair[0]}, ${pair[1]}`);
    }
    const stringForm = JSON.stringify(Object.fromEntries(form))
    console.log(stringForm);
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
        return res.json();                               
    })
    .then((result) => {
        console.log('Success:', result);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

});

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


// resultattabell

// creates the headers in the table
// in: table (html-table, to show on the page)
// in: keys (array?, source of header titles)
// is called in journalResultTable(..)
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
const journalResultTable = (children) => {
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
    document.getElementById('container').appendChild(table);
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

    let items = sessionStorage.getItem("loanItems")
    if (items) {
    items = JSON.parse(items)
        journalResultTable(items)
    }
}

showTable()