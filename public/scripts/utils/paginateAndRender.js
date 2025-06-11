//paginateAndRender.js: Renders result table and contains functionality related to this, e.g. sorting of table and splitting of result into pages.

// urlPath is defined in textItems.js
// rendered with result table (used in function resultTable())

const hitsPerPage = document.querySelector('#number-per-page')

// show or hide LoansButton; base on FileList if Loans = true 
// in resultsElementsOnOff -> showResultElements(isLoan)
let isLoan = false
function activateLoanButton () {
    try {
        const collection = sessionStorage.getItem('chosenCollection')
        let tempList = JSON.parse(sessionStorage.getItem('fileList'))
        for (const el of tempList) {
            if (el.name === collection && el.loan) {
                console.log('her blir det lån');
                return 
            }
        }
        tempList = ""
    } catch (error) {
        console.log("Feil med lånekanpp: " + error);       
    }
}




// change: take from fileList
async function whichFileAndDb_main (museum,collection) {
    //return new Promise(function(resolve, reject) {
        
        url = urlPath + '/which/?museum='+ museum + '&collection=' +  collection
        await fetch(url).then((response) => {
            if (!response.ok) {
                throw 'cant find file and database from backend'
            } else {
                try {
                    response.text().then((data) => {
                        if (data.error) {
                            errorMessage.innerHTML = textItems.serverError[index]
                            return console.log(data.error)
                        } else {
                            let data1 = JSON.parse(data)
                            sessionStorage.setItem('file', data1[0])
                            sessionStorage.setItem('source', data1[1])
                        }
                    })
      //              resolve
                } catch (error) {
                    console.log(error)
                }
            } 
        })
    //})
}

// returns itemType for a record, e.g. tissue, egg, sperm, skin etc.
// in: catalogNumber (string, catalogNumber)
//out: itemType (string, e.g. ‘tissue’, ‘egg’)
// is called in resultTable(..) (in the future, when stitching of files is done)
function itemType (catalogNumber) {
    const s = catalogNumber.charAt(catalogNumber.length-1)
    let itemType = (s === 'B') ? textItems.b[index] : (s === 'D') ? 'DNA' : (s === 'P') ? textItems.p[index] : 
        (s === 'E') ? 'Egg' : (s === 'S') ? 'Sperm' : (s === 'O') ? textItems.o[index] : (s === 'OB') ? textItems.ob[index] :
        (s === 'F') ? textItems.f[index] : (s === 'O') ? textItems.o[index] : (s === 'N') ? textItems.n[index] :
        (s === 'PE') ? 'Pellet' : (s === 'OT') ? textItems.ot[index] : (s === 'SS') ? 'Sperm slide' : (s === 'SR') ? textItems.sr[index] :
        (s === 'SI') ? textItems.si[index] : (s === 'T') ? textItems.t[index] : (s === 'TS') ? textItems.ts[index] :
        (s === 'EP') ? textItems.ep[index] : (s === 'SG') ? 'Seminal glomera' : (s === 'BS') ? textItems.bs[index] :
        (s === 'FA') ? 'Faeces' : (s === 'CF') ? textItems.cf[index] : (s === 'U') ? textItems.u[index] : ""
    return itemType
}

// functionality to switch arrows up and down accordint to sorting, in head-buttons in result-table
const arrowUp = `<img id='uio-arrow-up' alt='arrow up' src='${urlPath}/images/icon-up.svg' width="10" height="10"></img>`
const arrowDown =  `<img id='uio-arrow-down' alt='arrow down' src='${urlPath}/images/icon-down.svg' width="10" height="10"></img>`
const arrows = arrowUp + arrowDown

// hides column with genetic data in result-table for bergen and tromsø (museums without genetic database (corema))
// in: col_no(number, index of column in result-table)
// is called by resultTable(…)
function hide_column(col_no) {

    try {
        const rows = table.getElementsByTagName('tr')
        for (var row=0; row<rows.length;row++) {
            if(row === 0) {
                var cells = rows[row].getElementsByTagName('th')
                cells[col_no].style.display = 'none'
            } else {
            var cells = rows[row].getElementsByTagName('td')
            cells[col_no].style.display = 'none'
        }
        }
    } catch (error) {
        console.log('colunm ' + col_no + ' does not exsist');
    }

}

/////////// sammenlign data fra musit og corema
    // er ikke i bruk. januar 2024
function compare(subMusitData) {
    let compArray = []
    subMusitData.forEach(el => {
        // if (el.coremaCountry && el.country) {if (el.coremaCountry != el.country) {console.log("country " + el.catalogNumber + " " + el.coremaCountry + " " + el.country); compArray.push("country " + el.catalogNumber + " " + el.coremaCountry + " " + el.country + "\r")}}
        // if (el.coremaCounty && el.county) {if (el.coremaCounty != el.county) {console.log("county " + el.catalogNumber + " " + el.coremaCounty + " " + el.county); compArray.push("county " + el.catalogNumber + " " + el.coremaCounty + " " + el.county+ "\r")}}
        if (el.coremaDateIdentified && el.dateIdentified) {if (el.coremaDateIdentified != el.dateIdentified) {compArray.push(el.institutionCode + "-" + el.collectionCode + "-" + el.catalogNumber + ": dateIdentified: "  + el.dateIdentified + " " + el.RelCatNo + " " + el.coremaDateIdentified + "\r")}}
        // if (el.coremaElevation && el.elevation) {if (el.coremaElevation != el.elevation) {console.log("elevation " + el.catalogNumber + " " + el.coremaElevation + " " + el.elevation);compArray.push("elevation " + el.catalogNumber + " " + el.coremaElevation + " " + el.elevation + "\r")}}
        // if (el.coremaEventDate && el.eventDate) {if (el.coremaEventDate != el.eventDate) {console.log("eventDate " + el.catalogNumber + " " + el.coremaEventDate + " " + el.eventDate);compArray.push("eventDate " + el.catalogNumber + " " + el.coremaEventDate + " " + el.eventDate + "\r")}}
        if (el.coremaGenus && el.genus) {if (el.coremaGenus != el.genus) {compArray.push(el.institutionCode + "-" + el.collectionCode + "-" + el.catalogNumber + " genus: " + " " + el.genus + " " + el.RelCatNo + " " + el.coremaGenus  + "\r")}}
        if (el.coremaIdentificationQualifier && el.identificationQualifier) {if (el.coremaIdentificationQualifier != el.identificationQualifier) {compArray.push(el.institutionCode + "-" + el.collectionCode + "-" + el.catalogNumber + " identificationQualifier: " + el.identificationQualifier + " " + el.RelCatNo + " " + el.coremaIdentificationQualifier  + "\r")}}
        if (el.coremaIdentifiedBy && el.identifiedBy) {if (el.coremaIdentifiedBy != el.identifiedBy) {compArray.push(el.institutionCode + "-" + el.collectionCode + "-" + el.catalogNumber + " identifiedBy: " + " " + el.identifiedBy + " " + el.RelCatNo + " " + el.coremaIdentifiedBy  + "\r")}}
        // if (el.coremaLat && el.decimalLatitude) {if (el.coremaLat != el.decimalLatitude) {compArray.push("Lat: " + el.catalogNumber + " " + el.coremaLat + " " + el.decimalLatitude + "\r")}}
        // if (el.coremaLong && el.decimalLongitude) {if (el.coremaLong != el.decimalLongitude) {compArray.push("Long: " + el.catalogNumber + " " + el.coremaLong + " " + el.decimalLongitude + "\r")}}
        // if (el.coremaLocality && el.locality) {if (el.coremaLocality != el.locality) {compArray.push("locality: " + el.catalogNumber + " " + el.coremaLocality + " " + el.locality + "\r")}}
        // if (el.coremaProvince && el.stateProvince) {if (el.coremaProvince != el.stateProvince) {compArray.push("stateProvince: " + el.catalogNumber + " " + el.coremaProvince + " " + el.stateProvince + "\r")}}
        // if (el.coremaRecordedBy && el.recordedBy) {if (el.coremaRecordedBy != el.recordedBy) {compArray.push("recordedBy: " + el.catalogNumber + " " + el.coremaRecordedBy + " " + el.recordedBy + "\r")}}
        if (el.coremaScientificName && el.scientificName) {if (el.coremaScientificName != el.scientificName) {compArray.push(el.institutionCode + "-" + el.collectionCode + "-" + el.catalogNumber + " scientificName: " + el.scientificName + ", " + el.RelCatNo + " " + el.coremaScientificName + " " + el.scientificName + "\r")}}
        if (el.coremaScientificEpithet && el.scientificEpithet) {if (el.coremaScientificEpithet != el.scientificEpithet) {compArray.push(el.institutionCode + "-" + el.collectionCode + "-" + el.catalogNumber + " scientificEpithet: " + el.scientificEpithet + ", " + el.RelCatNo + " " + el.coremaScientificEpithet + " " + el.scientificEpithet + "\r")}}
        if (el.coremaTypeStatus && el.typeStatus) {if (el.coremaTypeStatus != el.typeStatus) {compArray.push(el.institutionCode + "-" + el.collectionCode + "-" + el.catalogNumber + " typeStatus: "  + el.typeStatus+ el.RelCatNo + " " + el.coremaTypeStatus  + "\r")}}

          
    })
    download('compare.txt',compArray.toString())  
    
}

function determineMuseumAndURLPath(urlPath) {
    let museumURLPath;
    let museum = '';
    
    if (window.location.href.includes('/um')) {
        museumURLPath = urlPath + "/um";
        museum = 'um';
    } else if (window.location.href.includes('tmu')) {
        museumURLPath = urlPath + "/tmu";
        museum = 'tmu';
    } else if (window.location.href.includes('nbh')) {
        museumURLPath = urlPath + "/nbh";
        museum = 'nbh';
    } else {
        museumURLPath = urlPath + "/nhm";
        museum = 'nhm';
    }

    return { museumURLPath, museum };
}


// renders result table
// input: subMusitData (JSON; part of search result that is rendered on page)
// input: musitData (JSON; searchResult, all of it)
// calls fillResultHeaders(…) or fillREsultHeadersBulk(...) in resultElementOnOff.js
//  investigateChecked(i), to check if boxes should appear as checked
//	hide_column(number) to hide corema-columns when necessary
//	showResultElement() in resultElementOnOff.js
//	drawMap(data) from map.js
//	checkSeveralBoxes(data) to add function to dropdown for checkboxes
//	is called by 
//	drawList()
//	addSortingText(…)
const resultTable = (subMusitData, musitData) => {  

    try {
        let { museumURLPath, museum } = determineMuseumAndURLPath(urlPath);
        const headers = musitData[0]
        
        const kindomIndex = headers.indexOf('kingdom')
        const scientificNameIndex = headers.indexOf('scientificName')
        const genusIndex = headers.indexOf('genus')
        const specificEpithetIndex = headers.indexOf('specificEpithet')
        const catalogNumberIndex = headers.indexOf('catalogNumber');
        const institutionCodeIndex = headers.indexOf('institutionCode');
        const collectionCodeIndex = headers.indexOf('collectionCode');
        const recordedByIndex = headers.indexOf('recordedBy');
        const lineNumberIndex = headers.indexOf('lineNumber');

        
        table.innerHTML = ""
        const row = table.insertRow(-1)
        for (let i = -1; i < pageList.length; i++) { // vis en tabell med resultater som er like lang som det vi ba om pageList.length; 
            if (i === -1) {     // her kommer tittellinjen
                const headerRow = row;
                const headerCell = []
                let org = ''
                if (sessionStorage.getItem('organismGroup').includes('geologi')) {
                    org = 'geologi'
                } else { org = 'other'}

                for (let j = 0; j < 13; j++) {
                    headerCell.push(headerRow.appendChild(document.createElement("th")))
                }
                headerCell[2].className += "uncertainty"
                headerCell[3].className += "innsamler"
                headerCell[4].className += "dato"
                headerCell[5].className += "land"
                headerCell[9].className += "sampleType"
                
                fillResultHeaders(org,headerCell,musitData)

            }  else { // Her kommer innmaten i tabellen, selve resultatene
                if(i === 0) {continue} // this contains the headers

                const row = table.insertRow(-1);

                const cells = Array.from({ length: 13 }, (_, index) => {
                    const cell = row.insertCell(index);
                    return cell;
                });
                
                // Assign class names to specific cells
                cells[2].className += "cell3";  // uncertainty (før innsamler)
                cells[3].className += "cell4";  // Innsamler (før dato)
                cells[4].className += "cell5";  // Dato (før land)
                cells[5].className += "cell6";  // Land (før kommune)
                cells[9].className += "cell10"; // Items (før hidden; items)
                
                // create named references
                const [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10, cell11, cell12, cell13] = cells;

                //cell 1
                let prefix = ''
                const institutionCode = subMusitData[i][institutionCodeIndex]
                const collectionCode = subMusitData[i][collectionCodeIndex]
                const catalogNumber = subMusitData[i][catalogNumberIndex];
                const lineNumber = subMusitData[i][lineNumberIndex];
                
                if (sessionStorage.getItem('organismGroup').includes('paleontologi')) {
                    prefix = 'PMO '
                } else if (sessionStorage.getItem('chosenCollection').includes('fisk')) {
                    prefix = 'NHMO-J-'
                } else if (institutionCode && !(/[a-zA-Z]/).test(catalogNumber.charAt(0))) {
                    prefix = institutionCode + '-' + collectionCode + '-'    
                } else {
                    prefix = ''
                }

                
                if (catalogNumber) {               
                    let strippedCatalogNumber = catalogNumber;
                
                    if (catalogNumber.includes('J')) {
                        strippedCatalogNumber = catalogNumber.substring(2);
                    }
                
                    let link = '';
                    const language = sessionStorage.getItem('language');
                    const collection = sessionStorage.getItem('chosenCollection') || collection.value; // Use sessionStorage or default to collection.value
                
                    if (catalogNumber.includes('/')) { // Mose-data
                        strippedCatalogNumber = catalogNumber.substring(0, catalogNumber.indexOf('/'));
                    }
                    
                    link = `<a id="object-link-for-${strippedCatalogNumber}" href="${museumURLPath}/object/?id=${catalogNumber}&samling=${collection}&museum=${museum}&lang=${language}&linjeNummer=${lineNumber}">${prefix}${strippedCatalogNumber}</a>`;
                    
                    cell1.innerHTML = link;
                }
                
                //cell 2
                if (sessionStorage.getItem('organismGroup').includes('geologi')) {
                    
                    if (sessionStorage.getItem('chosenCollection') === 'oslofeltet') {
                        cell2.innerHTML = `<span>${subMusitData[i][kindomIndex]}</span>`                            
                    } else {
                        cell2.innerHTML = `<span>${subMusitData[i][scientificNameIndex]}</span>`
                    }
                    
                } else if (sessionStorage.getItem('organismGroup').includes('zoologi')) {
                    if (subMusitData[i][specificEpithetIndex] && subMusitData[i][genusIndex] !== "") {
                        cell2.innerHTML = `<span style=font-style:italic>${subMusitData[i][genusIndex]} ${subMusitData[i][specificEpithetIndex]}</span>`
                    } else {                       
                        
                        cell2.innerHTML = `<span style=font-style:italic>${subMusitData[i][scientificNameIndex]}</span>`
                    }
                    
                } else {
                    let nameArray = italicSpeciesname(subMusitData[i][scientificNameIndex])
                    cell2.innerHTML = `<span style=font-style:italic>${nameArray[0].replace(/\"/g,'')}</span>` + ' ' + `<span>${nameArray[1].replace(/\"/g,'')}</span>`
                }  

                cell3.innerHTML = subMusitData[i].identificationQualifier

                //cell4 recordedBy
                const recordedBy = subMusitData[i][recordedByIndex];
                // to avoid lots of text in collector-field: replace more than two names with et al. 
                // when  collector is written "lastName, firstName", only first name is included, followed by et al. if more names
                // let recByArray = subMusitData[i].recordedBy.split(' ')
                if (recordedBy) {
                    if ((recordedBy.match(/,/g) || []).length > 1) {
                        if (!sessionStorage.getItem("organismGroup").includes('paleontologi')) {
                            let x = recordedBy.indexOf(",")
                            let y = recordedBy.substr(0,x)
                            cell4.innerHTML = y + " et al."    
                        }
                    } else {
                        cell4.innerHTML = recordedBy
                    }    
                }
                
                cell5.innerHTML = subMusitData[i][headers.indexOf('eventDate')]
                cell6.innerHTML = subMusitData[i][headers.indexOf('country')] 
                if (subMusitData[i][headers.indexOf('county')]) {cell7.innerHTML = subMusitData[i][headers.indexOf('county')]}
                cell8.innerHTML = subMusitData[i][headers.indexOf('locality')]
                cell9.innerHTML = subMusitData[i][headers.indexOf('habitat')]

                // cell 10 items
                const basisOfRecordIndex = headers.indexOf('basisOfRecord');
                const basisOfRecord = subMusitData[i][basisOfRecordIndex];
                const chosenCollection = sessionStorage.getItem('chosenCollection');
                const preparationType = subMusitData[i][headers.indexOf('preparationType')] || '';               
                const coremaBasisOfRecord = subMusitData[i][headers.indexOf('coremaBasisOfRecord')] || '';
                const materialSampleType = subMusitData[i][headers.indexOf('materialSampleType')] || '';
                let musitBasisOfRecord = basisOfRecord || '';
                let cell10Content = '';

                const isCoremaCollection = document.querySelector('#collection-select option:checked').label.includes('DNA');
                const isCoremaInMusit = chosenCollection.includes('dna_');
                const isSpecialCollection = ['mammals', 'birds', 'invertebrates'].includes(chosenCollection);

                function formatPreparationType(prepType) {
                    return prepType.replace(/\"/g, '');
                }

                if (museumURLPath === `${urlPath}/nhm`) {
                    if (isCoremaCollection) {
                        if (isCoremaInMusit) {
                            cell10Content = materialSampleType + (basisOfRecord ? ` | ${basisOfRecord}` : '');
                        } else if (isSpecialCollection) {
                            cell10Content = preparationType || '';
                        } else {
                            if (!preparationType || !/[a-zA-Z]/.test(preparationType)) {
                                cell10Content = basisOfRecord || coremaBasisOfRecord;
                            } else {
                                cell10Content = formatPreparationType(preparationType) + (musitBasisOfRecord ? ` | ${musitBasisOfRecord}` : '');
                            }
                        }
                    } else {
                        if (!preparationType) {
                            cell10Content = basisOfRecord || coremaBasisOfRecord;
                        } else {
                            cell10Content = formatPreparationType(preparationType) + (musitBasisOfRecord ? ` | ${musitBasisOfRecord}` : '');
                        }
                    }
                }
                // Clean up cell10Content to remove any leading/trailing pipes and replace double pipes
                cell10Content = cell10Content.replace(/^\s*\|/, '').replace(/\|\s*$/, '').replace(/\|\s*\|/, '|');

                cell10.innerHTML = cell10Content;



                if( subMusitData[i][headers.indexOf('associatedMedia')]) {   
                    cell11.innerHTML = `<span class="fas fa-camera"></span>`
                }
                if( subMusitData[i][headers.indexOf('decimalLongitude')]) {
                    cell12.innerHTML = '<span class="fas fa-compass"></span>'
                }
                
                cell13.innerHTML = `<input type="checkbox" id=checkbox${i} aria-label="velg denne posten" onclick="registerChecked(${i})" ></input>`
                if (investigateChecked(i)) {
                    document.getElementById(`checkbox${i}`).checked = true
                } else {
                    document.getElementById(`checkbox${i}`).checked = false
                }
                
                cell1.className = 'row-1 row-ID'
                cell2.className = 'row-2 row-name'
                cell3.className = 'uncertainty'
                cell4.className = 'innsamler'
                cell5.className = 'dato'
                cell6.className = 'land'
                cell7.className = 'row-7 row-kommune'
                cell8.className = 'row-8 row-sted'
                cell9.className = 'row-9 row-habitat'
                cell10.className = 'sampleType'
                cell11.className = 'row-11 row-photo'
                cell12.className = 'row-12 row-coordinates'
                cell13.className = 'row-13 row-checkbox'
            }
          
        }
        if (!subMusitData[0].hasOwnProperty('identificationQualifier')) {
            hide_column(2)
        }

        // hide habitat for collections that do not have it
        if (!subMusitData[0].hasOwnProperty('habitat')) {
            hide_column(8)
        }
                // hide corema-link-column for UM and TMU
        if (window.location.href.includes('tmu') || window.location.href.includes('/um') || window.location.href.includes('/nbh')) {
            hide_column(9)
        }
        

        
        // let isLoan = activateLoanButton()
        showResultElements()
        document.getElementById("empty-search-button").style.display = "inline-block"
        numberOfPages = getNumberOfPages(numberPerPage)

        if (!searchFailed) {
            try {                
                drawMap(musitData) 
            } catch (error) {
                console.log('cant draw map because of search error:  ');
                console.error(error)
            }
        } 
        
    }  
    catch(error) {
        console.log('error in resultTable');
        
        console.log(error);
        errorMessage.innerHTML = textItems.errorRenderResult[index]
        searchFailed = true // is checked when map is drawn 
    }

    const select = document.getElementById('checkboxSelect')
    if(select) {
        select.onchange =() => {
            checkSeveralBoxes(subMusitData)
        }
    }
}



const UTADRestultTable = (subUTADData, UTADData) => {

    try {
        const headers = UTADData[0]
        const catalogNumberIndex = headers.indexOf('catalogNumber');
        const institutionCodeIndex = headers.indexOf('institutionCode');
        const collectionCodeIndex = headers.indexOf('collectionCode');
        const lineNumberIndex = headers.indexOf('lineNumber');

        const vernacularNameIndex = headers.indexOf('vernacularName');
        const tilstandIndex = headers.indexOf('Tilstand');
        const basisOfRecordIndex = headers.indexOf('basisOfRecord');
        const kommentarIndex = headers.indexOf('Kommentar');
        const breddeIndex = headers.indexOf('bredde');
        const høydeIndex = headers.indexOf('høyde');
        const lengdeIndex = headers.indexOf('lengde');
        const associatedMediaIndex =  headers.indexOf('associatedMedia');
        const photoIdentifiersIndex =  headers.indexOf('photoIdentifiers');


        table.innerHTML = ""
        const row = table.insertRow(-1);

        for (let i = 0; i < pageList.length; i++) {
            if (i === 0) {     // her kommer tittellinjen
                const headerRow = row;
                const headerCell = []
                for (let j = 0; j < 10; j++) {
                    headerCell.push(headerRow.appendChild(document.createElement("th")))
                }
                headerCell[2].className += "tilstand"
                headerCell[3].className += "sampleType"
                headerCell[4].className += "kommentar"
                headerCell[5].className += "cell6"
                headerCell[9].className += "cell10"
                fillResultHeadersUTAD(headerCell,UTADData)

            }  else {  //her kommer tabell innholdet               
                
            const row = table.insertRow(-1)
            const cell1 = row.insertCell(0)
            const cell2 = row.insertCell(1)
            const cell3 = row.insertCell(2)
            const cell4 = row.insertCell(3)
            const cell5 = row.insertCell(4)
            const cell6 = row.insertCell(5)
            const cell7 = row.insertCell(6)
            const cell8 = row.insertCell(7)
            const cell9 = row.insertCell(8)
            const cell10 = row.insertCell(9)
 
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

                let prefix = ''
                const institutionCode = subUTADData[i][institutionCodeIndex]
                const collectionCode = subUTADData[i][collectionCodeIndex]
                const catalogNumber = subUTADData[i][catalogNumberIndex];
                const vernacularName = subUTADData[i][vernacularNameIndex];
                const tilstand = subUTADData[i][tilstandIndex];
                const basisOfRecord = subUTADData[i][basisOfRecordIndex];
                const kommentar = subUTADData[i][kommentarIndex];
                const bredde = subUTADData[i][breddeIndex];
                const høyde = subUTADData[i][høydeIndex];
                const lengde = subUTADData[i][lengdeIndex];
                const associatedMedia = subUTADData[i][associatedMediaIndex]
                const photoIdentifiers = subUTADData[i][photoIdentifiersIndex]
                const lineNumber = subUTADData[i][lineNumberIndex];

                if (!(/[a-zA-Z]/).test(catalogNumber.charAt(0))) {  
                    prefix = institutionCode + '-' + collectionCode + '-'
                    
                } else {
                    prefix = ''
                }
                cell1.innerHTML =  `<a id="object-link" href="${museumURLPath}/object/?id=${catalogNumber}&samling=${sessionStorage.getItem('chosenCollection')}&museum=${museum}&lang=${sessionStorage.getItem('language')}&linjeNummer=${lineNumber}"> ${prefix}${catalogNumber} </a>`
                cell2.innerHTML = vernacularName
                cell3.innerHTML = tilstand
                cell4.innerHTML = basisOfRecord
                cell5.innerHTML = kommentar
                cell6.innerHTML = bredde
                cell7.innerHTML = høyde
                cell8.innerHTML = lengde
                if( associatedMedia ) {   
                    cell9.innerHTML = `<span class="fas fa-camera"></span>`
                } else if( photoIdentifiers) {   
                    cell9.innerHTML = `<span class="fas fa-camera"></span>`
                }
                cell10.innerHTML = `<input type="checkbox" id=checkbox${i} onclick="registerChecked(${i})" ></input>`
                if (investigateChecked(i)) {
                    document.getElementById(`checkbox${i}`).checked = true
                } else {
                    document.getElementById(`checkbox${i}`).checked = false
                }
                cell1.className = 'row-1 row-ID'
                cell2.className = 'row-2 row-name'
                cell3.className = 'tilstand'
                cell4.className = 'sampleType'
                cell5.className = 'kommentar'
                // cell7.className = 'row-7 row-sted'
                // cell8.className = 'row-8 row-sted'
                cell9.className = 'row-9 row-photo'
                cell10.className = 'row-11 row-checkbox'
            }
            // let isLoan = activateLoanButton()
            showResultElements()
            document.getElementById("empty-search-button").style.display = "inline-block"
            numberOfPages = getNumberOfPages(numberPerPage)
        }
    } catch (error) {
        console.log('UTADRestultTable error');
        
        console.log(error);
        errorMessage.innerHTML = textItems.errorRenderResult[index]
    }
    const select = document.getElementById('checkboxSelect')
    if(select) {
        select.onchange =() => {
            checkSeveralBoxes(subUTADData)
        }
    }
}

const eco_BotRestultTable = (subEco_BotData, eco_BotData) => {
    
    try {

        const headers = eco_BotData[0]
        const catalogNumberIndex = headers.indexOf('catalogNumber');
        const institutionCodeIndex = headers.indexOf('institutionCode');
        const collectionCodeIndex = headers.indexOf('collectionCode');
        const lineNumberIndex = headers.indexOf('lineNumber');
        const scientificNameIndex = headers.indexOf('scientificName')
        const taxaIndex = headers.indexOf('higherClassification')
        const localityIndex = headers.indexOf('locality')
  
        const tilstandIndex = headers.indexOf('Tilstand');
        const basisOfRecordIndex = headers.indexOf('basisOfRecord');
        const associatedMediaIndex =  headers.indexOf('associatedMedia');
        const kommentarIndex = headers.indexOf('Kommentar');
        const recordedByIndex =  headers.indexOf('recordedBy');
        const eventDateIndex = headers.indexOf('eventDate');



        table.innerHTML = ""
        const row = table.insertRow(-1);
        for (let i = -1; i < pageList.length; i++) {
            if (i === -1) {     // her kommer tittellinjen
                const headerRow = row;
                const headerCell = []
                for (let j = 0; j < 11; j++) {
                    headerCell.push(headerRow.appendChild(document.createElement("th")))
                }

                
                headerCell[8].className += "tilstand"
                headerCell[5].className += "sampleType"
                headerCell[9].className += "kommentar"
                headerCell[5].className += "cell6"
                headerCell[10].className += "cell10"
                
                fillResultHeadersEco_bot(headerCell,eco_BotData)

            }  else {  //her kommer tabell innholdet
            const row = table.insertRow(-1)
            const cell1 = row.insertCell(0)
            const cell2 = row.insertCell(1)
            const cell3 = row.insertCell(2)
            const cell4 = row.insertCell(3)
            const cell5 = row.insertCell(4)
            const cell6 = row.insertCell(5)
            const cell7 = row.insertCell(6)
            const cell8 = row.insertCell(7)
            const cell9 = row.insertCell(8)
            const cell10 = row.insertCell(9)
            const cell11 = row.insertCell(10)
 
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

                let prefix = ''
                const institutionCode = subEco_BotData[i][institutionCodeIndex]
                const collectionCode = subEco_BotData[i][collectionCodeIndex]
                const catalogNumber = subEco_BotData[i][catalogNumberIndex];
                const lineNumber = subEco_BotData[i][lineNumberIndex];
                const tilstand = subEco_BotData[i][tilstandIndex];
                const basisOfRecord = subEco_BotData[i][basisOfRecordIndex];
                const kommentar = subEco_BotData[i][kommentarIndex];
                const associatedMedia = subEco_BotData[i][associatedMediaIndex]

                const scientificName = subEco_BotData[i][scientificNameIndex];
                const higherClassification = subEco_BotData[i][taxaIndex];
                const locality = subEco_BotData[i][localityIndex];
                const recordedBy = subEco_BotData[i][recordedByIndex];
                const eventDate = subEco_BotData[i][eventDateIndex];

        


        
                if (!(/[a-zA-Z]/).test(catalogNumber.charAt(0))) {  
                    prefix = institutionCode + '-' + collectionCode + '-'
                    
                } else {
                    prefix = ''
                }
                cell1.innerHTML =  `<a id="object-link" href="${museumURLPath}/object/?id=${catalogNumber}&samling=${sessionStorage.getItem('chosenCollection')}&museum=${museum}&lang=${sessionStorage.getItem('language')}&linjeNummer=${lineNumber}"> ${prefix}${catalogNumber} </a>`
                cell2.innerHTML = scientificName
                cell3.innerHTML = higherClassification
                cell4.innerHTML = locality
                cell5.innerHTML = basisOfRecord
                cell6.innerHTML = recordedBy
                cell7.innerHTML = eventDate
                cell8.innerHTML = tilstand
                cell9.innerHTML = kommentar






                if( subEco_BotData[i].associatedMedia ) {   
                    cell10.innerHTML = `<span class="fas fa-camera"></span>`
                } else if( subEco_BotData[i].photoIdentifiers ) {   
                    cell10.innerHTML = `<span class="fas fa-camera"></span>`
                }
                cell11.innerHTML = `<input type="checkbox" id=checkbox${i} onclick="registerChecked(${i})" ></input>`
                if (investigateChecked(i)) {
                    document.getElementById(`checkbox${i}`).checked = true
                } else {
                    document.getElementById(`checkbox${i}`).checked = false
                }
                cell1.className = 'row-1 row-ID'
                cell2.className = 'row-2 row-name'
                cell8.className = 'tilstand'
                cell5.className = 'sampleType'
                cell9.className = 'kommentar'
                // cell7.className = 'row-7 row-sted'
                // cell8.className = 'row-8 row-sted'
                cell10.className = 'row-9 row-photo'
                cell11.className = 'row-11 row-checkbox'
            }
            // let isLoan = activateLoanButton()
            showResultElements()
            document.getElementById("empty-search-button").style.display = "inline-block"
            numberOfPages = getNumberOfPages(numberPerPage)
        }
    } catch (error) {
        console.log('eco_BotRestultTable error');
        
        console.log(error);
        errorMessage.innerHTML = textItems.errorRenderResult[index]
        searchFailed = true // is checked when map is drawn 
    }
    const select = document.getElementById('checkboxSelect')
    if(select) {
        select.onchange =() => {
            checkSeveralBoxes(subEco_BotData)
        }
    }
}


const bulkResultTable = (subBulkData, bulkData) => {
    try {
        const headers = bulkData[0]
        
        const scientificNameIndex = headers.indexOf('scientificName')
        const catalogNumberIndex = headers.indexOf('catalogNumber');
        const institutionCodeIndex = headers.indexOf('institutionCode');
        const collectionCodeIndex = headers.indexOf('collectionCode');
        const recordedByIndex = headers.indexOf('recordedBy');
        const eventDateIndex = headers.indexOf('eventDate');
        const PreparationsIndex = headers.indexOf('Preparations')
        const stateProvinceIndex = headers.indexOf('stateProvince')
        const localityIndex = headers.indexOf('locality');
        const countryIndex = headers.indexOf('country');
        const cupboardIndex = headers.indexOf('cupboard');
        const roomIndex = headers.indexOf('room');
        const buildingIndex = headers.indexOf('building');
        const individualCountIndex = headers.indexOf('individualCount');
        const noteIndex = headers.indexOf('Note');


        table.innerHTML = ""
        const row = table.insertRow(-1);
        for (let i = 0; i < pageList.length; i++) { // vis en tabell med resultater som er like lang som det vi ba om pageList.length; 
            if (i === 0) {     // her kommer tittellinjen
                const headerRow = row;
                const headerCell = []
                for (let j = 0; j < 9; j++) {
                    headerCell.push(headerRow.appendChild(document.createElement("th")))
                }
                headerCell[2].className += "innsamler"
                headerCell[3].className += "dato"
                headerCell[4].className += "sampleType"
                
                fillResultHeadersBulk(headerCell,bulkData)

            }  else {  
                const row = table.insertRow(-1)
                const cell1 = row.insertCell(0)
                const cell2 = row.insertCell(1)
                const cell3 = row.insertCell(2)
                const cell4 = row.insertCell(3)
                const cell5 = row.insertCell(4)
                const cell6 = row.insertCell(5)
                const cell7 = row.insertCell(6)
                const cell8 = row.insertCell(7)
                // const cell9 = row.insertCell(8)
                const cell11 = row.insertCell(8)
      // Her kommer innmaten i tabellen, selve resultatene

                
                let prefix
                const institutionCode = subBulkData[i][institutionCodeIndex]
                const collectionCode = subBulkData[i][collectionCodeIndex]
                const catalogNumber = subBulkData[i][catalogNumberIndex];
                const scientificName = subBulkData[i][scientificNameIndex];
                const recordedBy = subBulkData[i][recordedByIndex];
                const eventDate = subBulkData[i][eventDateIndex];
                const Preparations = subBulkData[i][PreparationsIndex];
                const stateProvince = subBulkData[i][stateProvinceIndex];
                const locality = subBulkData[i][localityIndex];
                const country = subBulkData[i][countryIndex];
                const cupboard = subBulkData[i][cupboardIndex];
                const room = subBulkData[i][roomIndex];
                const building = subBulkData[i][buildingIndex];
                const individualCount = subBulkData[i][individualCountIndex];
                const note = subBulkData[i][noteIndex];

                if (!(/[a-zA-Z]/).test(catalogNumber.charAt(0))) {
                    
                    prefix = institutionCode + '-' + collectionCode + '-'
                } else {
                    prefix = ''
                }

                cell1.innerHTML =  prefix + catalogNumber
                cell2.innerHTML = scientificName
                cell3.innerHTML = recordedBy
                cell4.innerHTML = eventDate
                cell5.innerHTML = Preparations
                
                function concatWithCommas(...args) {
                    // Filter out undefined or empty values and join them with a comma
                    return args.filter(Boolean).join(', ');
                }
                
                // Concatenating location details
                const concatLocality = concatWithCommas(country, stateProvince, locality);
                cell6.innerHTML = concatLocality;
                
                // Concatenating placement details
                const placement = concatWithCommas(building, room, cupboard);
                cell7.innerHTML = individualCount;
                cell8.innerHTML = note;
                // cell9.style.display = 'none'
                cell11.innerHTML = `<input type="checkbox" id=checkbox${i} onclick="registerChecked(${i})" ></input>`
                if (investigateChecked(i)) {
                    document.getElementById(`checkbox${i}`).checked = true
                } else {
                    document.getElementById(`checkbox${i}`).checked = false
                }
                
                cell1.className = 'row-1 row-ID'
                cell2.className = 'row-2 row-bulk-name'
                cell3.className = 'innsamler'
                cell4.className = 'dato'
                cell5.className = 'sampleType'
                cell6.className = 'row-6 row-bulk-sted'
                cell7.className = 'row-7 row-placement'
                cell8.className = 'row-8 row-note'
                cell11.className = 'row-11 row-checkbox'
            }
        }
        
        showResultElements()
        document.getElementById("empty-search-button").style.display = "inline-block"
        numberOfPages = getNumberOfPages(numberPerPage)
    }  
    catch(error) {
        errorMessage.innerHTML = textItems.errorRenderResult[index] 
        console.log(error);
        
    }

    const select = document.getElementById('checkboxSelect')
    if(select) {
        select.onchange =() => {
            checkSeveralBoxes(subBulkData)
        }
    }
}

// pagination part
// https://www.thatsoftwaredude.com/content/6125/how-to-paginate-through-a-collection-in-javascript

let list = new Array();
let pageList = new Array();

if (sessionStorage.getItem('currentPage')) {
    currentPage = sessionStorage.getItem('currentPage')
} else {
    currentPage = 1
}
let numberPerPage
if (sessionStorage.getItem('numberPerPage')) {
    numberPerPage = sessionStorage.getItem('numberPerPage')
} else {
    numberPerPage = 20
}


sessionStorage.setItem('numberPerPage',numberPerPage)
var numberOfPages = 0; // calculates the total number of pages

// fetches search result from session storage, parse it and calculates number of pages to render
function makeList() {
    list.length = 0; // tømme Array
    stringData = sessionStorage.getItem('string')
    // parsing search result
    list = JSON.parse(stringData)   
    numberOfPages = getNumberOfPages(numberPerPage);
}

// returns numberOfPages for rendering results
// out: numberOfPages (number, numberOfPages for rendering results)
// is called by makeList()
//	hitsPerPage-select.eventlistener
//	resultTable(..)
function getNumberOfPages(numberPerPage) {
    return Math.ceil(list.length / numberPerPage);
}

// increases counter for currentPage for rendering results, if necessary puts text in html-element lastPageAlert
// calls load()
// is called in index.hbs when nextPage-button is created
function nextPage() {
    if (currentPage < numberOfPages) {
        currentPage += 1    
        sessionStorage.setItem('currentPage', currentPage)
        load()
    } else {
        document.getElementById("resultPageAlert").innerHTML = textItems.lastPageAlert[index]
    }
}

// decreases counter for currentPage for for rendering results
// calls load()
// is called in index.hbs when previousPage-button is created
function previousPage() {
    currentPage -= 1;
    sessionStorage.setItem('currentPage', currentPage)
    load()
}

// sets currentPage for rendering results
// calls load()
// is called in index.hbs when firstPage-button is created
function firstPage() {
    currentPage = 1;
    sessionStorage.setItem('currentPage', currentPage)
    load()
}

// sets currentPage for rendering results
// calls load()
// is called in index.hbs when lastPage-button is created
function lastPage() {
    currentPage = numberOfPages;
    sessionStorage.setItem('currentPage', currentPage)
    load()
}

// sets sessionStorage’s pageList (part of result that is to be rendered on page) and calls function(s) that render resultTable
// calls check()
//  resultTable(pageList, list)
// is called by
//  hitsPerPage eventlistener
//  load()
function loadList() {
    const begin = ((currentPage - 1) * numberPerPage)
    const end = Number(begin) + Number(numberPerPage)
    pageList = list.slice(begin, end)
    sessionStorage.setItem('pageList', JSON.stringify(pageList)) // pageList is the same as subMusitData other places; the part of the search result that is listed on the current page
    if (document.querySelector('#collection-select').value == 'bulk') {
        bulkResultTable(pageList, list)
    } else if (document.querySelector('#collection-select').value === 'utad') {
        UTADRestultTable(pageList, list)
    } else if (document.querySelector('#collection-select').value === 'eco_bot') {
        eco_BotRestultTable(pageList, list)
    } else {
        resultTable(pageList, list)
    }
    check();
}

// disables page-buttons if necesary
// is called by loadList()
function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("next1").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous1").disabled = currentPage == 1 ? true : false;
    document.getElementById("first1").disabled = currentPage == 1 ? true : false;
    document.getElementById("last1").disabled = currentPage == numberOfPages ? true : false;

}

// empties search-result, fetches search result from sessionStorage, sets numberOfPages for rendering of results, calls function that call resultTable and sets sessionStorage’s pagelist (what to rendered on page)
// calls getNumberOfPages(..)
//	loadList()
//	is called by nextPage(), previousPage(), firstPage(), lastPage()
function load() {
    list.length = 0 // tømme Array
    stringData = sessionStorage.getItem('string')
    // parsing search result
    list = JSON.parse(stringData)   
    numberOfPages = getNumberOfPages(numberPerPage)
    
    loadList()
    mainLoan()
}

hitsPerPage.addEventListener('change', (e) => {
    e.preventDefault()
    if (hitsPerPage.value < 2000){
        numberPerPage = hitsPerPage.value
        numberPerPage = numberPerPage - 0 // to make it a number
        numberOfPages = getNumberOfPages(numberPerPage)
    } else {
        numberPerPage = 2000
        numberOfPages = 1
    }
    currentPage = 1
    sessionStorage.setItem('numberPerPage', numberPerPage)
    
    loadList()
})  

// check if checkbox should be checked when rendering result (i.e. navigating between pages in search result)
// in: i (number; index for searchresult-array)
// out: boolean (true if box should be checked)
// is called by resultTable()
const investigateChecked = (i) => {
    let searchResult = JSON.parse(sessionStorage.getItem('string'))
        let searchResultIndex = i + ((currentPage -1 ) * numberPerPage)
            if (searchResult[searchResultIndex].checked) {
                return true
            } else {
                return false
            }
}

// when checking off a checkbox:
// registers that a (single) checkbox is checked or unchecked
// in: i (number, index for searchresult-array)
// out: boolean (true if box should be checked)
// is called by resultTable() for each record
const registerChecked = (i) => {
    //document.getElementById('checkboxSelect').value = 'select'
    let searchResult = JSON.parse(sessionStorage.getItem('string'))
    let searchResultIndex = i + ((currentPage -1 ) * numberPerPage)
        if (searchResult[searchResultIndex].checked) {
            searchResult[searchResultIndex].checked = false
        } else {
            searchResult[searchResultIndex].checked = true
        }
    sessionStorage.setItem('string', JSON.stringify(searchResult))
}

