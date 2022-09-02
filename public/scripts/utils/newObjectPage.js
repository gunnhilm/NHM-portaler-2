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
                                console.log(data) 
                                const parsedResults = Papa.parse(JSONdata.unparsed.results, {
                                    delimiter: "\t",
                                    newline: "\n",
                                    quoteChar: '',
                                    header: true,
                                }) 
                                specimenObject = parsedResults.data
                                console.log(specimenObject)
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

async function whichFileAndDb_two (museum,collection) {
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
                            console.log(data1[0])
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

async function setItems () {
    sessionStorage.setItem('language', urlParams.get("lang") )
    sessionStorage.setItem('museum', urlParams.get("museum") )
    sessionStorage.setItem('chosenCollection', urlParams.get("samling"))
    const fileList = JSON.parse(sessionStorage.getItem('fileList'))
    let associatedCollection
    fileList.forEach(el => {
        if (el == sessionStorage.getItem('chosenCollection')) {
            associatedCollection = el.associatedCollection
        }
    })
}

function testIfNewPage(isNew) {
    if(sessionStorage.getItem('string') === null || sessionStorage.getItem('string') === '[]' || isNew === 'yes') { // endret her
        return true
    } else {
        return false
    }
}

// fetches fileList from backend. 
////////////// duplicate code, also in search.js (different name; getFileList())
const getFileListObjPage = async () => {
    return new Promise((resolve,reject) => {
        url_getFileList = urlPath + '/getFileList/?museum=' + urlParams.get("museum")
        fetch(url_getFileList).then((response) => {
            if (!response.ok) {
                throw 'noe er galt med respons til getFileList fra museum'
            } else {
                try {
                    response.text().then((data) => {
                        JSONdata = JSON.parse(data)
                        sessionStorage.setItem('fileList',data)
                        resolve(true)
                    })
                }
                catch (error) {
                    console.log(error)
                    reject(error)
                }
            }
        })
        
    })
}




// runs in file object.js
async function newObjectPageMain() {
    console.log(testIfNewPage(urlParams.get("isNew")))
    if (testIfNewPage(urlParams.get("isNew"))) {
        await getFileListObjPage()
        await setItems()
        await setOrgGroup()
        await setSpecimenData()
        await whichFileAndDb_two(urlParams.get("museum"),urlParams.get("samling"))
    }
}

