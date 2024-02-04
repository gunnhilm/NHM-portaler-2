//loans button 
console.log('vi er her på lån');
function addLoansToDropDown() {
    // Check if an option with the same id already exists
    if (!document.getElementById("loan-records")) {
        // Create a new option element
        const newOption = document.createElement("option");
        newOption.value = "loan-records";
        newOption.id = "loan-records";
        newOption.text = "Lån";
        
        // Get the select element
        const actionSelect = document.getElementById("action-select");
        
        // Append the new option to the select element
        actionSelect.appendChild(newOption);
    }
}

function removeLoansFromDropDown() {
    // Get the select element
    const actionSelect = document.getElementById("action-select");
    
    // Get the "loan-records" option element
    const loanOption = document.getElementById("loan-records");
    
    // Check if the option exists in the select element
    if (loanOption && loanOption.parentNode === actionSelect) {
        // Remove the option from the select element
        actionSelect.removeChild(loanOption);
    }
}


const getSelectedItems = () => {
    const searchResult = JSON.parse(sessionStorage.getItem('string'))
    // loop through - put those wich checked in new array
    const newArray = []
    searchResult.forEach(el => {
        if (el.checked) {newArray.push(el)}
    })
    return newArray
}


const startLoans = () => {
    const loanArray = getSelectedItems()
    if (loanArray === 0) {
        alert (' Select object to loan')
    } else {
        const loanItems = JSON.stringify(loanArray)
        sessionStorage.setItem("loanItems", loanItems)
    }
}

const openPage = () => {
    let url = window.location.href
    url = url + '/loans'
    window.location.href = url
    // window.location.replace('loans')
}

// When some pushes the loan button
// loansButton.addEventListener('click', (e) => {
// document.getElementById('loan-records').addEventListener('click', (e) => {
//     e.preventDefault()
//     console.log('lån');
//     startLoans()
//     openPage()
    

// })

// is called by load() in paginateAndRender.js
function mainLoan() {
    try {
        // Get the current collection from session storage
        const currentCollection = sessionStorage.getItem("chosenCollection");
        console.log(currentCollection);
        
        // Get the file list from session storage
        const fileList = sessionStorage.getItem("fileList");
        const JSONdata = JSON.parse(fileList);
        
        // Check if the loan button should be activated for the current collection
        const isLoanEnabled = JSONdata.some(el => el.name === currentCollection && el.loan === true);
        
        if (isLoanEnabled) {
            // Add the "loan-records" option to the dropdown if it does not already exist
            addLoansToDropDown();
        } else {
            console.log("Loan is not enabled");
            removeLoansFromDropDown()
        }
        

    } catch (error) {
        console.log('Loans error: ' + error);
    }
}
