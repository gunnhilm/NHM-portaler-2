const searchForm = document.querySelector('form') 
const loanInfoSearch = document.getElementById('loan-search-text')
const hitsElement = document.getElementById('head-nb-hits')
const nbHitsElement = document.getElementById('nb-hits') 
const maxHitsElement = document.getElementById('max-hits')

// display please-wait-icon
// is called in doLoanInfoSearch
const pleaseWaitOn = () => {
    document.getElementById("please-wait").style.display = "block"
}

// removes please-wait-icon
// is called in doLoanInfoSearch()
const pleaseWaitOff = () => {
    document.getElementById("please-wait").style.display = "none"
}

// figures out which museum we are in
// out: string, abbreviation for museum
// is called in doLoanInfoSearch()
const getCurrentMuseum = () => {
    let museum = window.location.pathname
    museum = museum.split('/')
    return museum[2]
}

// removes table and search-result-elements from page
// is called in doLoanInfoSearch()
function removeResults() {
    try {
        hitsElement.innerText = ""
        nbHitsElement.innerText = ""
        maxHitsElement.innerText = ""
        const Table = document.getElementById("loan-result-table");
        if(Table) {
            console.log('fjerner tabell');
            Table.innerHTML = "";
        }
    } catch (error) {
        console.log(error);
    }
}

// creates the headers in the table
// in: table (html-table, to show on the page)
// in: keys (array?, source of header titles)
// is called in loanResultTable()
function addHeaders(table, keys, columnsToShow) {
    const tr = document.createElement('tr'); // Header row
    for( let i = 0; i < columnsToShow; i++ ) {
        const th = document.createElement('th'); //column
        th.classList.add("order")
        const text = document.createTextNode(keys[i]); //cell
        th.appendChild(text);
        tr.appendChild(th);
        table.appendChild(tr);
    }
}
    

// creates table for the loans and fills it
// in: children (array, containing content to table, i.e. data on loans) 
// calls addHeaders()
// is called in doLoanInfoSearch()
const loanResultTable2 = (children, columnsToShow) => {
    const table = document.createElement('table');
    table.setAttribute('id', 'loan-result-table')
    table.setAttribute('class', 'result-table')
    for( let i = 0; i < children.length; ++i ) {
        let child = children[i];
        if(i === 0 ) {
            addHeaders(table, Object.keys(child), columnsToShow);
        }
        const row = table.insertRow();
        
        Object.keys(child).forEach(function(k ,index) {
            
            if (index < columnsToShow) {
                const cell = row.insertCell() 
                cell.appendChild(document.createTextNode(child[k]));
            }
        })
    }
    // send tabellen til frontend
    document.getElementById('container').appendChild(table);
}

// sort table
// ikke i bruk mai 2024
function sortTable() {
    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

    const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
        v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
        )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    // do the work...
    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr) );
    })));
}

// sends request to server to search in the loan-dump
// is called in search-form eventlistener
// out: rendering of search-result
const doLoanInfoSearch = () => {
    removeResults()
    const elem = document.getElementById('loan-result-table');
    if (elem) {
        document.getElementById('container').removeChild(elem);
    }
    pleaseWaitOn()
    const searchTerm = loanInfoSearch.value
    if (!searchTerm) {
        alert ('Skriv inn søkeord / Search field empty')  
    } else {
        museum = getCurrentMuseum()
        const url = urlPath + '/getLoanInfoJSON/?museum=' + museum + '&search=' + searchTerm
        fetch(url).then((response) => {
            pleaseWaitOff()
            if (!response.ok) {
                throw 'noe går galt med søk, respons ikke ok'
            } else {
                try {
                    response.text().then((data) => {
                        if(data.error) {
                            errorMessage.innerHTML = textItems.serverError[index]
                            console.log(error);
                            return console.log(data.error)
                        } else if (data === "[]") {
                            hitsElement.innerText = textItems.noHitsLoan[index]
                        } else {
                            JSONresultArray = JSON.parse(data)
                            JSONobjArray = []
                            JSONresultArray.forEach((el) => {
                                newEl = JSON.parse(el)
                                JSONobjArray.push(newEl)
                            })
                            loanResultTable2(JSONobjArray, Object.keys(JSONobjArray[0]).length)
                            
                            hitsElement.innerText = textItems.nbHitsTextRecords[index] + JSONobjArray.length
                            if(JSONobjArray.length === 1000) {
                                maxHitsElement.innerText = textItems.tooManyHits[index] 
                            }
                        }
                    })
                } catch (error) {
                    console.log('Feil med søk');
                }
            }
        })
    }
}



// when somebody clicks search-button
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    doLoanInfoSearch()
}) 