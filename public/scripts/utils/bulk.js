// information on bulk-projects or -parts in map-div

 // header-box
// get list of projects: add project-field to bulk-dump. for now: Preparations
// select filled with projects 
// when selected: a text box, and a search, that gives us all records for that project




// make list of bulk-projects from bulk-flat-file
async function getListProjects () {
    return new Promise((resolve,reject) => {
        const url = urlPath + '/search/?search=&museum=nhm&samling=bulk&linjeNumber=0' + '&limit=2000' 
        fetch(url).then((response) => {
            if (!response.ok) {
                throw 'noe går galt med søk, respons ikke ok'
            } else {
                try {
                    response.text().then((data) => {
                        if(data.error) {
                            errorMessage.innerHTML = textItems.serverError[index]
                            console.log(error);
                            return console.log(data.error)
                        } else {
                            const JSONdata = JSON.parse(data)  
                            
                            sessionStorage.setItem('searchLineNumber', JSONdata.unparsed.count)
                            //sessionStorage.setItem('searchTerm', searchTerm)
                            const parsedResults = Papa.parse(JSONdata.unparsed.results, {
                                delimiter: "\t",
                                newline: "\n",
                                quoteChar: '',
                                header: true,
                            })
                            let projectArray = []                            
                            parsedResults.data.forEach(el => {
                                // gjør om til objekter, med prosjektnavn og prosjektbeskrivelse
                                if (!projectArray.find((element)=> element.projectName=== el.projectName)) {projectArray.push({projectName: el.projectName, projectDescription: el.projectDescription})}
                            })
                            resolve (projectArray)
                        }
                    })
                    
                }catch (error) {
                    console.error(error)
                    reject(error);
                }
            }
        })
    })
}


function displayBulkProjects(array) {
    // place a header for bulk projects
    const bulkProjectHeader = document.createElement('div')
    bulkProjectHeader.id = 'bulkProjectHeader'
    document.querySelector("#map-search").appendChild(bulkProjectHeader)
    document.querySelector("#map-search").style = "border:solid; padding:30px"
    bulkProjectHeader.innerHTML = textItems.bulkSelectHeader[index]
    // make a select with all projects
    const bulkProjectsSelect = document.createElement("select")
    const vennligstBulk = document.createElement("option")
    vennligstBulk.text = textItems.searchProject[index]
    vennligstBulk.value = 'vennligstBulk'
    vennligstBulk.id = 'vennligstBulk'
    bulkProjectsSelect.add(vennligstBulk)
    array.forEach(el => {
        let option = document.createElement('option')
        option.value = el.projectName
        option.text = el.projectName
        bulkProjectsSelect.appendChild(option)
    
    })
    document.querySelector("#map-search").appendChild(bulkProjectsSelect)
    // Place a box for description of project
    bulkProjectDescription = document.createElement('div')
    document.querySelector("#map-search").appendChild(bulkProjectDescription)
    
    bulkProjectsSelect.addEventListener('change', (e) => {
        let project = array.find((el) => el.projectName === bulkProjectsSelect.value)
        bulkProjectDescription.innerHTML = "<br>" + project.projectDescription
        // bulkProjectDescription.style = "border:solid"
        // do a search with bulkProjectSelect.value as search term (må gjenta hele kode her?)
        const search = document.querySelector('input')
        search.value = project.projectName
        doSearch(1000)
    })
}


async function bulkMain () {
    projectArray = await getListProjects()
    displayBulkProjects(projectArray)
    
}
// main()