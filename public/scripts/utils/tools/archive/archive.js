console.log('archive front end');

// Renders content in archive.hbs

const archiveSearch = document.getElementById('archive-search-text')
const archiveSearchForm = document.getElementById('search-button') 
const errorMessage = document.getElementById('head-nb-hits')
const nbHitsElement = document.getElementById('nb-hits') 
const columnsToShow = 14
let archiveCollection = ''


// figures out which museum we are in
// out: string, abbreviation for museum
// is called by doSearch() and updateFooter()
const getCurrentMuseum = () => {
    let museum = window.location.pathname
    museum = museum.split('/')
    return museum[2]
}

// fetches fileList from backend. 
const getFileList = async () => {
    console.log('get list');
    const museum = getCurrentMuseum();
    const url_getFileList = `${urlPath}/getFileList/?museum=${museum}`;
    try {
      const response = await fetch(url_getFileList);
      if (!response.ok) {
        throw new Error('Error: response not ok');
      }
      const data = await response.text();
      const fileListData = JSON.parse(data);
      sessionStorage.setItem('fileList', data);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };



function addTextInButtons(a) {
    if (a == 'archive') {return textItems.archive[index]}
    else if (a == 'fieldNotes') {return textItems.fieldNotes[index]}
    else if (a == 'illustrations') {return textItems.illustrations[index]}
    else if (a == 'journals') {return textItems.journals[index]}
}

function removeResults() {
    try {
        const Table = document.getElementById("archive-result-table");
        Table.innerHTML = "";
        const hits = document.getElementById("nb-hits");
        hits.innerHTML = "";
    } catch (error) {
        // do nothing
    }

}
async function makeButtons() {
  const buttonArray = [];
  let archiveTypes = [];
  let archiveFiles = [];
  await getFileList();
  let fileList = JSON.parse(sessionStorage.getItem('fileList'));
  
  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].source === 'archive') {
      archiveTypes = fileList[i].archiveGroups;
      archiveFiles = fileList[i].archiveFiles;
    }
  }
  
  const archiveTypeContainer = document.getElementById("archive-type");
  
  archiveTypes.forEach(el => {
    const button = document.createElement("button");
    button.innerHTML = addTextInButtons(el);
    button.id = el;
    button.className = "white-button";
    archiveTypeContainer.appendChild(button);
    buttonArray.push(button);
  });
  
  buttonArray.forEach(el => {
    el.addEventListener('click', (e) => {
      removeResults();
      buttonArray.forEach(button => {
        button.className = "white-button";
      });
      
      for (const [key, value] of Object.entries(archiveFiles)) {  
        if (el.id === 'journals') { 
          archiveCollection = value;
          console.log(archiveCollection);
          el.className = "blue-button";
          errorMessage.innerText = ""; // remove error messages
          
          // Save the button ID to sessionStorage
          sessionStorage.setItem('buttonID', el.id);
          
          const museum = getCurrentMuseum();
          const url = `${urlPath}/${museum}/journaler`;
          window.open(url, '_self');
        } else if (el.id === key) { 
          archiveCollection = value;
          console.log(archiveCollection);
          el.className = "blue-button";
          errorMessage.innerText = ""; // remove error messages
          
          // Save the button ID to sessionStorage
          sessionStorage.setItem('buttonID', el.id);
          
          doarchiveSearch(2000);
        }
      }
      
      e.preventDefault();
    });
  });
}


// resultattabell

// creates the headers in the table
// in: table (html-table, to show on the page)
// in: keys (array?, source of header titles)

// is called in archiveResultTable(..)
const archiveHeaderNamesToShow = ['Regnr', 'Tekst på beholder', 'Indeks', 'Årstall/periode', 'Hvilket museum?', 'Person', 'PersonID (wikidata)', 'FotoID', 'Kommentarer']; // Define the headers to show
const illustrationHeaderNamesToShow = ['Regnr', 'Comment', 'Størrelse', 'Figurnavn', 'Artsnavn (Latin)', 'Artsnavn (norsk)', 'Illustratør', 'Kilde', 'Copyright', 'Lokasjon disk']


const addHeaders = (table, headerNamesToShow) => {
    const headerRow = document.createElement('tr');
    for(let i = 0; i < headerNamesToShow.length; i++) {
      const headerCell = document.createElement('th');
      headerCell.classList.add('order');
      const title = document.createTextNode(headerNamesToShow[i]);
      headerCell.appendChild(title);
      headerRow.appendChild(headerCell);
      table.appendChild(headerRow);
    }
  };
// creates table for the archives and fills it
// in: children (array, containing content to table, i.e. data on archives) 
// calls addHeaders(..)
// is called in doarchiveSearch(..)
const createArchiveTableAndFillIt = (data, archiveCollection) => {
    if (archiveCollection === 'archive') {
        headerNamesToShow = archiveHeaderNamesToShow
    } else {
        headerNamesToShow = illustrationHeaderNamesToShow
    }
    const table = document.createElement('table');
    table.setAttribute('id', 'archive-result-table');
    table.setAttribute('class', 'result-table');
    data.forEach((child, i) => {
      if (i === 0) {
        addHeaders(table, headerNamesToShow);
      }
      const museum = getCurrentMuseum()
      const url = `${urlPath}/${museum}/archive?pageID=`;
      const documentType = sessionStorage.getItem("buttonID")
      const row = table.insertRow();
      Object.entries(child).forEach(([key, value], index) => {
        if (headerNamesToShow.includes(key)) {
          const tableCell = row.insertCell();
          if (key.includes('FlipBook')) {
            value = `<a href="https://samlingsportal.nhm.uio.no/archive/nhm/${value}">FlipBook</a>`;
            tableCell.innerHTML = value;
          } else if (key.startsWith('PDF')) {
            value = `<a href="https://samlingsportal.nhm.uio.no/archive/nhm/${value}">PDF</a>`;
            tableCell.innerHTML = value;
          } else if (key.includes('NHM ID')) {
            tableCell.appendChild(document.createTextNode(value));
            tableCell.className = 'nowrap';
          } else if (key.includes('Regnr')) {
            value = `<a href="${url}${value}&documentType=${documentType}">${value}</a>`;
            tableCell.innerHTML = value;
        } else {
            if (value.length > 500) {
                value = value.substring(0, 500) + '[...]';
              }
            tableCell.appendChild(document.createTextNode(value));
          }
        }
      });
    });
  
    document.getElementById('container').appendChild(table);
  };


// performs search and fetches data
// in: limit (integer; maximum number of records to display)
// calls archiveResultTable(..)
// is called in archiveSearchForm.eventlistener

const doarchiveSearch = async (limit = 2000) => {
    const resultTableElement = document.getElementById('archive-result-table');
    if (resultTableElement) {
      document.getElementById('container').removeChild(resultTableElement);
    }
  
    const museum = getCurrentMuseum();
    const searchTerm = archiveSearch.value;
    archiveCollection = archiveCollection || 'archive';
    const url = `${urlPath}/search/?search=${searchTerm}&museum=${museum}&samling=${archiveCollection}&linjeNumber=0&limit=${limit}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      const parsedResults = Papa.parse(data.unparsed.results, {
        delimiter: "\t",
        newline: "\n",
        quoteChar: '',
        header: true,
      });
  
      if (parsedResults.data.length > 0) {
        createArchiveTableAndFillIt(parsedResults.data, archiveCollection);
        errorMessage.innerText = textItems.nbHitsText[index];
        nbHitsElement.innerText = parsedResults.data.length;
        sortTable();
      } else {
        console.log('no results');
        errorMessage.innerText = textItems.noHits[index];
      }
  
      updateFooter(museum, archiveCollection);
      

    } catch (error) {
      console.error(error);
      errorMessage.innerText = textItems.serverError[index];
    }
  };
  

// when somebody clicks search-button
archiveSearchForm.addEventListener('click', (e) => {
    e.preventDefault()
    errorMessage.innerText = "" // fjern feilmeldinger
    doarchiveSearch(2000) //
    
})  

// sort table
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






// sends request to server for date of last change of the archive-datafile
// is called in this file (archive.js)
const updateFooter = (museum, archiveCollection) => {
    const url = urlPath + '/footer-date/?&samling=' + archiveCollection + '&museum=' + museum  
        fetch(url).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.text()
            }
        }).then ((data) => {
            data=JSON.parse(data)
            lastUpdated = 'Dataene ble sist oppdatert: ' + data.date
            document.querySelector('#last-updated').textContent = lastUpdated
        }) .catch((error) => {
            console.error('There is a problem, probably file for collection does not exist', error)
        })
}

async function main() {
    errorMessage.innerText=''
    if((sessionStorage.getItem('fileList') === null || sessionStorage.getItem('fileList') === '[]' )) {
        await getFileList()
    }
    makeButtons()

}

main()



