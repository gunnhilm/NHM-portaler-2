const textItems2 = {
    searchButtonHeader: ["Søk", "Search"],
    aboutButton: ["Om sidene", "About"],
    helpButton: ["Hjelp", "Help"],
    logo: ["/images/uio_nhm_segl_a.png", "/images/uio_nhm_seal_a_eng.png"],
}

const renderText2 = function(lang) {
    if (lang === "Norwegian") {
        index = 0
    } else if (lang === "English") {
        index = 1
    }


    document.querySelector('#searchButtonHeader').innerHTML = textItems2.searchButtonHeader[index]
    document.querySelector('#aboutButton').innerHTML = textItems2.aboutButton[index]
    document.querySelector('#helpButton').innerHTML = textItems2.helpButton[index]
    document.querySelector('#logo').src = textItems2.logo[index]

}

language = document.querySelector('#language').value
renderText2(language)

document.querySelector('#language').addEventListener('change', (e) => {
    language = e.target.value
    renderText2(language)
})


