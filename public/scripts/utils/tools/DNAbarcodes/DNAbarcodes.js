const urlParamsTop = new URLSearchParams(window.location.search)
let table = document.getElementById("barcode-table")
let bcColl = urlParamsTop.get("coll")
console.log(bcColl)

if (bcColl === "sopp") { document.getElementById("getBarcodeHeader").innerHTML = textItems.bcHeaderFungi[1] }
else if (bcColl === "mammals") {document.getElementById("getBarcodeHeader").innerHTML = textItems.bcHeaderMammals[1]}
else if (bcColl === "Lep") {document.getElementById("getBarcodeHeader").innerHTML = textItems.bcHeaderLep[1]}
else if (bcColl === "herptiles") document.getElementById("getBarcodeHeader").innerHTML = textItems.bcHeaderHerptiles[1]

document.getElementById("getBarcodeText").innerHTML = "Last updated 10.8.2021 <br> <br>Legend: <br>1: Specimens sequenced <br> 2: Sampled specimens, to be sequenced <br> 3: Specimens selected for sampling<br><br> Click on species name to see which specimens are barcoded, and which county (fylke) they are from"




const getFastaData = () => {
    return new Promise(resolve => {
        const url =   urlPath + `/DNAbarcodes/?getFasta=true&coll=${bcColl}`
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

const bcSearch = (searchTerm, data) => {
    console.log(searchTerm + ' in bcSearch')
    // console.log(data)
    let searchResultData = data.filter(el => el.species.toLowerCase().includes(searchTerm.toLowerCase()))
    // line.toLowerCase().indexOf(searchTerm) !== -1
    console.log(searchResultData)
    emptyTable()
    fillTable(searchResultData)
    
    // const searchTerm = document.querySelector('input').value
    // const url = urlPath + '/bcSearch/?search=' + searchTerm
    // fetch(url).then((response) => {
    //     console.log(response)
    //     if (!response.ok) {
    //         throw 'noe går galt med søk, respons ikke ok'
    //     } else {
    //         console.log('hit..............................')
    //         try {
    //             response.text().then((data) => {
    //                 if(data.error) {
    //                     errorMessage.innerHTML = textItems.serverError[index]
    //                     console.log(error);
    //                     return console.log(data.error)
    //                 } else {
    //                     const JSONdata = JSON.parse(data)  
    //                     console.log(JSONdata.unparsed.results)
    //                     const parsedResults = Papa.parse(JSONdata.unparsed.results, {
    //                         delimiter: "\t",
    //                         newline: "\n",
    //                         quoteChar: '',
    //                         header: true,
    //                     }) 
    //                     console.log(parsedResults.data)
    //                 //     //check if there are any hits from the search
    //                 //     if ( parsedResults.data === undefined || parsedResults.data.length === 0 ) {
    //                 //         console.log('no results')
    //                 //     } 
    //                 }
    //             })
    //         }
    //         catch (error) {
    //             console.error(error)
    //             reject(error);
    //         }
    //     }
    //     // document.getElementById("please-wait").style.display = "none"
    // }).catch((error) => {
    //     console.log(error);
    //     // document.getElementById("please-wait").style.display = "none"
    // })
}

const bcSearchListener = (data) => {
    document.querySelector('#search-bc-form').addEventListener('submit', (e) => {
        e.preventDefault()
        const searchTerm = document.querySelector('#search-bc-text').value
        console.log(searchTerm)
        console.log('submit')
        
        bcSearch(searchTerm, data)
    })
}

const processFastaData = () => {
 
}
function addRow(table) {
    row = table.insertRow(-1)
    cell1 = row.insertCell(0)
    cell1.style = "border:solid"
    
    cell2 = row.insertCell(1)
    cell2.style="border:solid"
    cell3 = row.insertCell(2)
    cell3.style="border:solid"
    cell4 = row.insertCell(3)
    cell4.style="border:solid"
}



const fillTable = (data) => {
    console.log('fillTable')
    addRow(table)
    cell1.innerHTML = 'Species'
    cell1.style.fontWeight = "bold"
    cell2.innerHTML = 'Sequenced specimens'
    cell2.style.fontWeight = "bold"
    // cell2.style="word-wrap:break-all"
    cell3.innerHTML = 'Awaiting sequencing'
    cell3.style.fontWeight = "bold"
    cell4.innerHTML = 'Sampled for sequencing'
    cell4.style.fontWeight = "bold"
    let sum = 0
        
    for (i=0;i<data.length;i++) {
        addRow(table)
        museumURLPath = urlPath + "/nhm"
        let species = data[i].species.replace(" ","_")
        
        let spButton = document.createElement('button')
        spButton.style = "background-color:white; border:none; color:blue; text-decoration:underline; font-style: italic"
        spButton.innerHTML = data[i].species
        spButton.onclick = function() {
            // if (bcColl === "herptiles") {bcColl = "dna_fish_herptiles"}
            window.open(href=`${museumURLPath}/bcSpecies/?coll=${bcColl}&id=${species}&lang=${sessionStorage.getItem('language')}`)
        }
        cell1.appendChild(spButton)
        cell2.innerHTML = data[i].number
        cell2.style="text-align: center"
        cell2.style.border="solid"
        // sum up   
        sum = sum + data[i].number
        
    }
    console.log(sum)
    addRow(table)
    cell1.innerHTML = "Sum"
    cell2.innerHTML = sum
    cell2.style="text-align:center"
    cell2.style.border="solid"
}


const emptyTable = () => {
    table.innerHTML = ''
}





async function main() {
    data = await getFastaData() //Gjør en request til server om å få innholdet i fasta.fas
    table.style = "border-collapse: collapse"
    table.bordercolor = "grey"
    
    fillTable(data)
    bcSearchListener(data)
    
}

main()
