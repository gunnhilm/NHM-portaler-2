const Sendmail = () => {
    
}

const requestLoan = (data) => {
    console.log('i lån på server');
    console.log(data.loanObjects0.length);
    for (let i = 0; i < data.loanObjects0.length; i++) {
        const element = data.loanObjects0[i];
        console.log(element);
        
    }
    Sendmail()
}

module.exports = {requestLoan}