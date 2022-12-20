const urlParamsTop = new URLSearchParams(window.location.search)
let coll = urlParamsTop.get("coll")

let index
language = urlParamsTop.get("lang")
if (language === "Norwegian") {
    index = 0
} else if (language === "English") {
    index = 1
}

renderHeaderContent(language)
document.getElementById('language').style.display = 'none'

let relSpecies = urlParamsTop.get("id")
document.getElementById("head-species").innerHTML = relSpecies.replace("_"," ")



let countyTable = document.getElementById("county-table")

const getFastaData = () => {
    return new Promise(resolve => {
        const url =   urlPath + `/DNAbarcodes/?getFasta=true&coll=${coll}`
        fetch(url).then((response) => { 
            response.text().then((data) => {
                if(data.error) {
                    return console.log(data.error)
                } else {          
                    try {
                        data = JSON.parse(data)
                        resolve(data)
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        })
    })
}

// const getValidationData = () => {
//     return new Promise(resolve => {
//         const url =   urlPath + `/barcodeValidation/`
//         fetch(url).then((response) => { 
//             response.text().then((data) => {
//                 if(data.error) {
//                     return console.log(data.error)
//                 } else {          
//                     try {
//                         data = JSON.parse(data)
//                         resolve(data)
//                     } catch (error) {
//                         console.log(error);
//                     }
//                 }
//             })
//         })
//     })
// }

function addRow(table) {
    row = table.insertRow(-1)
    cell1 = row.insertCell(0)
    cell2 = row.insertCell(1)
    cell3 = row.insertCell(2)
    // cell4 = row.insertCell(3)
    // cell5 = row.insertCell(4)
    // cell6 = row.insertCell(5)
}

const fillTable = (data) => {
    
    addRow(countyTable)
    cell1.innerHTML = ''

    addRow(countyTable)
    cell1.innerHTML = 'County'
    cell1.style.fontWeight = 'bold'
    cell2.innerHTML = 'Regno'
    cell2.style.fontWeight = 'bold'
    cell3.innerHTML = 'ProcessID'
    cell3.style.fontWeight = 'bold'
    // cell4.innerHTML = 'Validation status'
    // cell4.style.fontWeight = 'bold'
    // cell5.innerHTML = 'Validation method'
    // cell5.style.fontWeight = 'bold'
    // cell6.innerHTML = 'Expert'
    // cell6.style.fontWeight = 'bold'


    for (i=0;i<data.regnos.length;i++) {
        addRow(countyTable)
        cell1.innerHTML =  data.counties[i]
        cell1.style = "padding-right:20px"
        
        let museum = "nhm"
        let objButton = document.createElement('button')
       
        let regno
        if (data.regnos[i].includes('NOMAM')) {regno = data.regnos2[i]}
        else {regno = data.regnos[i]}
        
        objButton.innerHTML = regno
        
        if (data.regnos[i].includes('_')) {
            regno = data.regnos[i].substr(data.regnos[i].lastIndexOf('_')+1) + '/1'
        } else {
            regno=data.regnos[i].substr(data.regnos[i].lastIndexOf('-')+1)
        }
        
        // if (data.regnos[i].substr(0, data.regnos[i].lastIndexOf('-')+1) === 'O-F-') {
        //     coll = "sopp"
        // } else 
        if (data.regnos[i].includes('DFL')) {
            coll = "dna_fungi_lichens"
        } 
        
        // else if (data.regnos[i].includes('TROM')) {
        //     coll = "sopp"
        // }
         else if (coll === "herptiles") {
            coll = "dna_fish_herptiles"
        }
        console.log(data.regnos[i])
       
        if (!coll === "sopp" & !coll === "lav" & !coll === "mammals" & !coll === "Lep" || !data.regnos[i].match(/[a-zA-Z]/)) { // dette funker vel ikke
            objButton.style = "background-color:white; border:none"
        } else if (data.regnos[i].includes('VM')) {
            objButton.style = "background-color:white; border:none"
        }  else if (coll === "Lep" && !data.regnos[i].includes("NHMO-DAR")) {
            objButton.style = "background-color:white; border:none"
        } else if (coll === 'mammals' && data.regnos2[i].includes('ANM')) {
                // if (data.regnos2[i].includes('ANM'))  {
                    objButton.style = "background-color:white; border:none"
                // }
            }
            else {
                if (coll === "Lep") {coll = "dna_entomology"}
                museum = "nhm"
                if (data.regnos[i].includes('TROM')) {
                    museum = "tmu"
                }
                
                objButton.style = "background-color:white; border:none; color:blue; text-decoration:underline"
                objButton.onclick = function() {
                    museumURLPath = urlPath + "/" + museum
                    window.open(href=`${museumURLPath}/object/?id=${regno}&samling=${coll}&museum=${museum}&lang=${sessionStorage.getItem('language')}&isNew=yes`)
                }
            // }
        }
        
        cell2.appendChild(objButton)
        cell2.style = "padding-right:20px"

        let processID = data.processIDs[i].substr(1)
        const url = `http://www.boldsystems.org/index.php/Public_RecordView?processid=${processID}`
        cell3.innerHTML = `<a href="${url}" target="_blank">${processID}</a>`
        cell3.style = "padding-right:20px"

        // cell4.innerHTML = data.validationStatus[i]
        // cell4.style = "padding-right:20px"

        // cell5.innerHTML = data.validationMethod[i]
        // cell5.style = "padding-right:20px"
        
        // cell6.innerHTML = data.expert[i]
    }
}

document.getElementById('bcClose').onclick = function () {
    close()
}


async function main() {
    data = await getFastaData() //Gjør en request til server om å få innholdet i fasta.fas
    let speciesObject = data.find((el) => {
        return el.species === relSpecies.replace("_"," ")
    })
    // // console.log(speciesObject)
    // speciesObject.validationStatus = []
    // speciesObject.validationMethod = []
    // speciesObject.expert = []
    
    // validationData = await getValidationData()

        // for (i=0;i<speciesObject.regnos.length;i++) {
        //     let validationObject = validationData.find((el) => {
        //         return el.musitRegno === speciesObject.regnos[i]
        //     })
        //     console.log(validationObject)
        //     speciesObject.validationStatus.push(validationObject.validationStatus)
        //     speciesObject.validationMethod.push(validationObject.validationMethod)
        //     speciesObject.expert.push(validationObject.expert)
            
        // }
        // console.log(speciesObject)

    

    fillTable(speciesObject)

    
}

main()


