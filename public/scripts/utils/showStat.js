// Renders content in journaler.js

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
let langIndex
if (language === "Norwegian") {
  langIndex = 0
} else if (language === "English") {
  langIndex = 1
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

// show collections in select dependent on museum
if(!window.location.href.includes('/nhm')) {
  document.querySelector('#coremaopt').style.display = 'none'
  document.querySelector('#DNAopt').style.display = 'none'
  document.querySelector('#alger').style.display = 'none'
  document.querySelector('#GeoPalOpt').style.display = 'none'
  document.querySelector('#algae_row').style.display = 'none'
  document.querySelector('#mammal_row').style.display = 'none'
  document.querySelector('#bird_row').style.display = 'none'
  //document.querySelector('#malmer_row').style.display = 'none'
  //document.querySelector('#oslofeltet_row').style.display = 'none'
  //document.querySelector('#utenlandskeBA_row').style.display = 'none'
  

} else {
  document.querySelector('#evertebrater').style.display = 'none'
  document.querySelector('#evertebrat_row').style.display = 'none'
}

//puts data into the statistics-table with key value from each collection
// in: data (JSON object with data from the collections)
const populateTable = (data) => {
  try {
    // karplanter    
    document.getElementById('Karplanter_n').textContent = data.karplanter[3].collectionSize.format(0,3,' ')
    document.getElementById('Karplanter_foto').textContent = data.karplanter[5].media.stillImage.format(0,3,' ')
    document.getElementById('Karplanter_koord').textContent = data.karplanter[1].geography.coordinates[0].yes.format(0,3,' ')
    // Moser
    document.getElementById('Moser_n').textContent = data.moser[3].collectionSize.format(0,3,' ')
    document.getElementById('Moser_foto').textContent = data.moser[5].media.stillImage.format(0,3,' ')
    document.getElementById('Moser_koord').textContent = data.moser[1].geography.coordinates[0].yes.format(0,3,' ')
    // Sopp
    document.getElementById('Sopp_n').textContent = data.sopp[3].collectionSize.format(0,3,' ')
    document.getElementById('Sopp_foto').textContent = data.sopp[5].media.stillImage.format(0,3,' ')
    document.getElementById('Sopp_koord').textContent = data.sopp[1].geography.coordinates[0].yes.format(0,3,' ')
    // Lav
    document.getElementById('Lav_n').textContent = data.lav[3].collectionSize.format(0,3,' ')
    document.getElementById('Lav_foto').textContent = data.lav[5].media.stillImage.format(0,3,' ')
    document.getElementById('Lav_koord').textContent = data.lav[1].geography.coordinates[0].yes.format(0,3,' ')
    // Insekter
    document.getElementById('Insekter_n').textContent = data.entomologi[3].collectionSize.format(0,3,' ')
    document.getElementById('Insekter_foto').textContent = data.entomologi[5].media.stillImage.format(0,3,' ')
    document.getElementById('Insekter_koord').textContent = data.entomologi[1].geography.coordinates[0].yes.format(0,3,' ')
    
    if (window.location.href.includes('/nhm')) {
      console.log(data)
      // Alger
      document.getElementById('Algae_n').textContent = data.alger[3].collectionSize.format(0,3,' ')
      document.getElementById('Algae_foto').textContent = data.alger[5].media.stillImage.format(0,3,' ')
      document.getElementById('Algae_koord').textContent = data.alger[1].geography.coordinates[0].yes.format(0,3,' ')
      // Fugler
      document.getElementById('Fugler_n').textContent = data.birds[3].collectionSize.format(0,3,' ')
      document.getElementById('Fugler_foto').textContent = data.birds[5].media.stillImage.format(0,3,' ')
      document.getElementById('Fugler_koord').textContent = data.birds[1].geography.coordinates[0].yes.format(0,3,' ')
      // Pattedyr
      document.getElementById('Pattedyr_n').textContent = data.mammals[3].collectionSize.format(0,3,' ')
      document.getElementById('Pattedyr_foto').textContent = data.mammals[5].media.stillImage.format(0,3,' ')
      document.getElementById('Pattedyr_koord').textContent = data.mammals[1].geography.coordinates[0].yes.format(0,3,' ')
      // // Malmer
      // document.getElementById('malmer_n').textContent = data.malmer[3].collectionSize.format(0,3,' ')
      // document.getElementById('malmer_foto').textContent = data.malmer[5].media.stillImage.format(0,3,' ')
      // document.getElementById('malmer_koord').textContent = data.malmer[1].geography.coordinates[0].yes.format(0,3,' ')
      // // Bergarter Oslofeltet
      // document.getElementById('oslofeltet_n').textContent = data.oslofeltet[3].collectionSize.format(0,3,' ')
      // document.getElementById('oslofeltet_foto').textContent = data.oslofeltet[5].media.stillImage.format(0,3,' ')
      // document.getElementById('oslofeltet_koord').textContent = data.oslofeltet[1].geography.coordinates[0].yes.format(0,3,' ')
      // // utenlandske bergarter
      // document.getElementById('utenlandskeBA_n').textContent = data.utenlandskeBA[3].collectionSize.format(0,3,' ')
      // document.getElementById('utenlandskeBA_foto').textContent = data.utenlandskeBA[5].media.stillImage.format(0,3,' ')
      // document.getElementById('utenlandskeBA_koord').textContent = data.utenlandskeBA[1].geography.coordinates[0].yes.format(0,3,' ')

    } else {
      // Evertebrater
      document.getElementById('Evertebrater_n').textContent = data.evertebrater[3].collectionSize.format(0,3,' ')
      document.getElementById('Evertebrater_foto').textContent = data.evertebrater[5].media.stillImage.format(0,3,' ')
      document.getElementById('Evertebrater_koord').textContent = data.evertebrater[1].geography.coordinates[0].yes.format(0,3,' ')
    }
    
    
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
  let koordintLabels = ['Yes', 'No']
  let koordinatData = [data[currentCollection][1].geography.coordinates[0].yes,data[currentCollection][1].geography.coordinates[1].no]
  return [koordintLabels, koordinatData]
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
  let andelNorgelabels = ['Norge', 'Verden']
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
          label: 'Tilvekst per år (som er registert i databasen)',
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
          label: 'Akkumulativ samlingstørrelse',
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
      text: 'Georefererte poster', //textItems.nbCoordHeader[langIndex],
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
      text: 'Andelen poster fra Norge'
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
          label: 'Objekter per land (top 20) untatt Norge',
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


// async function; renders the page the first time
// calls makeGraphs(..) and	populateTable(..)
// is called in this file (showStat.js)
async function main() {
  data = await getData() //Gjør en request til server omå få JSON datafila
  makeGraphs(data)  // Tegn opp grafene for første gang
  populateTable(data) // Lag hovedtabel med samlingstall
}

main()