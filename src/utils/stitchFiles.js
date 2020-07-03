const fs = require('fs')
const readline = require('readline')
const papa = require('papaparse')

// filenames
const birdMultimediaFile = '../../src/data/birds_multimedia.txt'
const birdPreservationFile = '../../src/data/birds_preservation.txt'
const birdMaterialsampleFile = '../../src/data/birds_materialsample.txt'
const birdAmplificationFile = '../../src/data/dna_birds_amplification.txt'
const birdPreparationFile = '../../src/data/dna_birds_preparation.txt'
const birdOccurrenceFile = '../../src/data/birds_occurrence_short.txt'

const mammalMultimediaFile = '../../src/data/mammals_multimedia.txt'
const mammalPreservationFile = '../../src/data/mammals_preservation.txt'
const mammalMaterialsampleFile = '../../src/data/mammals_materialsample.txt'
const mammalAmplificationFile = '../../src/data/dna_mammals_amplification.txt'
const mammalPreparationFile = '../../src/data/dna_mammals_preparation.txt'
const mammalOccurrenceFile = '../../src/data/mammals_occurrence_short.txt'

const fishHerpMultimediaFile = '../../src/data/fishHerps_multimedia.txt'
const fishHerpPreservationFile = '../../src/data/fishHerps_preservation.txt'
const fishHerpMaterialsampleFile = '../../src/data/fishHerps_materialsample.txt'
const fishHerpAmplificationFile = '../../src/data/dna_fishHerps_amplification.txt'
const fishHerpPreparationFile = '../../src/data/dna_fishHerps_preparation.txt'
//const fishHerpOccurrenceFile = '../../src/data/fishHerps_occurrence.txt'
const fishHerpOccurrenceFile = '../../src/data/fishHerps_occurrence_short.txt'

const otherMultimediaFile = '../../src/data/others_multimedia.txt'
const otherPreservationFile = '../../src/data/others_preservation.txt'
const otherMaterialsampleFile = '../../src/data/others_materialsample.txt'
const otherAmplificationFile = '../../src/data/dna_others_amplification.txt'
const otherPreparationFile = '../../src/data/dna_others_preparation.txt'
const otherOccurrenceFile = '../../src/data/others_occurrence.txt'

function fillProperty(prop, value) {
    tempArray = prop.split(",")
    tempArray.push(value)
    prop = tempArray.toString()
    prop = prop.replace(/,/g, ",")
    return prop
}

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

const stitchFiles = (occurrenceFile, preparationFile, amplificationFile, materialsampleFile, preservationFile, multimediaFile, outfileName) => {


    // read occurrence-file with birds and store each accession as an object in an array
    let results = ''
    const readInterface = readline.createInterface({
        input: fs.createReadStream(occurrenceFile),
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
        
        parsedResults.data.forEach( element => {
            //find this orgID in uniqueOrgArray
            relEl = uniqueOrgArray.find(el => el.id1 === element.organismID)
            // and put the data for this organism into an object. If more items, add items to object
            if (!relEl.hasOwnProperty('type')) {
                // her kan vi ta vekk felter vi ikke fil ha, f.eks. "rightsHolder" og "accessRights"?
                // The Object.assign() method copies all enumerable own properties from one or more source objects to a target object. It returns the target object.
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
        
        

        readDumpFile(preparationFile,(error, dnaResults) => {
        // console.log(dnaResults)
            uniqueOrgArray.forEach(element => {
                tarray = element.item_uuid.split(",")
                dateArray = []
                methodArray = []
                preparedByArray = []
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
                            methodArray.push(' ')
                        }
                        if (dnaEl.preparedBy) {
                            preparedByArray.push(dnaEl.preparedBy)
                        } else {
                            preparedByArray.push ('')
                        }
                    } else {
                        dateArray.push(' ')
                        methodArray.push(' ')
                        preparedByArray.push('')
                    }
                })
                element.itemDates = dateArray.toString()
                element.itemMethods = methodArray.toString()
                element.itemPreparedBys = preparedByArray.toString()
            })
            
            readDumpFile(amplificationFile,(error,sequenceResults) => {
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
                                genArray.push('')
                            }
                            if(amplEl.BOLDProcessID) {
                                boldArray.push(amplEl.BOLDProcessID)
                            } else {
                                boldArray.push(' ')
                            }
                            if (amplEl.geneticAccessionURI) {
                                uriArray.push(amplEl.geneticAccessionURI)
                            } else {
                                uriArray.push(' ')
                            }
                        } else {
                            genArray.push(' ')
                            boldArray.push(' ')
                            uriArray.push(' ')
                        }
                    })
                    element.itemGenAccNos = genArray.toString()
                    element.itemProcessIDs = boldArray.toString()
                    element.itemGenAccUris = uriArray.toString()
                })
                readDumpFile(materialsampleFile, (error,materialsampleResults) => {
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
                                    concArray.push(' ')
                                }
                                if (matEl.concentrationUnit) {
                                    unitArray.push(matEl.concentrationUnit)
                                } else {
                                    unitArray.push(' ')
                                }
                            } else {
                                concArray.push(' ')
                                unitArray.push(' ')
                            }
                        })
                        element.itemConcentrations = concArray.toString()
                        element.itemUnits = unitArray.toString()
                    })

                    readDumpFile(preservationFile, (error, preservationResults) => {
                        uniqueOrgArray.forEach(element => {
                            tarray = element.item_uuid.split(",")
                            presArray = []
                            tarray.forEach(uuid => {
                                presEl = preservationResults.find(el => el.id === uuid)
                                if (presEl) {
                                    if (presEl.preservationType) {
                                        presArray.push(presEl.preservationType.replace(',',';'))
                                    } else {
                                        presArray.push(' ')
                                    }
                                } else {
                                    presArray.push(' ')
                                }
                            })
                            element.itemPreservations = presArray.toString()
                        })

                        // photo - not on item-level
                        readDumpFile(multimediaFile, (error, photoResults) => {
                            // make array with  unique ids from photoResults
                            const mediaIDArray = []
                            photoResults.forEach( element => mediaIDArray.push(element.id))   
                            const uniqueMediaIDArray = Array.from(new Set(mediaIDArray))
                            
                            const uniqueMediaObjArray = []
                            uniqueMediaIDArray.forEach (element => uniqueMediaObjArray.push({id1: element}))
                            

                            photoResults.forEach (element => {
                                //find this id in uniqueMediaObjArray
                                medEl = uniqueMediaObjArray.find(el => el.id1 === element.id)
                                if (medEl) {
                                    const photoID = element.identifier.substring(element.identifier.indexOf('id=')+ 3,element.identifier.indexOf('&type'))
                                    // and put the data for this organism into an object. If more items, add items to object
                                    if (!medEl.hasOwnProperty('photoIDs')) {
                                        medEl.photoIDs = photoID
                                        medEl.photoIdentifiers = element.identifier
                                        medEl.licenses = element.license
                                        
                                    } else {
                                        tempArray = medEl.photoIDs.split(",")
                                        tempArray.push(photoID)
                                        medEl.photoIDs = tempArray.toString()
                                        
                                        tArrayIdentifiers = medEl.photoIdentifiers.split(",")
                                        tArrayIdentifiers.push(element.identifier)
                                        medEl.photoIdentifiers = tArrayIdentifiers.toString()

                                        tArrayLicenses = medEl.licenses.split(",")
                                        tArrayLicenses.push(element.license)
                                        medEl.licenses = tArrayLicenses.toString()
                                    }
                                }
                            })
                            uniqueOrgArray.forEach(element => {
                                medEl2 = uniqueMediaObjArray.find(el => el.id1 === element.id)
                                if (medEl2) {
                                  //  if (!element.hasOwnProperty('photoIDs')) {
                                        element.photoIDs = medEl2.photoIDs
                                        element.photoIdentifiers = medEl2.photoIdentifiers
                                        element.licenses = medEl2.licenses
                                    //} else {
                                    //     element.licenses = medEl2.licenseselement.photoIDs = "#N/A"
                                    //     element.photoIdentifiers = "#N/A"
                                    //     element.licenses = "#N/A"                                        
                                    // }
                                } else {
                                    element.photoIDs = "#N/A"
                                    element.photoIdentifiers = "#N/A"
                                    element.licenses = "#N/A"
                                }
                                
                                //console.log(element)
                            })
                            
                            let newResults = papa.unparse(uniqueOrgArray, {
                                delimiter: "\t",
                            })
                            fs.writeFileSync(outfileName, newResults)    

                        })
                    })
                })
            })
        })
    })
}

//stitchFiles(birdOccurrenceFile,birdPreparationFile,birdAmplificationFile,birdMaterialsampleFile,birdPreservationFile,birdMultimediaFile,'../data/bird_stitched_file.txt')
//stitchFiles(mammalOccurrenceFile,mammalPreparationFile,mammalAmplificationFile,mammalMaterialsampleFile,mammalPreservationFile,mammalMultimediaFile,'../data/mammal_stitched_file.txt')
//stitchFiles(fishHerpOccurrenceFile,fishHerpPreparationFile,fishHerpAmplificationFile,fishHerpMaterialsampleFile,fishHerpPreservationFile,fishHerpMultimediaFile,'../data/fishHerp_stitched_file.txt')
stitchFiles(otherOccurrenceFile,otherPreparationFile,otherAmplificationFile,otherMaterialsampleFile,otherPreservationFile,otherMultimediaFile,'../data/other_stitched_file.txt')