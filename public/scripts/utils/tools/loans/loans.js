//loans button 
const loansButton = document.querySelector('#loan-button')
console.log('vi er her');
document.getElementById("loan-button").style.display = "none";
// document.querySelector('#loan-button').style.display = "none";




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
loansButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('lån');
    startLoans()
    openPage()
    

})

