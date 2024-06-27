// Renders content in showStat.hbs

const collection = document.querySelector('#collection-select') 

// Set default collection til totalobjektet
let currentCollection = 'total'
let data = "" // make data a global vaiable

let ctx = ""
let config = ""
let chart = ""

let ctx2 = ""
let config2 = ""
let chart2 = ""

let ctx3 = ""
let config3 = ""
let chart3 = ""

let ctx4 = ""
let config4 = ""
let chart4 = ""

let ctx5 = ""
let config5 = ""
let chart5 = ""

// for rendering language - not yet implemented (Aug 2020) - texts in graphs are in norwegian
let langIndex = 0
const getLanguage = () => {
  if (language === "Norwegian") {
    langIndex = 0
  } else if (language === "English") {
    langIndex = 1
  }
}




// formate numbers
// in: integer n: length of decimal
// in: integer x: length of whole part
// in: mixed s: sections delimiter
// in: mixed c: decimal delimiter
// is called in populateTable(..)
Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
      num = this.toFixed(Math.max(0, ~~n));
  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}




// populate dropdown with list of collections
const collSelect = (data) => {
  const selectElement = document.getElementById('collection-select');
  const collections = data.total[3].collections.collectionsIncluded
  for (let i = 0; i < collections.length; i++) {
    selectElement.add(new Option(collections[i]));
  }
}

function addTextInCollSelect(a) {
  const collections = {
    moser: textItems.moser,
    vascular: textItems.vascular,
    Vascular_plants: textItems.vascular,
    lav: textItems.lav,
    alger: textItems.alger,
    alge: textItems.alger,
    entomology: textItems.insekter,
    evertebrater: textItems.invertebrates,
    invertebrates_with_dna: textItems.invertebrates_with_dna,
    fisk: textItems.fisk,
    birds: textItems.fugler,
    mammals: textItems.pattedyr,
    mammals_no_dna: textItems.bcPattedyr,
    dna_vascular: textItems.dna_vascular,
    dna_fungi_lichens: textItems.fungiLichens,
    dna_entomology: textItems.dna_insekter,
    dna_fish_herptiles: textItems.fishHerp,
    sopp: textItems.sopp,
    dna_other: textItems.other,
    malmer: textItems.malmer,
    oslofeltet: textItems.oslofeltet,
    utenlandskeBergarter: textItems.utenlandskeBA,
    mineraler: textItems.mineraler,
    fossiler: textItems.paleontologi,
    palTyper: textItems.palTyper,
    utad: textItems.utad,
    bulk: textItems.bulk,
    crustacea: textItems.crustacea,
    insectTypes: textItems.insectTypes
  };
  return collections[a][langIndex];
}

const populateTable = (data) => {
try {
    const allCollections = data.total[3].collections.collectionsIncluded
    const  collections = [...new Set(allCollections)]; // remove duplicates
    const table = document.querySelector('#statTable');
    const dnaArray = collections.filter(item => item.includes("dna"));
    const botanyArray = collections.filter(item =>  ["vascular", "alger", "moser", "alge",  "lav", "sopp"].includes(item));
    const zoologyArray = collections.filter(item => ["entomology", "mammals", "Fisk", "birds", "crustacea", "invertebrater", "evertebrater"].includes(item));
    const earthSciencesArray = collections.filter(item => ["mineraler", "malmer", "utenlandskeBergarter", "oslofeltet", "palTyper", "fossiler", "utad", "bulk"].includes(item));
    // getLanguage()
    const addRows = (array, color) => {
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        const row = table.insertRow();

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
// console.log(element);
        cell1.textContent = addTextInCollSelect(element)
        cell1.style = 'text-align: left';
        cell1.style.backgroundColor = color; // Set row color
        cell2.style.backgroundColor = color; // Set row color
        cell3.style.backgroundColor = color; // Set row color
        cell4.style.backgroundColor = color; // Set row color
        if (data[element][3].collectionSize) {
          cell2.textContent = data[element][3].collectionSize.format(0, 3, ' ');
        }
        if (data[element][5].media.stillImage) {
          cell3.textContent = data[element][5].media.stillImage.format(0, 3, ' ');
        }
        if (data[element][1].geography.coordinates[0].yes) {
          cell4.textContent = data[element][1].geography.coordinates[0].yes.format(0, 3, ' ');
        }
      }
      // row.style.backgroundColor = color; // Set row background color
    };

    
    addRows(botanyArray, "#D8F5CB");
    addRows(zoologyArray, "#CBDBF5");
    addRows(dnaArray, "#F3F5CB");
    addRows(earthSciencesArray, "#F8CAA3");

    table.setAttribute("class", "summaryTable");
  } catch (error) {
    console.log(error);
  }
}



// sorts array with data
// in: arrayData (array [{label:value, data:value}, {label:value, data:value}]
// in: by (string, label or data (for what will be sorted by))
// in:  ascOrDes (string, ‘asc’, for ascending sort, smalletst to largest) or ‘des’ for descending sort) 
// out: sorted Array 
// is called by tilvekstData(..)
//    accumulativeCollectionsSize(…)
//    top20Land(..)
const sortData = (arrayData, by, ascOrDes) => {
  if (ascOrDes === 'asc'){
  arrayData.sort((a,b) => (a[by] > b[by]) ? 1 : ((b[by] > a[by]) ? -1 : 0)); 
  } else {
    arrayData.sort((a,b) => (a[by] < b[by]) ? 1 : ((b[by] < a[by]) ? -1 : 0));
  }
  return arrayData
}

// returns labels and data for yearly growth to the different graphs
// in: data (JSON file with collection data)
// in: currentCollection (string, which collection to be shown (from dropdown-menu))
// out: an array with labels and data for yearly growth, e.g aarligTilvekst[0] = labels og  aarligTilvekst[1]= data
// calls sortData(..)
// is called by o	makeGraphs(..) and updateGraph()
const tilvekstData = (data, currentCollection) =>  {
  // https://stackoverflow.com/questions/44990517/displaying-json-data-in-chartjs
  year = sortData(data[currentCollection][0].collectionEvent.year, 'year', 'asc')
  const yearLabels = year.map(function(e) {
    return e.year;
  });
  const yearData = year.map(function(e) {
    return e.number;
  });
  return [yearLabels, yearData]
}

// returns label and data for accumulative numbers
// in: data (JSON file with collection data)
// in: currentCollection (string, which collection to be shown (from dropdown-menu))
// out: an array with labels and data for accumulative data
// calls sortData(..)
// is called by makeGraphs(..) and updateGraph()
const accumulativeCollectionSize = (data, currentCollection) => {
  accumulativeSize = sortData(data[currentCollection][3].accumulativeSize.filter(Boolean), 'year', 'asc') // fjerner tomme verdier
  const accumulativeSizeLabels = accumulativeSize.map(function(e) {
    return e.year;
  });
  const accumulativeSizeData = accumulativeSize.map(function(e) {
    return e.number;
  });
  return [accumulativeSizeLabels, accumulativeSizeData]
}


// returns label and data for top 20 countires except Norway
// in: data (JSON file with collection data)
// in: currentCollection (string, which collection to be shown (from dropdown-menu))
// out: an array with labels and data for top 20 countires except Norway
// calls sortData()
// is called by makeGraphs(..) and updateGraph()
const top20Land = (data, currentCollection) => {
  // make deep copy
  country = data[currentCollection][1].geography.country
  country = sortData(country, 'number', 'des')
  country = JSON.parse(JSON.stringify(country))

  // Fjerne Norge fra dataene
  // fjerne tomme land, e.g der lang er ukjent
    for (let i =1; i < country.length; i++) {
    if (country[i].country.length < 1) {
      country.splice(i,1);
      break
    }
  }
  // fjern Norge fra lista da den utgjør over 80% av dataene
  for (let i =0; i < country.length; i++) {
    if (country[i].country === 'Norway') {
      country.splice(i,1);
      break
    }
  }
  // lag labels
  const countryLabels = country.map(function(e) {
    for (let index = 0; index < 5; index++) {
          return e.country;
      }
  });
  // lag data
    const countryData = country.map(function(e) {
        for (let index = 0; index < 5; index++) {
          return e.number;
        }
  });
  return [countryLabels,countryData ]
}

// returns label and data for coordinate pie?
// in: data (JSON file with collection data)
// in: currentCollection (string, which collection to be shown (from dropdown-menu))
// out: an array with labels and data for coordinate pie?
// is called by makeGraphs(..) updateGraph()
const harKoordinater = (data, currentCollection) => {
  let koordinatLabels
  if (langIndex === 0) {koordinatLabels = ['Ja', 'Nei']} else {koordinatLabels = ['Yes', 'No']}
  let koordinatData = [data[currentCollection][1].geography.coordinates[0].yes,data[currentCollection][1].geography.coordinates[1].no]
  return [koordinatLabels, koordinatData]
}

// returns label and data for Norwegian data
// in: data (JSON file with collection data)
// in: currentCollection (string, which collection to be shown (from dropdown-menu))
// out: an array with labels and data for Norwegian data
// is called by makeGraphs(..) and updateGraph()
const fraNorge = (data, currentCollection) => {
  for (let index = 0; index < data[currentCollection][1].geography.country.length; index++) {
    if (data[currentCollection][1].geography.country[index].country === 'Norway')
    norske = data[currentCollection][1].geography.country[index].number  
    break
  }     
  restenAvVerden = data[currentCollection][3].collectionSize - norske // alle poster minus de fra Norge
  let andelNorgelabels
  if (langIndex === 0) {andelNorgelabels = ['Norge', 'Verden']} else {andelNorgelabels = ['Norway', 'The world']}
  let andelNorgedata = [norske, restenAvVerden]
  return [andelNorgelabels, andelNorgedata]
}

// sends request to backend to fetch data
// is called by main()
const getData = () => {
  return new Promise(resolve => {
  // const url = urlPath + '/tmu/showStat?getStat=true'
  // fetch(url).then((response) => { 
  //   response.text().then((data) => {
  //     if(data.error) {
  //         return console.log(data.error)
  //     } 
  //     else {          
  //       try {
  //         // statData.json er dobbelt strigifyed så derfor dobbel parse
  //         data = JSON.parse(data)
  //         data = JSON.parse(data.unparsed)
  //         resolve(data)
  //       } catch (error) {
  //         console.log(error);
  //       }
   // let museumURLPath
      if (window.location.href.includes('/um')) { 
          museum =  "um"
      } else if (window.location.href.includes('/tmu')) {
          museum =  "tmu"
      } else if (window.location.href.includes('/nbh')) {
        museum =  "nbh"
    } else {
          museum = "nhm"
      }
                
    //const url = urlPath + '/search/?search=' + searchTerm + '&museum=' + museum + '&samling=' + chosenCollection + '&linjeNumber=0' + '&limit=' + limit // normal search
    const url =  urlPath + '/showStat/?getStat=true&museum=' + museum
    
    fetch(url).then((response) => { 
      response.text().then((data) => {
        if(data.error) {
            return console.log(data.error)
        } 
        else {          
          try {
            // statData.json er dobbelt stringified så derfor dobbel parse
            data = JSON.parse(data)
            data = JSON.parse(data.unparsed)
            resolve(data)
          } catch (error) {
            console.log(error);
          }
        }
      })
    })
  
  })
}

// makes the graphs
// in: data (JSON file)
// calls tilvekstData(..)
//    accumulativeCollectionSize(..)
//    harKoordinater(..)
//    fraNorge(..)
//    top20Land(..)
// is called by main()
const makeGraphs = (data) => {
// ------ Neste graf -----
  // Tilveksten per år
  aarligTilvekst = tilvekstData(data, currentCollection) //regn ut data til grafen
  ctx = tilvekst.getContext('2d'); // fra HTML sia
  config = {
    type: 'bar',
      options: {
      elements: {
          point: {
            radius: 0
          }
      }
    },
    data: {
        labels: aarligTilvekst[0],
        datasets: [{
          label: textItems.addGrowth[langIndex],
          data: aarligTilvekst[1],
          backgroundColor: 'rgba(0, 119, 204, 0.3)'
        }]
    }
  };
  chart = new Chart(ctx, config); // lag ny graf

// ------ Neste graf -----
  //Akkumulativ samlingsstørrelse
  accumulativeSize = accumulativeCollectionSize(data, currentCollection)
  ctx2 = collSize.getContext('2d');
  config2 = {
    type: 'bar',
    options: {
      elements: {
          point: {
            radius: 0
          }
      }
    },
    data: {
        labels: accumulativeSize[0],
        datasets: [{
          label: textItems.accSize[langIndex],
          data: accumulativeSize[1],
          backgroundColor: 'rgba(0, 119, 204, 0.3)'
        }]
    }
  };
  chart2 = new Chart(ctx2, config2);

// ------ Neste graf -----
  // Med eller uten koordinater
  koordinaterYesNo = harKoordinater(data, currentCollection) //regn ut data til grafen
    ctx3 = georef.getContext('2d');
    config3 = {
  type: 'pie',
    options: {
    title: {
      display: true,
      text: textItems.nbCoordHeader[langIndex],
      align: "left"
    },
    legend: {
      position: "right",
      align: "middle"
    },
  },
    data: {
        labels: koordinaterYesNo[0],
        datasets: [{
          data: koordinaterYesNo[1],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(192, 0, 0, 1)'],
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(192, 0, 0, 0.2)'],
        }]
    }
  };
  chart3 = new Chart(ctx3, config3);

// ------ Neste graf -----
  //Fra Norge
  norske = fraNorge(data, currentCollection)
    ctx5 = andelFraNorge.getContext('2d');
    config5 = {
  type: 'pie',
    options: {
    title: {
      display: true,
      text: textItems.propFromNorway[langIndex],
    }, 
    legend: {
      position: "right",
      align: "middle"
    },
  },
    data: {
        labels: norske[0],
        datasets: [{
          data: norske[1],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(192, 0, 0, 1)'],
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(192, 0, 0, 0.2)'],
        }]
    }
  };
  chart5 = new Chart(ctx5, config5);

// ------ Neste graf -----
  // de 20 vanligste landene
  country20 = top20Land(data, currentCollection)
  ctx4 = populareCountry.getContext('2d');
  config4 = {
  type: 'bar',
    data: {
        labels: country20[0].slice(0,20), // bare de 20 første postene
        datasets: [{
          label: textItems.objPerCountry[langIndex],
          backgroundColor: "rgba(14,72,100,1)", 
          data: country20[1].slice(0,20),
        }]
    }
  };
  chart4 = new Chart(ctx4, config4); 
}


// make new graphs when new collection is chosen
// calls tilvekstData(..)
//    accumulativeCollectionSize(..)
//    harKoordinater(..)
//    fraNorge(..)
//    top20Land(..)
// is called by collection-select.eventlistener
function updateGraph() {
  currentCollection = collection.value

   // Tilveksten per år
   aarligTilvekst = tilvekstData(data, currentCollection)
   config.data.labels = aarligTilvekst[0]
   config.data.datasets[0].data = aarligTilvekst[1]
   chart.update()

  //Akkumulativ samlingsstørrelse
  accumulativeSize = accumulativeCollectionSize(data, currentCollection)
  config2.data.labels = accumulativeSize[0]
  config2.data.datasets[0].data = accumulativeSize[1]
  chart2.update()

  // med eller uten koordinater
  koordinaterYesNo = harKoordinater(data, currentCollection)
  config3.data.labels = koordinaterYesNo[0]
  config3.data.datasets[0].data = koordinaterYesNo[1]
  chart3.update()

  //top20
  country20 = top20Land(data, currentCollection)
  country20 = JSON.parse(JSON.stringify(country20)) // deep copy
  config4.data.labels = country20[0].slice(0,20), // bare de 20 første postene
  config4.data.datasets[0].data = country20[1].slice(0,20), // bare de 20 første postene
  chart4.update()

  // andel fra Norge
  Norske = fraNorge(data, currentCollection)
  config5.data.labels = Norske[0]
  config5.data.datasets[0].data = Norske[1]
  chart5.update()
}

// Når noen bytter samling
collection.addEventListener('change', () => {
  updateGraph()
})


// figures out which museum we are in
// out: string, abbreviation for museum
// is called by doSearch() and updateFooter()
const getCurrentMuseum = () => {
  const pathArray = window.location.pathname.split('/')
  const museum = pathArray[2]
  return museum
}

// sends a request to the server about date of last change of the stat-file and puts data in last-updated-field in footer

const updateStatFooter = () => {
  let museum = getCurrentMuseum()  
  const url =  urlPath + '/footer-date/?&samling=stats&museum=' + museum
  fetch(url).then((response) => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      } else {
          return response.text()
      }
  }).then ((data) => {
      data=JSON.parse(data)
      lastUpdated = textItems.lastUpdated[index] + data.date 
      document.querySelector('#last-updated').textContent = lastUpdated
  }) .catch((error) => {
      console.error('There is a problem, probably file for collection does not exist', error)
  })
}

// async function; renders the page the first time
// calls makeGraphs(..) and	populateTable(..)
// is called in this file (showStat.js)
async function main() {
  getLanguage()
  data = await getData() //Gjør en request til server om å få JSON datafila
  console.log(data)
  collSelect(data)
  makeGraphs(data)  // Tegn opp grafene for første gang
  populateTable(data) // Lag hovedtabel med samlingstall
  updateStatFooter()
}

main()