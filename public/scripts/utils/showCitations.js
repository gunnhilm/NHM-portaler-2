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

function addTextInCitTable(a) {
    const collections = {
        Algae: textItems.alger,
        Fungi: textItems.sopp,
        Lichens: textItems.lav,
        Mosses: textItems.moser,
        Vascular_plants: textItems.vascular,
        Birds: textItems.fugler,
        crustacea: textItems.crustacea,
        insectTypes: textItems.insectTypes,
        Entomolgy: textItems.insekter,
        Entomology: textItems.insekter,
        evertebrater: textItems.invertebrates,
        Invertebrates: textItems.invertebrates,
        Fish: textItems.fisk,
        Herpetiles: textItems.fishHerp,
        Mammals: textItems.bcPattedyr,
        mammals: textItems.pattedyr,
        DNA: textItems.dna_vascular,
        DNA_other: textItems.dna_fungi_lichens,
        DNA_entomology: textItems.dna_entomology,
        other: textItems.dna_other,
        malmer: textItems.malmer,
        mineraler: textItems.mineraler,
        oslofeltet: textItems.oslofeltet,
        utenlandskeBergarter: textItems.utenlandskeBA,
        Palaeontology: textItems.paleontologi,
        palTyper: textItems.palTyper,
        utad: textItems.utad,
        bulk: textItems.bulk,
      };
      if(collections[a])  {
        return collections[a][langIndex];
      } else {
        return a
      }
    
  }


  function extractKeysIntoArray(data) {
    return Object.keys(data).filter(key => key !== "header");
  }
  
  const populateCitTable = (data) => {
    collections = extractKeysIntoArray(data)
    console.log('data');
    console.log(data);
    console.log('colletionsArray');
    console.log(collections);
    
    const table = document.querySelector('#GBIF-citation-table');
    const headerArray = data.header.slice().sort();
    headerArray.unshift('Collection');
    table.innerHTML = '';

    const dnaArray = collections.filter(item => item.includes("dna"));
    const zoologyArray = collections.filter(item => ['Mammals', 'Herpetiles', 'Fish', 'Birds', 'Entomolgy', 'Entomology', 'Arthropoda', 'Invertebrates', 'Gastropods', 'Marine_invertebrates'].includes(item));
    const botanyArray = collections.filter(item => ['Algae', 'Mosses', 'Lichens', 'Vascular_plants', 'Fungi'].includes(item));
    const earthSciencesArray = collections.filter(item => ['Palaeontology'].includes(item));
    const theRestArray = collections.filter(item => !dnaArray.includes(item) && !zoologyArray.includes(item) && !botanyArray.includes(item) && !botanyArray.includes(earthSciencesArray));
    console.log('the rest Array:');
    console.log(theRestArray);
  
    const headerRow = table.insertRow(0);
    headerRow.style.fontWeight = 'bold';
    for (let i = 0; i < headerArray.length; i++) {
      const headerCell = document.createElement('th');
      headerCell.innerHTML = headerArray[i];
      headerRow.appendChild(headerCell);
  
      if (i === 0) {
        headerCell.style.textAlign = 'left'; // Apply left alignment to the first header cell
      }
    }
  
    const addRows = (array, color) => {
        try {
            
        
      let rowNumber = 1;
      for (const collection of array) {
        const dataRow = table.insertRow(rowNumber);
        const collectionCell = dataRow.insertCell(0);
        collectionCell.style.textAlign = 'left';
        collectionCell.style.backgroundColor = color; 
        collectionCell.innerHTML = addTextInCitTable(collection)
        // collectionCell.innerHTML = collection;
  
        let columnIndex = 1;
        for (const year of headerArray.slice(1)) {
          const yearData = data[collection][year] || '';
          const dataCell = dataRow.insertCell(columnIndex);
          collectionCell.style.textAlign = 'middle';
          collectionCell.style.backgroundColor = color; 
          dataCell.innerHTML = yearData;
          columnIndex++;
        }
        rowNumber++;
      }
    } catch (error) {
            console.log('feil i GBIF citation table for collection: ' + collection );
    }
    };
  

    addRows(theRestArray,  "#dbd7d7");
    addRows(earthSciencesArray,  "#F8CAA3");
    addRows(zoologyArray,  "#CBDBF5");
    addRows(botanyArray,  "#D8F5CB");
  
    table.classList.add('summaryTable');
  };
  



  // // populateCitTable
// // // data = object with header and citations per year per collection
//   const populateCitTable = (data) => {
//     console.log(data);
//     const table = document.querySelector('#GBIF-citation-table');
//     const headerArray = data.header.slice().sort();
//     headerArray.unshift('Collection');
//     table.innerHTML = '';
  
//     const zoologyArray = data.filter(item => ['Mammals', 'Herpetiles', 'Fish', 'Birds', 'Entomology'].includes(item));
//     const botanyArray = data.filter(item => ['Algae', 'Mosses', 'Lichens', 'Vascular_plants', 'Fungi'].includes(item));
//     const earthScienceArray = data.filter(item => ['Palaeontology'].includes(item));

//     const headerRow = table.insertRow(0);
//     headerRow.style.fontWeight = 'bold';
//     for (let i = 0; i < headerArray.length; i++) {
//       const headerCell = document.createElement('th');
//       headerCell.innerHTML = headerArray[i];
//       headerRow.appendChild(headerCell);
  
//       if (i === 0) {
//         headerCell.style.textAlign = 'left'; // Apply left alignment to the first header cell
//       }
//     }
//     const addRows = (array, category, color) => {
  
//     let rowNumber = 1;
//     for (const [collection, years] of Object.entries(data)) {
//       if (collection !== 'header') {
//         const dataRow = table.insertRow(rowNumber);
//         const collectionCell = dataRow.insertCell(0);
//         collectionCell.style.textAlign = 'left';
//         collectionCell.innerHTML = addTextInCitTable(collection);
  
//         let columnIndex = 1;
//         for (const year of Object.values(years)) {
//           dataRow.insertCell(columnIndex).innerHTML = year;
//           columnIndex++;
//         }
//         rowNumber++;
//       }
//     }
//     }

//     addRows(botanyArray,  "#D8F5CB");
//     addRows(zoologyArray,  "#CBDBF5");
//     addRows(earthScienceArray,  "#F8CAA3");



//     table.classList.add('summaryTable');
//   };

  const mainCit = async () => {
    const museum = getMuseum()
    const data = await getPublications(museum)
    populateCitTable(data)

  }

mainCit()

