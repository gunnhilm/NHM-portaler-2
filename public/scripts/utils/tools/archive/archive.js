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
    const museum = getCurrentMuseum();
    const url_getFileList = `${urlPath}/getFileList/?museum=${museum}`;
    try {
      const response = await fetch(url_getFileList);
      if (!response.ok) {
        throw new Error('Error: response not ok');
      }
      const data = await response.text();
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
    else if (a == 'foto') {return textItems.foto[index]}
    else if (a == 'journals') {return textItems.journals[index]}
}

function removeSubButtons() {
  const container = document.getElementById('sub-archive-type');

  // Clear any existing buttons in the container
  container.innerHTML = '';
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

function getSearchVariables () {
  const searchTerm = archiveSearch.value
  const limit = 2000
  const museum = getCurrentMuseum()

   return {searchTerm, limit, museum}
}

function makeSubButtons(type, buttonArray) {
  let archiveCollection = ''
  const container = document.getElementById('sub-archive-type');

  // Clear any existing buttons in the container
  container.innerHTML = '';
  
    buttonArray.forEach(name => {
      const button = document.createElement("button");
      button.textContent = name; // Use textContent instead of innerHTML
      button.id = name;
      button.className = "white-button";
      container.appendChild(button);
 
      // Create a closure to capture the value of 'name'
      (function(name) {
        button.addEventListener('click', (e) => {
          removeResults();
          archiveSearch.value = '';

          // Clear class name for all buttons
          container.querySelectorAll('button').forEach(btn => {
            btn.className = "white-button";
          });

          // Set class name for clicked button
          button.className = "blue-button";
    
          archiveCollection = name
          // Set sessionStorage item with clicked button ID
          sessionStorage.setItem('buttonID', name);
          e.preventDefault();
          const searchVariables = getSearchVariables()
          doarchiveSearch(searchVariables.searchTerm,2000, searchVariables.museum, name,'');
        });
      })(name);
    });
}


async function makeButtons() {
  await getFileList();
  const fileList = JSON.parse(sessionStorage.getItem('fileList'));
  
  const archiveTypeContainer = document.getElementById("archive-type");
  const buttonArray = [];
  const searchVariables = getSearchVariables()
  for (const file of fileList) {
    if (file.source === 'archive') {
      const archiveTypes = file.archiveGroups;
      const archiveFiles = file.archiveFiles;
      
      archiveTypes.forEach(type => {
        const button = document.createElement("button");
        if (typeof type === "object") {
          const keys = Object.keys(type);
          button.innerHTML = addTextInButtons(keys[0]);
          button.id = keys[0];
          button.className = "white-button";
          archiveTypeContainer.appendChild(button);
          buttonArray.push(button);
        } else {
        button.innerHTML = addTextInButtons(type);
        button.id = type;
        button.className = "white-button";
        archiveTypeContainer.appendChild(button);
        buttonArray.push(button);
      }
        button.addEventListener('click', (e) => {
          removeResults();
          archiveSearch.value = '';
          buttonArray.forEach(btn => {
            btn.className = "white-button";
          });
          if (type === 'journals' ) {
            button.className = "blue-button";
            errorMessage.innerText = ""; // remove error messages

            // Save the button ID to sessionStorage
            sessionStorage.setItem('buttonID', type);
            archiveCollection = archiveFiles[type];
            const museum = getCurrentMuseum();
            const url = `${urlPath}/${museum}/journaler`;
            window.open(url, '_self');
  
          } else if (archiveFiles.hasOwnProperty(type)) {
            archiveCollection = archiveFiles[type];
            button.className = "blue-button";
            errorMessage.innerText = ""; // remove error messages

            // Save the button ID to sessionStorage
            sessionStorage.setItem('buttonID', type);
            removeSubButtons();
            
            doarchiveSearch(searchVariables.searchTerm,2000, searchVariables.museum, archiveCollection,'');
          } 
          if (typeof type === "object") {
            const keys = Object.keys(type);
            button.className = "blue-button";
            errorMessage.innerText = ""; // remove error messages
            const subButtons =  type[keys[0]] // ['Dagny Tande Lid', 'Andre illustrasjoner'];
            makeSubButtons(keys[0], subButtons);
          }

          e.preventDefault();
        });
      });
    }
  }
}


// resultattabell

// creates the headers in the table
// in: table (html-table, to show on the page)
// in: keys (array?, source of header titles)

// is called in archiveResultTable(..)
const archiveHeaderNamesToShow = ['Regnr', 'Tekst på arkivboks', 'Indeks', 'Periode', 'Arkivskaper', 'Person', 'Qnummer person ', 'FotoID (kommer etter fotografering)', 'Kommentarer']; // Define the headers to show
const botanicalIllustrationsHeaderNamesToShow = ['Regnr', 'Illustratør', 'Artsnavn (norsk)', 'Artsnavn (Latin)', 'Figurnavn', 'Comment', 'Herbarieark/annen info', 'Kilde', 'Copyright']
const DTLIllustrationsHeaderNamesToShow = ['Regnr', 'Kunstner', 'Norsk Navn','Latinsk Navn', 'Tegningype', 'Motiv', 'Orginal tekst', 'Copyright']
const fieldNoteHeaderNamesToShow = ['Fagområde', 'Taxongruppe',  'Dokumenttype', 'Person', 'Ekstra_info', 'Stedsinfo', 'År_fra', 'År_til', 'Filnavn'] // Define the headers to show
const RYBFotoHeadersToShow = ['Regnr', 'Dato_foto_tidvis_anslagsvis', 'Motiv', 'Lokalitetsbeskrivelse', 'Stedsangivelse', 'Diastekst']

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

// Show a box nex to the searchfield with extra inforamtion about abotut the archiveCollection
function showExtraInfo(archiveCollection) {
  const extraInfo = document.getElementById("extra-info");
  console.log(archiveCollection);
  try {
    if (archiveCollection === 'Dagny Tande Lid') {
      extraInfo.innerHTML = "<h3>Dagny Tande Lids illustrasjoner</h3> <p> I 1979 donerte Dagny Tande Lid over 5000 tegninger til museet. Senere ble det gitt ytterligere tegninger. Disse oppbevares i museets historiske arkiv og presenteres her som i en online katalog.  </p> <p> I 1989 utarbeidet Odvar Pedersen en papirkatalog over 5012 botaniske tegninger med en oversikt over hvilke bøker de de hadde vært brukt i. <a href='/museum/archive/illustrations_files/DTL/HOVEDKAT.pdf'>Last ned Katalog her</a></p><p>Tegninger og akvareller er vernet av Lov om opphavsrett til åndsverk. Rettighetene forvaltes av BONO.<br><a href='https://www.bono.no/bruk-kunstverk'>Søk om bildelisens</a></p>";
      extraInfo.style.display = "block";
    } else if (archiveCollection === 'Botaniske Illustrasjoner') {
      extraInfo.innerHTML = "<h3>Botaniske Illustrasjoner</h3> <p> Museet har en rekke forskjellige botaniske illustrasjoner i sitt arkiv. Noen av disse kan vi dele med dere da de enten er 'falt i det fri' eller vi har rettigheter til å dele dem. Andre må man komme til arkivet for å se.</p>";
      extraInfo.style.display = "block";
    } else {
      extraInfo.style.display = "none";
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}



// creates table for the archives and fills it
// in: children (array, containing content to table, i.e. data on archives) 
// calls addHeaders(..)
// is called in doarchiveSearch(..)
const createArchiveTableAndFillIt = (data, archiveCollection, showAll) => {
  let filePath = '';
  let headerNamesToShow = [];
  const currentYear = new Date().getFullYear();


  if (archiveCollection === 'archive') {
    headerNamesToShow = archiveHeaderNamesToShow;
  } else if (archiveCollection === 'Botaniske Illustrasjoner') {
    headerNamesToShow = botanicalIllustrationsHeaderNamesToShow;
  } else if (archiveCollection === 'Dagny Tande Lid') {
    headerNamesToShow = DTLIllustrationsHeaderNamesToShow;
  } else if (archiveCollection === 'fieldNotes') {
    headerNamesToShow = fieldNoteHeaderNamesToShow;
    filePath = '/museum/archive/fieldNotes_files/';
  } else if (archiveCollection === 'Rolf Y. Berg') {
    headerNamesToShow = RYBFotoHeadersToShow;
    filePath = '/museum/archive/photo_files/RYB_files/';
  }
  
  const table = document.createElement('table');
  table.id = 'archive-result-table';
  table.className = 'result-table';

  data.forEach((child, i) => {
    if (i === 0) {
      addHeaders(table, headerNamesToShow);
    }

    const museum = getCurrentMuseum();
    const url = `${urlPath}/${museum}/archive?pageID=`;
    const documentType = sessionStorage.getItem('buttonID');
    const row = table.insertRow();

    Object.entries(child).forEach(([key, value]) => {
      if (headerNamesToShow.includes(key)) {
        const tableCell = row.insertCell();

        if (key.includes('FlipBook')) {
          value = `<a href="https://samlingsportal.nhm.uio.no/archive/nhm/${value}">FlipBook</a>`;
          tableCell.innerHTML = value;
        } else if (key.startsWith('PDF')) {
          value = `<a href="https://samlingsportal.nhm.uio.no/archive/nhm/${value}">PDF</a>`;
          tableCell.innerHTML = value;
        } else if (key.includes('NHM ID')) {
          tableCell.textContent = value;
          tableCell.className = 'nowrap';
        } else if (key.includes('Regnr')) {
          if(showAll){
            value = `<a href="${url}${value}&documentType=${documentType}&force=true" target="_blank">${value}</a>`;
          } else {
            value = `<a href="${url}${value}&documentType=${documentType}" target="_blank">${value}</a>`;
          }
          
          tableCell.innerHTML = value;
        } else if (key.toLowerCase().includes('filnavn')) {
          const fullPathName = filePath + value;
          value = `<a href="${fullPathName}">${value}</a>`;
          tableCell.innerHTML = value;
        } else if (key.toLowerCase() === 'copyright' && value.toLowerCase().includes('bono')) {
          value = value + currentYear
          tableCell.innerHTML = value;
        } 
        
        else {
          if (value.length > 500) {
            value = value.substring(0, 500) + '[...]';
          }
          tableCell.textContent = value;
        }
      }
    });
  });

  document.getElementById('container').appendChild(table);
};



const showHiddenImagesOrNot = (searchTerm) => {
  const searchVariables = searchTerm.split(' ');
  let showAll = false;

  for (let i = 0; i < searchVariables.length; i++) {
    if (searchVariables[i] === 'force=true') {
      searchVariables.splice(i, 1);
      showAll = true;
      i--;
    }
  }

  searchTerm = searchVariables.join(' ');

  return {
    searchTerm,
    showAll
  };
};

const doarchiveSearch = async (searchTerm, limit, museum, archiveCollection, linjeNumber) => {
  removeResults()
  const resultTableElement = document.getElementById('archive-result-table');

  if (resultTableElement) {
    document.getElementById('container').removeChild(resultTableElement);
  }

  // Get the current URL from the browser window
  const urlString = window.location.href;

  // Parse the URL and extract the search parameters using URLSearchParams
  const urlParams = new URLSearchParams(urlString);

  // Get the values of individual parameters from the URLSearchParams object
  let urlArchiveCollection = urlParams.get("samling");
  let urlLimit = urlParams.get("limit");

  // Handle missing parameters and override them with URL parameters if available
  const archiveSearchValue = archiveSearch.value || urlParams.get("search") || '';
  if (!searchTerm) {
    searchTerm = archiveSearchValue ;
  }
  const { searchTerm: updatedSearchTerm, showAll } = showHiddenImagesOrNot(searchTerm);
  searchTerm = updatedSearchTerm
  if (!museum) {
    museum = getCurrentMuseum();
  }
  
  if (!archiveCollection) {
    archiveCollection = urlArchiveCollection || 'archive';
  }
  
  if (!limit) {
    limit = urlLimit || 2000;
  }

  const url = `${urlPath}/search/?search=${searchTerm}&museum=${museum}&samling=${archiveCollection}&linjeNumber=${linjeNumber}&limit=${limit}`;
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
      showExtraInfo(archiveCollection);
      createArchiveTableAndFillIt(parsedResults.data, archiveCollection, showAll);
      errorMessage.innerText = textItems.nbHitsText[index];
      nbHitsElement.innerText = parsedResults.data.length;
      sortTable();
    } else {
      console.log('no results');
      errorMessage.innerText = textItems.noHits[index];
    }

    updateFooter(museum, archiveCollection);

    // Update the URL parameters using URLSearchParams
    const newUrlParams = new URLSearchParams({
      search: searchTerm,
      museum,
      samling: archiveCollection,
      linjeNumber: 0,
      limit: limit
    });
    window.history.replaceState({}, '', `${window.location.pathname}?${newUrlParams}`);

  } catch (error) {
    console.error(error);
    errorMessage.innerText = textItems.serverError[index];
  }
};



// for å kunne lenke til et søk
const checkSearchParameterAndRunSearch = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('search');
  const museum = urlParams.get('museum');
  const archiveCollection = urlParams.get('samling');
  const linjeNumber = urlParams.get('linjeNumber');
  const limit = urlParams.get('limit');

  if (searchTerm) {
      await doarchiveSearch(searchTerm, limit, museum, archiveCollection, linjeNumber);
  }
};

window.onload = checkSearchParameterAndRunSearch;

// when somebody clicks search-button
archiveSearchForm.addEventListener('click', (e) => {
    e.preventDefault()
    errorMessage.innerText = "" // fjern feilmeldinger
    doarchiveSearch() //
    
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