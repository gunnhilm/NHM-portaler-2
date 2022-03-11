// Runs before the objectpage is shown to make sure that the data is present

const urlParams = new URLSearchParams(window.location.search)

// // get organism groups
async function setOrgGroup () {
    
        // set orgGroup to sessionStorage
        const url2 = '/museum' + '/groupOfOrg/?' + 'museum=' + urlParams.get("museum") + '&samling=' + urlParams.get("samling")
        await fetch(url2).then((response) => {
            if (!response.ok) {
                throw 'noe går galt med søk, respons ikke ok'  
            } else {
                try {
                    response.text().then((data) => {
                        if(data.error) {
                            errorMessage.innerHTML = textItems.serverError[index]
                            return console.log(data.error)
                        } else {
                            sessionStorage.setItem('organismGroup', data)
                        }
                    }) 
                    
                } catch (error) {
                    console.log(error);
                }
            }
        })
}

//get info about specimen
async  function setSpecimenData () {
    return new Promise(function(resolve, reject) {
        // get the id from the url
        let specimenObject = {}

            // If the object is not in local storage, the get it from the server
            let urlParams = new URLSearchParams(document.location.search);    
            sessionStorage.setItem('chosenCollection', urlParams.get("samling"))
            const url = '/museum' + '/objListSearch/?' + 'searchObjects=' + urlParams.get("id") +'&museum=' + urlParams.get("museum") + '&samling=' + urlParams.get("samling") + '&linjeNumber=0&limit=1000'
            fetch(url).then((response) => {
                if (!response.ok) {
                    
                    throw 'noe går galt med søk, respons ikke ok'  
                } else {
                    try {
                        response.text().then((data) => {
                            if(data.error) {
                                errorMessage.innerHTML = textItems.serverError[index]
                                return console.log(data.error)
                            } else {
                                const JSONdata = JSON.parse(data)                          
                                const parsedResults = Papa.parse(JSONdata.unparsed.results, {
                                    delimiter: "\t",
                                    newline: "\n",
                                    quoteChar: '',
                                    header: true,
                                }) 
                                specimenObject = parsedResults.data
                                sessionStorage.setItem('string', JSON.stringify(specimenObject))
                                resolve(specimenObject)
                            }
                        }) 
                        
                    } catch (error) {
                        reject(new Error(error));
                        console.log(error);
                    }
                }
            })
    })
}

async function setItems () {
    sessionStorage.setItem('language', urlParams.get("lang") )
    sessionStorage.setItem('museum', urlParams.get("museum") )
    sessionStorage.setItem('collection', urlParams.get("samling") )
}

function testIfNewPage() {
    if(sessionStorage.getItem('string') === null) {
        return true
    } else {
        return false
    }
}


// runs in file object.js
async function newObjectPageMain() {
    if (testIfNewPage()) {
        await setItems()
        await setOrgGroup()
        await setSpecimenData()
        console.log('ferdig mer pre run');
        // return true
    }
}

