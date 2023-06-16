const gbifKeys = require('../dataObject')
const museum = 'nhm'

const collectionKey ='e45c7d91-81c6-4455-86e3-2965a5739b1f'

const  getItemsPerYear = async (data, year) =>{
    const pubObj = {}
    return data.count
}

const fetchData = async (gbifKey) => {
    const currentYear = new Date().getFullYear()
    const publicationObject = {}
    try {
        for (let index = 0; index < 6; index++) {
            let year = currentYear - index
            //https://api.gbif.org/v1/literature/search?gbifDatasetKey=e45c7d91-81c6-4455-86e3-2965a5739b1f&year=2019
            const response = await fetch('https://api.gbif.org/v1/literature/search?gbifDatasetKey=' + gbifKey + '&year=' + year + '&limit=0');
            const data = await response.json();    
            if(data){
                console.log(year);
                publicationObject[year] = await getItemsPerYear(data, year)
            }
        }
        return publicationObject
    } catch (error) {
        console.log(error);
        return error
    }
}

const getPublications = async (museum, samling) => {
    console.log('getting pubs');
    let publicationArray = []
    const collectionObj = {}
    const keyObj =  gbifKeys[0][museum]
    for (const key in gbifKeys[0][museum]) {
        const collectionName = key
        const gbifKey = gbifKeys[0][museum][key].key;
        publicationArray = await fetchData(gbifKey)
        collectionObj[key] = publicationArray
    }
    console.log(collectionObj);
}

getPublications(museum)