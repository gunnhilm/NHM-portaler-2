const readline = require('readline');
const fs = require('fs');
const { first } = require('easy-template-x');

// not in use May 2024: will come in handy if more museums are to use it
const setLoanfile = (museum = 'nhm', samling) => {
    const loanInfoFile = './src/data/' + museum +'/musit-loans.json'  
    return loanInfoFile 
}


const LoanInfoSearch2 = (museum,searchTerm) => {
    // get loan-dump
    loanInfoJSON = require(`./../../../data/${museum}/musit-loans.json`)
    // turn into string
    loanString = JSON.stringify(loanInfoJSON)
    // put each loan as separate entities into an array:
    loanStringArray = loanString.split("loanId") // "loanID" disappears from strings
    // remove exessive brackets from last object
    loanStringArray[loanStringArray.length-1] = loanStringArray[loanStringArray.length-1].slice(0,-2)
    let str = "{\"loanId"
    let loanObjArray = []
    for (i=1;i<loanStringArray.length;i++){
        loanStringArray[i] = str.concat(loanStringArray[i])
        if (i!=loanStringArray.length-1) {loanStringArray[i] = loanStringArray[i].substring(0,loanStringArray[i].length-3)} // remove ",{" in the end of each object-string
        let newObj = JSON.parse(loanStringArray[i])// turn into object
        // remove unwanted fields
        let label_id_array = []
        let taxon_name_loan_time_array = []
        let regnr_array = []
        let specimen_date_of_return_array = []
        newObj.loanOutSpecimen.forEach((el) => {
            label_id_array.push(el.LABEL_ID)
            taxon_name_loan_time_array.push(el.TAXON_NAME_LOAN_TIME)
            if (el.REGNR) {regnr_array.push(el.REGNR)}
            if (el.SPECIMEN_DATE_OF_RETURN) {specimen_date_of_return_array.push(el. SPECIMEN_DATE_OF_RETURN)}
        })
    
        let strippedObject = {
            "collection": newObj.collection.COLLECTION,
            "loan_out_head": newObj.loanOutHeading.LOAN_OUT_HEAD,
            "date_of_loan": newObj.loanOutHeading.DATE_OF_LOAN,
            "date_of_complete_return": newObj.loanOutHeading.DATE_OF_COMPLETE_RETURN,
            "label_id": label_id_array,
            "regnr": regnr_array,
            "taxon_name_loan_time": taxon_name_loan_time_array,
            "specimen_date_of_return": specimen_date_of_return_array
        }
        // clone object so that there is one object for each record
        if (strippedObject.label_id.length>1) {
            for (j=0;j<strippedObject.label_id.length;j++) {
                const newObj2 = JSON.parse(JSON.stringify(strippedObject))
                newObj2.label_id = strippedObject.label_id[j]
                if (newObj2.regnr.length > 0) newObj2.regnr = strippedObject.regnr[j]
                newObj2.taxon_name_loan_time = strippedObject.taxon_name_loan_time[j]
                if (newObj2.regnr.length > 0) newObj2.specimen_date_of_return = strippedObject.specimen_date_of_return[j]
                //// turn back to string
                let strippedStringLocal = JSON.stringify(newObj2)        
                loanObjArray.push(strippedStringLocal)
            } 
        } else {
            //// turn back to string
            let strippedString = JSON.stringify(strippedObject)
            loanObjArray.push(strippedString)
        }
    }
    // remove whiteSpace
    searchTerm = searchTerm.trim()
    terms = searchTerm.split(' ')
    let result = loanObjArray.filter((el) => el.toLowerCase().includes(terms[0].toLowerCase()))
    if (terms.length > 1){
        for(let i = 1; i < terms.length; i++) {
            result = result.filter((el) => el.toLowerCase().includes(terms[i].toLowerCase()))
        }
    }
    return result
}




module.exports = {LoanInfoSearch2}