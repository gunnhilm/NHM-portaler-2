const fs = require('fs')
const readline = require('readline')
const papa = require('papaparse')


const readDumpFile = (filename, callback) => {
    let dumpResults = ''
    const readInterface = readline.createInterface({
        input: fs.createReadStream(filename),
        console: false
    })

    let count = 0
    readInterface.on('line', function(line) {
        count ++
        if (count === 1 ) {
            // header row
            dumpResults = line
        } else {
            dumpResults = dumpResults + '\n' + line
        }
    })
    .on('close', function () {
        const parsedDumpResults = papa.parse(dumpResults, {
            delimiter: "\t",
            newline: "\n",
            quoteChar: '',
            header: true,
        })
        callback(undefined, parsedDumpResults.data)
    })
}

// const readPreparationFile = (callback) => {
//     let dnaResults = ''
//     const readInterface = readline.createInterface({
//         input: fs.createReadStream('../../src/data/dna_bird_preparation.txt'),
//         console: false
//     })

//     let count = 0
//     readInterface.on('line', function(line) {
//         count ++
//         if (count === 1 ) {
//             // header row
//             dnaResults = line
//         } else {
//             dnaResults = dnaResults + '\n' + line
//         }
//     })
//     .on('close', function () {
//         const parsedDnaResults = papa.parse(dnaResults, {
//             delimiter: "\t",
//             newline: "\n",
//             quoteChar: '',
//             header: true,
//         })
//         callback(undefined, parsedDnaResults.data)
//     })
// }





// read occurrence-file with birds and store each accession as an object in an array
let results = ''
const readInterface = readline.createInterface({
    input: fs.createReadStream('../../src/data/birds_occurrence_short.txt'),
    console: false
})



let count = 0
readInterface.on('line', function(line) {
    count ++
    if (count === 1 ) {
        // header row
        results = line
        
    } else {
        results = results + '\n' + line
    }
    
})
.on('close', function () {

    //change? return parsedResults from this, turning this into a function? kan på et vis returneres med callback-funksjonen, men jeg får den fortsatt ikke ut av funksjonen

    // parse the results, work with data in arrays to add column with items, then unparse back to string-format
  
    const parsedResults = papa.parse(results, {
        delimiter: "\t",
        newline: "\n",
        quoteChar: '',
        header: true,
    })
    
 // are there duplicates in the bird_occurrence-file? - yes, duplicates have same organismID
// make an array of all organismID's, and a new with only unique values

    const organismIDArray = []
    
    parsedResults.data.forEach( element => organismIDArray.push(element.organismID))   
    const uniqueOrganismIDArray = Array.from(new Set(organismIDArray))
    
    const uniqueOrgArray = []
    uniqueOrganismIDArray.forEach (element => uniqueOrgArray.push({id1: element}))
    
    function fillProperty(prop, value) {
        tempArray = prop.split(",")
        tempArray.push(value)
        prop = tempArray.toString()
        prop = prop.replace(/,/g, ",")
        return prop
    }



    parsedResults.data.forEach( element => {
        //find this orgID in uniqueOrgArray
        relEl = uniqueOrgArray.find(el => el.id1 === element.organismID)
        // and put the data for this organism into an object. If more items, add items to object
        if (!relEl.hasOwnProperty('type')) {
            // her kan vi ta vekk felter vi ikke fil ha, f.eks. "rightsHolder" og "accessRights"?
            relEl = Object.assign(relEl, element)
            relEl.items = element.preparations
            // item-id
            relEl.item_uuid = element.id
            // item-number
            relEl.itemNumbers = element.catalogNumber
            // date - for i.e. blood: date of sampling, same as eventDate(collecting date)
           // relEl.date = element.eventDate
            // turn item-number into acc-number (i.e. catalogNumber)
            relEl.catalogNumber = relEl.catalogNumber.substring(0, relEl.catalogNumber.indexOf("/"))
            
            
        } else {
            tempArray = relEl.items.split(",")
            tempArray.push(element.preparations)
            relEl.items = tempArray.toString()
            relEl.items = relEl.items.replace(/,/g, ", ")
        
            tArrayItemNb = relEl.itemNumbers = relEl.itemNumbers.split(",")
            tArrayItemNb.push(element.catalogNumber)
            relEl.itemNumbers = tArrayItemNb.toString()
            relEl.itemNumbers = relEl.itemNumbers.replace(/,/g, ", ")

            relEl.item_uuid = fillProperty(relEl.item_uuid, element.id)    
            
            //relEl.date = fillProperty(relEl.date, element.eventDate)
            
        }
    })
    
    

    readDumpFile('../../src/data/dna_bird_preparation.txt',(error, dnaResults) => {
       // console.log(dnaResults)
        uniqueOrgArray.forEach(element => {
            tarray = element.item_uuid.split(",")
            dateArray = []
            methodArray = []
            tarray.forEach(uuid => {
                //console.log(uuid)
                dnaEl = dnaResults.find(el => el.id === uuid)
                //console.log(dnaEl)
                if (dnaEl) {
                    if (dnaEl.preparationDate) {
                        dateArray.push(dnaEl.preparationDate)
                    } else {
                        // if tissue: probably same as eventDNA. True????
                        dateArray.push(element.eventDate)    
                    }
                    if (dnaEl.preparationMaterials) {
                        methodArray.push(dnaEl.preparationMaterials)
                    } else {
                        methodArray.push('#N/A')
                    }
               } else {
                    dateArray.push('#N/A')
                    methodArray.push('#N/A')
                }
            })
            element.itemDates = dateArray.toString()
            element.itemMethods = methodArray.toString()
            
        })
        
        readDumpFile('../../src/data/dna_bird_amplification.txt',(error,sequenceResults) => {
            //console.log(sequenceResults)
            uniqueOrgArray.forEach(element => {
                tarray = element.item_uuid.split(",")
                genArray = []
                boldArray = []
                uriArray = []
                tarray.forEach(uuid => {
                    //console.log(uuid)
                    amplEl = sequenceResults.find(el => el.id === uuid)
                    if (amplEl) {
                        if (amplEl.geneticAccessionNumber) {
                            genArray.push(amplEl.geneticAccessionNumber)
                        } else {
                            genArray.push('#N/A')
                        }
                        if(amplEl.BOLDProcessID) {
                            boldArray.push(amplEl.BOLDProcessID)
                        } else {
                            boldArray.push('#N/A')
                        }
                        if (amplEl.geneticAccessionURI) {
                            uriArray.push(amplEl.geneticAccessionURI)
                        } else {
                            uriArray.push('#N/A')
                        }
                    } else {
                        genArray.push('#N/A')
                        boldArray.push('#N/A')
                        uriArray.push('#N/A')
                    }
                })
                element.itemGenAccNos = genArray.toString()
                element.itemProcessIDs = boldArray.toString()
                element.itemGenAccUris = uriArray.toString()
            })
            readDumpFile('../../src/data/bird_materialsample.txt', (error,materialsampleResults) => {
                uniqueOrgArray.forEach(element => {
                    tarray = element.item_uuid.split(",")
                    concArray = []
                    unitArray = []
                    tarray.forEach(uuid => {
                        matEl = materialsampleResults.find(el => el.id === uuid)
                        if (matEl) {
                            if (matEl.concentration) {
                                concArray.push(matEl.concentration)
                            } else {
                                concArray.push('#N/A')
                            }
                            if (matEl.concentrationUnit) {
                                unitArray.push(matEl.concentrationUnit)
                            } else {
                                unitArray.push('#N/A')
                            }
                        } else {
                            concArray.push('#N/A')
                            unitArray.push('#N/A')
                        }
                    })
                    element.itemConcentrations = concArray.toString()
                    element.itemUnits = unitArray.toString()
                })

                readDumpFile('../../src/data/birds_preservation.txt', (error, preservationResults) => {
                    uniqueOrgArray.forEach(element => {
                        tarray = element.item_uuid.split(",")
                        presArray = []
                        tarray.forEach(uuid => {
                            presEl = preservationResults.find(el => el.id === uuid)
                            if (presEl) {
                                if (presEl.preservationType) {
                                    presArray.push(presEl.preservationType.replace(',',';'))
                                } else {
                                    presArray.push('#N/A')
                                }
                            } else {
                                presArray.push('#N/A')
                            }
                        })
                        element.itemPreservations = presArray.toString()
                    })

                    let newResults = papa.unparse(uniqueOrgArray, {
                        delimiter: "\t",
                    })
                    fs.writeFileSync('../data/new_bird_file.txt', newResults)
                })
                
            })
            
        })
       
    })
    
})



