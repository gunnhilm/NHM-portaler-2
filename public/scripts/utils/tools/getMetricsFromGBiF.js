const selectElement = document.getElementById('collection-select');

const getMuseum = () => {
    const path = window.location.pathname
    const  museum = path.split('/')
    return museum[2]
}

// populate dropdown with list of collections
const addCollectionsToSelect = () => {
    const museum = getMuseum()
    for (const property in GBifIdentifiers[museum]) {
            selectElement.add(new Option(property));
    } 
};


const getMetics = async (museum, samling) => {
    return new Promise(function(resolve, reject) {
        try {
            const table = document.querySelector('#error-results')
            //empty table if  there is already content
            table.innerHTML = ''
            console.log(table);
            const header = ['Issues and flags', 'Count']
            const row = table.insertRow(0)
            row.style = "border: solid"
            const cell1 = row.insertCell(0)
            const cell2 = row.insertCell(1)

            cell1.innerHTML = header[0].bold()
            cell2.innerHTML = header[1].bold()

            const collectionKey = GBifIdentifiers[museum][samling].key
            const issueArray = Object.keys(issues)

            for (let index = 0; index < issueArray.length; index++) {
                fetch('https://api.gbif.org/v1/occurrence/count?datasetKey=' + collectionKey + '&issue=' + issueArray[index])
                .then(response => response.json())
                .then(data => {

                const issueLink = '<a href ="https://www.gbif.org/occurrence/search?dataset_Key=' + collectionKey + '&issue=' + issueArray[index] + '" target="_blank">' + issueArray[index] + '</a>'
                const row1 = table.insertRow(1)
                const cell_1 = row1.insertCell(0)
                const cell_2 = row1.insertCell(1)
                cell_1.innerHTML = issueLink
                cell_2.innerHTML  = data
                }).then(errorsResult => resolve(errorsResult)); 
            }

        } catch (error) {
            reject(new Error(error));
        }
    })
}


const getBionomiaFiles = async (museum) => {
    return new Promise(function(resolve, reject) {
        try {

            const table = document.querySelector('#bionomia-files')
                //empty table if  there is already content
                table.innerHTML = ''
                console.log(table);
                const header = ['Collection']
                const row = table.insertRow(0)
                row.style = "border: solid"
                const cell1 = row.insertCell(0)


                cell1.innerHTML = header[0].bold()


            for (const [key, value] of Object.entries(GBifIdentifiers[museum])) {
                 fetch('https://bionomia.net/dataset/' + value.key + '/datapackage.json')
                .then(response => response.json())
                .then(data => {
                    if(data.resources[3].path){
                    const url = 'https://bionomia.net/dataset/' + value.key + '/problem_collector_dates.csv.zip'
                    const fileLink = '<a href ="' + url + '">' + key + '</a>'
                    const row1 = table.insertRow(1)
                    const cell_1 = row1.insertCell(0)
                    cell_1.innerHTML = fileLink
                    }
                })
            }
        } catch (error) {
            reject(new Error(error));
        }
    })
}


const main = async (museum, samling) => {
    try {

        // const data = await getMetics(collection[0], issue[0] )
        await getMetics(museum, samling)
        getBionomiaFiles(museum)
    } catch (error) {
        console.log('her kommer en feil: ');
        console.error(error.name + ': ' + error.message);
        
    }
}
addCollectionsToSelect()

// When sombody selcets a collection -> get errors from GBif
document.getElementById('collection-select').addEventListener('change',function(){
    const valgtSamling = document.getElementById('collection-select').value
    const museum = getMuseum()
    main(museum,valgtSamling)
})