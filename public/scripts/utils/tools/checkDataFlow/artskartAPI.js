const artskartAPI = (prefix, catalogNumber) => {
    prefix = prefix.toLowerCase()
    const url = 'https://artskart.artsdatabanken.no/PublicApi/api/observations/?id=' + prefix + catalogNumber //; urn:catalog:NHMO:ENT:8'
    fetch(url, {
        headers: {
          'Accept': 'text/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('Artskart Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}



const getPrefix = (museum, samling) => {
    const prefix = GBifIdentifiers[museum][samling].OccurrenceID
    return prefix

}

getPrefix('nhm','Entomolgy')

artskartAPI(getPrefix('nhm','Entomolgy'), 100)