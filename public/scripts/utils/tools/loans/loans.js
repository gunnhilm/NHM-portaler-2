//loans button 
const loansButton = document.querySelector('#loan-button')

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
        console.log(loanArray);
    }
}



// When some pushes the loan button
loansButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('lån');
    startLoans()

})

