

const gbifAPI = (key, catalogNumber) =>  {
    const url = 'https://api.gbif.org/v1/occurrence/search?datasetKey=' + key + '&catalogNumber=' + catalogNumber
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('GBIF Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

const getKey = (museum, samling) => {
    console.log(museum, samling);
    const key = GBifIdentifiers[museum][samling].key
    console.log(key);
    return key

}


gbifAPI(getKey('nhm', 'Entomolgy'),100)