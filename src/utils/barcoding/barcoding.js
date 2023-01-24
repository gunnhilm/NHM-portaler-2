// backend functions used in Tools --> DNA barcode-pages

const fs = require('fs')
const readline = require('readline')

// find date last modified for file
async function lastModified (infile) {
    try {
        stats = fs.statSync(infile)
        // console.log(stats.ctime)
        return stats
    } catch (error) {
        console.log(error)
    }
}

// const lastModified = () => {
//     lastModified(`src/data/nhm/fasta_${coll}.fas`).then((a) => {
//         console.log(a) 
//         return a
//     })
    
// }
// b = printLastModified()
// console.log(b)

// reads fasta-file with all sequences from NorBOL downloaded from BOLD.
// Gunnhild updates fasta-file irregularly, its static
// returns array with objects; one object for each species, with musit-regnos, processIDs and counties
const getFasta = async (query, callback) => {
    try { 
        let coll = query.coll
        let barcoded_species = []
        if (!fs.existsSync(`./src/data/nhm/fasta_${coll}.fas`)) {
            console.log('fasta.fas file does  not exist')
        } else {
            const readInterface = readline.createInterface({
                input: fs.createReadStream(`./src/data/nhm/fasta_${coll}.fas`),
                console: false
            })
            readInterface.on('line', function(line) {
                if (line.includes('|')) { 
                    let variables = line.split("|")
                    let processID = variables[0]
                    let species = variables[1]
                    let regno = variables[2]
                    let regno2
                    let county
                    if (coll === "mammals") {
                        regno2 = variables[3]
                        county = variables[4]   
                    } else {
                        county = variables[3]
                    }
                    
                    let existingRecord = barcoded_species.find(item => item.species === species)
                    if (existingRecord) {
                        existingRecord.number ++
                        existingRecord.processIDs.push(processID)
                        existingRecord.regnos2.push(regno2)
                        existingRecord.regnos.push(regno)
                        existingRecord.counties.push(county)

                    } else {
                        barcoded_species.push({"species": species, "number": 1, "processIDs": [processID], "regnos": [regno], "regnos2": [regno2], "counties": [county]})
                    }
                }
            })
            .on('close', function () {
                barcoded_species.sort((a, b) => {
                    let fa = a.species.toLowerCase(),
                    fb = b.species.toLowerCase()
                    if (fa < fb) {
                        return -1
                    }
                    if (fa > fb) {
                        return 1
                    }
                    return 0
                })
                
                callback(undefined, barcoded_species)
            })
        }
    } catch(error) {
        console.log('error in getDNAbarcoding on backend ' + error)
        throw new Error ('error in getDNAbarcoding')
    }
    
}

// reads overview-txt-file for fungal barcodes maintained by Gunnhild. Gunnhild updates file irregularly.
// returns array with objects; one for each species, with sequence lengths, validation-statuses, validation-methods and more
const getOverview = async (query, callback) => {
    const readInterface = readline.createInterface({
        input: fs.createReadStream(`./src/utils/barcoding/sopp_oversikt.txt`),
        console: false
    })
    let overviewArray = []
    let lineCount
    lineCount = 0
    let headers = []
    readInterface.on('line', function(line) {
        lineCount ++
        lineArray = line.split('\t')

        if (lineCount === 1) {
            headers = lineArray  
        }

        if (lineCount != 1) {
                let processID = lineArray[headers.indexOf('BOLD Process-ID')]
                let musitRegno = lineArray[headers.indexOf('MUSIT no with prefix')]
                // console.log(musitRegno)
                let species = lineArray[headers.indexOf('Vitenskapelig navn i BOLD')].trim()
                let seqLength = lineArray[headers.indexOf('sekvenslengde')]
                let validationStatus = lineArray[headers.indexOf('Validert vitenskapelig navn etter strekkoding')]
                let validationMethod = lineArray[headers.indexOf('valideringsmetode')]
                let expert = lineArray[headers.indexOf('Ekspert')]
                let year = lineArray[headers.indexOf('Innsamlingsdato')]
                // let amount = 1
            
            let existingRecord = overviewArray.find(item => item.species === species)
            if (existingRecord) {
                existingRecord.amount ++
                existingRecord.processID.push(processID)
                existingRecord.musitRegno.push(musitRegno)
                existingRecord.seqLength.push(seqLength)
                existingRecord.validationStatus.push(validationStatus)
                existingRecord.validationMethod.push(validationMethod)
                existingRecord.expert.push(expert)
                existingRecord.year.push(year)
            } else {
                overviewArray.push({"processID": [processID], "musitRegno": [musitRegno], "species": species, "seqLength": [seqLength],
                "validationStatus": [validationStatus], "validationMethod": [validationMethod], "expert": [expert], "amount": 1, "year": [year]})    
            }
            
            // }
        } 
        
    })
    .on('close', function () {
        // res.send(overviewArray)
        callback(undefined, overviewArray)
    })
}
module.exports = { 
    getFasta,
    getOverview
}