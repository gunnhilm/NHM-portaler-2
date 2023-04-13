const readline = require('readline');
const fs = require('fs')

const setLoanfile = (museum = 'nhm', samling) => {
    const loanInfoFile = './src/data/' + museum +'/loanInfo.txt'  
    return loanInfoFile 
}

const getHeaderIndex = (heardersToKeep, line) => {
    const tempArray = line.split('\t')
    const holdArray = []
    heardersToKeep.forEach(element => {
        holdArray.push(tempArray.indexOf(element))
        
    });
    tempArray.length = 0
    return holdArray
}
 //Trim array based on indexArray
const trimArray = (holdArray, line) => {
    const tempArray = line.split('\t')
    let result = holdArray.map(i => tempArray[i])
    tempArray.length = 0
    const resultString = result.join('\t')
    return resultString
}

const LoanInfoSearch = (searchTerm, limit = 1000, callback) => {
const loanfile = setLoanfile()
const heardersToKeep = ["COLLECTION", "LOAN_OUT_HEAD", "DATE_OF_LOAN", "DATE_OF_COMPLETE_RETURN", "LABEL_ID", "REGNR", "TAXON_NAME_LOAN_TIME", "SPECIMEN_DATE_OF_RETURN"]
let trimedLine = ''
let holdArray = []
    if (fs.existsSync(loanfile)) {
        // remove whiteSpace
        searchTerm = searchTerm.trim()
        // Case insensitve search
        searchTerm = searchTerm.toLowerCase()
        terms = searchTerm.split(' ')
        let results = ''
        const readInterface = readline.createInterface({
            input: fs.createReadStream(loanfile),
            console: false
        })

        let count = 0  // iterates over each line of the current file
        let resultCount = 0
        readInterface.on('line', function(line) {
            count++
            if (resultCount == limit) {
                readInterface.close()
            } 
            if (count === 1) {
                // header row 
                holdArray = getHeaderIndex(heardersToKeep, line)
               results = trimArray(holdArray, line)
            } else {
                if (terms.length === 1){
                    if (line.toLowerCase().indexOf(terms[0]) !== -1) {
                        trimedLine = trimArray(holdArray, line)
                        results =  results + '\n' + trimedLine
                        resultCount++
                        trimedLine = ''
                    } 
                }
                // Loope igjennom alle søkeordene og sjekke om de fins i linja
                else if (line.toLowerCase().indexOf(terms[0]) !== -1) {
                    // Hvis linja inneholder det først søkeordet, sjekk om det også inneholder de andre
                    for(let i = 1; i < terms.length; i++){
                        if(line.toLowerCase().indexOf(terms[i]) === -1){
                        // hvis vi ikke får treff så bryter vi loopen (-1 = fant ikke)
                            break;
                        }
                        // hvis alle runden med søk har gått bra så lagrer vi resultatet (må trekke fra 1 da arrayet er null basert)
                        if (i === (terms.length -1) ) {
                            trimedLine = trimArray(holdArray, line)
                            results =  results + '\n' + trimedLine
                            resultCount++
                            trimedLine = ''
                        }
                    }
                }
            }
            
        }).on('close', function () {
            const resulstAndLine = {results, resultCount }
            // console.log(resulstAndLine.results);
            
            callback(undefined, resulstAndLine)
        })
       
    } else {
        throw new Error ('File not found ');
    }
}



module.exports = {LoanInfoSearch}