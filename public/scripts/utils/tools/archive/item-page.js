function getURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageID = urlParams.get('pageID');
    const documentType = urlParams.get('documentType');
    
    return {
      pageID,
      documentType
    };
  }

const params = getURLParameters();

const getCurrentMuseum = () => {
    let museum = window.location.pathname
    museum = museum.split('/')
    return museum[2]
}

const displayResultsAsTable = results => {
    const table = document.createElement("table");
    table.classList.add("item-page");
  
    // Loop through each result object and add a row for each one
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const resultRow = document.createElement("tr");
      table.appendChild(resultRow);
  
      // Loop through each key-value pair and add a new row for each pair
      for (const key in result) {
        if (Object.hasOwnProperty.call(result, key)) {
          const newRow = document.createElement("tr");
  
          const keyCell = document.createElement("td");
          keyCell.textContent = key;
          newRow.appendChild(keyCell);
  
          const valueCell = document.createElement("td");
          valueCell.textContent = result[key];
          newRow.appendChild(valueCell);
  
          table.appendChild(newRow);
        }
      }
    }
  
    // Add table to web page
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(table);
  };
  
  
async function checkFiles(folderName, fileName) {

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
        }),
        });

        if (response.ok) {
            const json = await response.json();
            return {
                filePath: json.filePath,
              imageFiles: json.matchingFiles
            };
        } else {
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
    const { pageID, documentType } = getURLParameters();
    const url = `${urlPath}/search/?search=${pageID}&museum=${getCurrentMuseum()}&samling=${documentType}&linjeNumber=0&limit=${limit}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const data = await response.json();

      if (data.error) throw new Error(data.error);
  
      const results = Papa.parse(data.unparsed.results, { delimiter: "\t", newline: "\n", quoteChar: "", header: true }).data;

      const result = results.find(result => result.Regnr === pageID);
      if (result) {

        displayResultsAsTable([result])
      }
  
    } catch (error) {
      console.error(error);
      errorMessage.innerText = textItems.serverError[index];
    }
  };

  // async function checkForImage(image) {
  //   try {
  //     let filePath = ''
  //     let imageFiles= []
  //     if (image) {
  //       // get filePath
  //       imageFiles.push(image)

  //     }
  //      { filePath, imageFiles } = await checkFiles(params.documentType, params.pageID);
  //     console.log(filePath);
  //     console.log(imageFiles);
  
  //     const imageContainer = document.getElementById('item-image');
  
  //     imageFiles.forEach(imageFile => {
  //       const imageLink = document.createElement('a');
  //       imageLink.href = urlPath + '/' + filePath + imageFile;
  //       imageLink.target = '_blank';  // open the link in a new tab
  //       console.log(imageLink.href);
  
  //       const image = document.createElement('img');
  //       image.src = imageLink.href;
  //       console.log(image.src);
  
  //       imageLink.appendChild(image);
  //       imageContainer.appendChild(imageLink);
  //     });
  
  //     // Do something with the image elements
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  async function checkForImage() {
    try {
      let imageFiles = [];
      const { filePath, imageFiles: documentImageFiles } = await checkFiles(params.documentType, params.pageID);
      console.log(filePath);
      console.log(documentImageFiles);
  
      const imageContainer = document.getElementById('item-image');
  
      documentImageFiles.forEach(imageFile => {
        const imageLink = document.createElement('a');
        imageLink.href = urlPath + '/' + filePath + imageFile;
        imageLink.target = '_blank';
  
        const image = document.createElement('img');
        image.src = imageLink.href;
  
        imageLink.appendChild(image);
        imageContainer.appendChild(imageLink);
      });
  
      // Do something with the image elements
    } catch (error) {
      console.error(error);
    }
  }
  

  async function  main () {
  doarchiveSearch()
  checkForImage()
}

main()
