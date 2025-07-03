function getURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageID = urlParams.get('pageID');
    const documentType = urlParams.get('documentType');
    const force = urlParams.get('force') || false;
    const lineNumber = urlParams.get('lineNumber');
    return {
      pageID,
      documentType,
      force,
      lineNumber
    };

  }

const params = getURLParameters();

const getCurrentMuseum = () => {
    let museum = window.location.pathname
    museum = museum.split('/')
    return museum[2]
}

const displayResultsAsTable = results => {
  let show = ''
  const currentYear = new Date().getFullYear();
  const table = document.createElement("table");
  table.setAttribute("id", "results-table");
  table.classList.add("item-page");

  // Loop through each result object and add a row for each one
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    
    const resultRow = document.createElement("tr");
    table.appendChild(resultRow);

    // Loop through each key-value pair and add a new row for each pair
    for (const key in result) {
      const value = result[key];
      if (Object.hasOwnProperty.call(result, key)) {
      
      if(key === 'show') {
        show = value
      } else {
        if (value !== undefined && value !== null && value !== "") {
          const newRow = document.createElement("tr");

          const keyCell = document.createElement("td");
          keyCell.textContent = key;
          newRow.appendChild(keyCell);

          const valueCell = document.createElement("td");
          valueCell.textContent = value;
          if (key.toLowerCase() === 'copyright' && value.toLowerCase().includes('bono')) {
            valueCell.textContent = value + currentYear;
          }
          
          newRow.appendChild(valueCell);

          table.appendChild(newRow);
        }
      }
      if (key.toLowerCase() === 'copyright' && value.toLowerCase().includes('bono')) {
        const imageText = document.getElementById("image-text");
        imageText.innerHTML = "Tegninger og akvareller er vernet av Lov om opphavsrett til åndsverk. Rettighetene forvaltes av BONO.<br><a href='https://www.bono.no/bruk-kunstverk'>Søk om bildelisens</a>";
        imageText.style.display = "block";
      }
      }

    } 
  }

  // Add table to web page
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = "";
  resultsContainer.appendChild(table);
  return show;
};
  
async function checkFiles(folderName, fileName, directImagePath) {

    try {
        const url = `${urlPath}/item-page/check-files`
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            folderName,
            fileName,
            directImagePath,
        }),
        });

        if (response.ok) {
            const json = await response.json();
            return {
              filePath: json.filePath,
              matchingFiles: json.matchingFiles,
              folderPath: json.folderPath,
              matchingScans: json.matchingScans
            };
        } else {
          console.log(`Response from server was not ok: ${response.status} ${response.statusText}`); 
          throw new Error(`Failed to fetch files: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}
  

// performs search and fetches data
// in: limit (integer; maximum number of records to display)
// calls archiveResultTable(..)
// is called in archiveSearchForm.eventlistener
const doarchiveSearch = async (limit = 2000) => {
    const { pageID, documentType, force, lineNumber } = getURLParameters();    
    const url = `${urlPath}/getLineByNumber/?museum=${getCurrentMuseum()}&samling=${documentType}&linjeNumber=${lineNumber}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      const results = Papa.parse(data.unparsed.results, { delimiter: "\t", newline: "\n", quoteChar: "", header: true }).data;
      const result = results.find(result => result.Regnr === pageID);
      let fotoID = Object.keys(result).find(k => k.toLowerCase().includes('mediafile'));
      fotoID = result[fotoID]
      if (result) {
        const show =  displayResultsAsTable([result])

        if (force) {
          return true
        }
        if(fotoID) {
          return fotoID
        } else if (show.toLowerCase() === 'no') {
          // 'returnerer false fordi show er no'
          return false 
        } else {
          return true
        }  
      }
    } catch (error) {
      console.error(error);
      errorMessage.innerText = textItems.serverError[index];
    }
  };

async function checkForImage(directImagePath) {
  try {
    const mediaObject = await checkFiles(params.documentType, params.pageID, directImagePath );
    console.log(mediaObject);
    
    const imageContainer = document.getElementById('item-image');
    const downloadContainer = document.getElementById('item-download-link');
    mediaObject.matchingFiles.forEach(imageFile => {
        if(imageFile.includes('tif')) {
          // make a txt link to download the file
          const downloadLink = document.createElement('a');
          downloadLink.href = urlPath + '/' + mediaObject.folderPath + imageFile;
          
          downloadLink.target = '_blank';

          const text = document.createElement('span');
          text.textContent = 'Download as TIF';

          downloadLink.appendChild(text);
          downloadContainer.appendChild(downloadLink);
        } else {
          const imageLink = document.createElement('a');
          imageLink.href = urlPath + '/'  + mediaObject.folderPath + imageFile;
          imageLink.target = '_blank';
    
          const image = document.createElement('img');
          image.src = imageLink.href;
    
          imageLink.appendChild(image);
          imageContainer.appendChild(imageLink);
        }
      });
      // Add pdf links

      if (mediaObject.matchingScans.files) {
        mediaObject.matchingScans.files.forEach(scanFile => {
            const downloadLink = document.createElement('a');
            downloadLink.href = urlPath + '/' + mediaObject.matchingScans.scanFolderPath + '/' + scanFile;
            downloadLink.target = '_blank';
    
            const text = document.createElement('span');
            text.textContent = scanFile;
    
            downloadLink.appendChild(text);
            
            // Create a new div for each link to ensure they are on separate lines
            const linkContainer = document.createElement('div');
            linkContainer.appendChild(downloadLink);
            
            // Append the linkContainer to the main downloadContainer
            downloadContainer.appendChild(linkContainer);
        });
    }
    

  } catch (error) {
    console.error(error);
  }
}


async function  main () {
  const showImage =  await doarchiveSearch()
  if(showImage){   
    checkForImage(showImage);
    // checkForScans()
  }
}

main()
