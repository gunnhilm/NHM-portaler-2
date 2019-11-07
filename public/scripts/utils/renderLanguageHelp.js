const textItemsHelp = {
    // help page
    helpHeader: ["Hjelpeside", "Help page"],
    helpText: ["Her kommer en hjelpetekst", "Help-text to come"]
}

const renderTextHelp = function(lang) {
    if (lang === "Norwegian") {
        index = 0
    } else if (lang === "English") {
        index = 1
    }

    // help page
    document.querySelector('#helpHeader').innerHTML = textItemsHelp.helpHeader[index]
    document.querySelector('#helpText').innerHTML = textItemsHelp.helpText[index]

}

renderTextHelp("Norwegian")

document.querySelector('#language').addEventListener('change', (e) => {
    language = e.target.value
    renderTextHelp(language)
})

