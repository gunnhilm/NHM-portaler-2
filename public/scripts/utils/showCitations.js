const getMuseum = () => {
    const path = window.location.pathname
    const  museum = path.split('/')
    return museum[2]
}

// const collectionKey ='e45c7d91-81c6-4455-86e3-2965a5739b1f'

const  getItemsPerYear = async (data, year) =>{
    const pubObj = {}
    return data.count
}

const fetchData = async (gbifKey) => {
    const currentYear = new Date().getFullYear()
    const publicationObject = {}
    const yearArray = []
    try {
        for (let index = 0; index < 6; index++) {
            let year = currentYear - index
            yearArray[index] = year
            //https://api.gbif.org/v1/literature/search?gbifDatasetKey=e45c7d91-81c6-4455-86e3-2965a5739b1f&year=2019
            const response = await fetch('https://api.gbif.org/v1/literature/search?gbifDatasetKey=' + gbifKey + '&year=' + year + '&limit=0');
            const data = await response.json();    
            if(data){
                publicationObject[year] = await getItemsPerYear(data, year)
            }
        }
        publicationObject.header = yearArray
        return publicationObject
    } catch (error) {
        console.log(error);
        return error
    }
}

const getPublications = async (museum) => {
    let publicationArray = []
    const collectionObj = {}
    const headerArray = []
    for (const key in GBifIdentifiers[museum]) {
        const collectionName = key
        const gbifKey = GBifIdentifiers[museum][key].key;
        publicationArray = await fetchData(gbifKey)
        headerArray.push(publicationArray.header)
        delete publicationArray.header
        collectionObj[key] = publicationArray
    }
    collectionObj.header = headerArray[0]
    headerArray.length = 0
    return collectionObj
}


// populateCitTable
// data = object with header and citations per year per collection
const populateCitTable = (data) => {
    const table = document.querySelector('#GBIF-citation-table');
    const headerArray = data.header.slice(); // Create a copy and sort it
    headerArray.sort();
    headerArray.splice(0, 0, 'Collection');
    // Empty the table if there is already content
    table.innerHTML = '';

    // Create the header row
    const headerRow = table.insertRow(0);
    headerRow.style.fontWeight = 'bold'; // Make the header row bold
    for (let i = 0; i < headerArray.length; i++) {
        const headerCell = document.createElement('th');
        headerCell.innerHTML = headerArray[i];
        headerRow.appendChild(headerCell);
    }

    // Create rows for each collection
    let rowNumber = 1;
    for (const [collection, years] of Object.entries(data)) {
        if (collection !== 'header') {
            const dataRow = table.insertRow(rowNumber);
            dataRow.insertCell(0).innerHTML = collection;

            // Populate the cells with citation data for each year
            let columnIndex = 1; // Start from the second column
            for (const year of Object.values(years)) {
                dataRow.insertCell(columnIndex).innerHTML = year;
                columnIndex++;
            }

            rowNumber++;
        }
    }

    // Apply a class to the table for styling
    table.setAttribute('class', 'summaryTable');
};



  const mainCit = async () => {
    const museum = getMuseum()
    const data = await getPublications(museum)
    populateCitTable(data)

  }

mainCit()
