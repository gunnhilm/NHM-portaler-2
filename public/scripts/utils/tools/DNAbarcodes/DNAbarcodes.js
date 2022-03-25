


document.getElementById("getBarcodeHeader").innerHTML = "Barcoded fungi in NorBOL"
document.getElementById("getBarcodeText").innerHTML = "Last updated 10.8.2021 <br> <br>Legend: <br>1: Specimens sequenced at iBOL <br> 2: Sampled specimens, to be sequenced at iBOL <br> 3: Specimens selected for sampling at O <br><br> Click on species name to see which counties (fylker) the specimens are from"



const getFastaData = () => {
    
    return new Promise(resolve => {
        const url =   urlPath + '/DNAbarcodes/?getFasta=true'
    
        fetch(url).then((response) => { 
            
            response.text().then((data) => {
                
                if(data.error) {
                    return console.log(data.error)
                } else {          
                    try {
                        data = JSON.parse(data)
                        data = data.unparsed
                        resolve(data)
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        })
    })
}






async function main() {
    data = await getFastaData() //Gjør en request til server om å få innholdet i fasta.fas
    console.log(data);
    
}

main()
