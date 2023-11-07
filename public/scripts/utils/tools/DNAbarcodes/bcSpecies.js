// const urlParamsTop = new URLSearchParams(window.location.search)
let bcColl = urlParamsTop.get("coll")
console.log(bcColl)

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
let awaitingTable = document.getElementById("awaiting-table")
let failedTable = document.getElementById("failed-table")



function addRow(table) {
    row = table.insertRow(-1)
    cell1 = row.insertCell(0)
    cell2 = row.insertCell(1)
    cell3 = row.insertCell(2)
    if (bcColl === "sopp") {
        cell4 = row.insertCell(3)
        cell5 = row.insertCell(4)
        cell6 = row.insertCell(5)
        cell7 = row.insertCell(6)

    }
}

// data kommer fra fastafil fra bold (og har ikke med de uten sekvens)
// validationObject kommer fra excel-oversiktsfil
const fillTableSpecies = (data, validationObject) => {
    addRow(countyTable)
    cell1.innerHTML = ''

    addRow(countyTable)
    cell1.innerHTML ='Regno'
    cell1.style.fontWeight = 'bold'
    cell2.innerHTML = 'County'
    cell2.style.fontWeight = 'bold'
    cell3.innerHTML = 'ProcessID'
    cell3.style.fontWeight = 'bold'
    if (bcColl === "sopp") {
        cell4.innerHTML = 'Validation status'
        cell4.style = "padding-right:20px"
        cell4.style.fontWeight = 'bold'
        cell5.innerHTML = 'Validation method'
        cell5.style = "padding-right:20px"
        cell5.style.fontWeight = 'bold'
        cell6.innerHTML = 'Validator/expert'
        cell6.style.fontWeight = 'bold'
        // cell7.innerHTML = 'Expert'
        // cell7.style.fontWeight = 'bold'
    }
    

    for (i=0;i<data.regnos.length;i++) {
        addRow(countyTable)
        let museum = "nhm"
        let objButton = document.createElement('button')
       
        let regno
        if (data.regnos[i].includes('NOMAM')) {regno = data.regnos2[i]}
        else if (data.regnos[i].includes('DFL')) { 
            // bcColl = "dna_fungi_lichens"
            const isSame = (element) => element === data.processIDs[i].substring(1).toString()
            index = validationObject.processID.findIndex(isSame)
            regno = validationObject.musitRegno[index]
        } else {regno = data.regnos[i]}
        objButton.innerHTML = regno
        
        if (data.regnos[i].includes('_')) {
            regno = data.regnos[i].substr(data.regnos[i].lastIndexOf('_')+1) + '/1'
        } else  {
            regno=data.regnos[i].substr(data.regnos[i].lastIndexOf('-')+1)
        }
         if (bcColl === "herptiles") {
            bcColl = "dna_fish_herptiles"
        }

        if (data.regnos[i].includes('TEB')) {
            console.log('hit')
            objButton.style = "background-color:white; border:none"
        } else
        if (!bcColl === "sopp" & !bcColl === "lav" & !bcColl === "mammals" & !bcColl === "Lep" || !data.regnos[i].match(/[a-zA-Z]/)) { // dette funker vel ikke
            objButton.style = "background-color:white; border:none"
        } else if (data.regnos[i].includes('VM')) {
            objButton.style = "background-color:white; border:none"
        }  else if (bcColl === "Lep" && !data.regnos[i].includes("NHMO-DAR")) {
            objButton.style = "background-color:white; border:none"
        } else if (bcColl === 'mammals' && data.regnos2[i].includes('ANM')) {
            objButton.style = "background-color:white; border:none"
        } else {
            if (bcColl === "Lep") {bcColl = "dna_entomology"}
            museum = "nhm"
            if (data.regnos[i].includes('TROM')) {
                museum = "tmu"
            }
           
            if (data.regnos[i].includes('DFL')) { regno = validationObject.musitRegno[index].substr(validationObject.musitRegno[index].lastIndexOf('-')+1)}
            objButton.style = "background-color:white; border:none; color:blue; text-decoration:underline"
            objButton.onclick = function() {
                museumURLPath = urlPath + "/" + museum
                window.open(href=`${museumURLPath}/object/?id=${regno}&samling=${bcColl}&museum=${museum}&lang=${sessionStorage.getItem('language')}&isNew=yes`)
            }
            // if (bcColl === "dna_fungi_lichens") {bcColl = "sopp"}
        }
        
        cell1.appendChild(objButton)
        cell1.style = "padding-right:20px"
        
        cell2.innerHTML =  data.counties[i]
        cell2.style = "padding-right:20px"
        

        let processID = data.processIDs[i].substr(1)
        const url = `http://www.boldsystems.org/index.php/Public_RecordView?processid=${processID}`
        cell3.innerHTML = `<a href="${url}" target="_blank">${processID}</a>`
        cell3.style = "padding-right:20px"

        if (bcColl === "sopp") {
            let index
            // const isSame = (element) => element === data.regnos[i].toString()
            // index = validationObject.musitRegno.findIndex(isSame)
            const isSame = (element) => element === data.processIDs[i].substring(1).toString()
            index = validationObject.processID.findIndex(isSame)
            cell4.innerHTML = validationObject.year[index]
            cell4.style = "padding-right:20px"
            if (validationObject.validationStatus[index]) {
                cell4.innerHTML = validationObject.validationStatus[index]
                cell4.style = "padding-right:40px"
            } else {
                cell4.innerHTML = "not validated"
                cell4.style = "padding-right:40px"
            }
            
            if (validationObject.validationMethod[index]) {
                cell5.innerHTML = validationObject.validationMethod[index]
            }
            cell5.style = "padding-right:20px"
            if (validationObject.validator[index]) {
                cell6.innerHTML = validationObject.validator[index]
            }
            // cell6.style = "padding-right:10px"
            // if (validationObject.expert[index]) {
            //     cell7.innerHTML = validationObject.expert[index]
            // }
            
        }
        
    }
}

const fillTableFailed = (validationObject) => {
    addRow(failedTable)
    cell1.innerHTML = ''
    addRow(failedTable)
    cell1.innerHTML = 'Regno'
    cell1.style.fontWeight = 'bold'
    cell2.innerHTML = 'Date'
    cell2.style.fontWeight = 'bold'
    cell3.innerHTML = 'ProcessID'
    cell3.style.fontWeight = 'bold'
    
    for (i=0;i<validationObject.musitRegno.length;i++) {
        if (validationObject.seqLength[i] === '0' || validationObject.seqLength[i] ==='0[n]') {
            addRow(failedTable)
            cell1.innerHTML = validationObject.musitRegno[i]
            cell1.style = "padding-right:20px"
            cell2.innerHTML = validationObject.year[i]
            cell2.style = "padding-right:20px"
            cell3.innerHTML = validationObject.processID[i]
            cell3.style = "padding-right:20px"
        
        }
        // let regno
        // if (data.regnos[i].includes('_')) {
        //     regno = data.regnos[i].substr(data.regnos[i].lastIndexOf('_')+1) + '/1'
        // } else {
        //     regno=data.regnos[i].substr(data.regnos[i].lastIndexOf('-')+1)
        // }
        // if (data.regnos[i].includes('DFL')) {
        //     bcColl = "dna_fungi_lichens"
        // } 
        // console.log(data.regnos[i])
        
    }
}

const fillTableAwaiting = (validationObject) => {
    addRow(awaitingTable)
    cell1.innerHTML = ''
    addRow(awaitingTable)
    cell1.innerHTML = 'Regno'
    cell1.style.fontWeight = 'bold'
    cell2.innerHTML = 'Date'
    cell2.style.fontWeight = 'bold'
    cell3.innerHTML = 'ProcessID'
    cell3.style.fontWeight = 'bold'
    
    for (i=0;i<validationObject.musitRegno.length;i++) {
        console.log(validationObject)
        if (validationObject.seqLength[i] === 'pending') {
            addRow(awaitingTable)
            cell1.innerHTML = validationObject.musitRegno[i]
            cell1.style = "padding-right:20px"
            cell2.innerHTML = validationObject.year[i]
            cell2.style = "padding-right:20px"
            cell3.innerHTML = validationObject.processID[i]
            cell3.style = "padding-right:20px"
        
        }
        
    }
}

document.getElementById('bcClose').onclick = function () {
    close()
}


async function main() {
    data = await getFastaData() //Gjør en request til server om å få innholdet i fasta.fas
    fungiOverview = await getOverview()
    // speciesObject kommer fra fastafil fra bold (og har ikke med de uten sekvens)
    let speciesObject = data.unparsed.find((el) => {
        return el.species === relSpecies.replace("_"," ")
    })
    // overviewObject kommer fra excel-oversiktsfil
    let overviewObject = fungiOverview.find((el => {
        return el.species === relSpecies.replace("_"," ")
    }))
    fillTableSpecies(speciesObject, overviewObject)
    let candidates
    const urlParams = new URLSearchParams(window.location.search)
    
    if (urlParams.get("coll") === "sopp") {
        candidates = await getCandidates()
        console.log(overviewObject)
        fillTableAwaiting(overviewObject)
        fillTableFailed(overviewObject)
    }
}

main()


