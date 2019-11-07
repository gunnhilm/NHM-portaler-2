const textItemsAbout = {
    aboutHeader: ["Om NHMs samlingsportal", "About NHM's collection portal"],
    aboutText: ["Nettportalen er laget av Eirik Rindal og Gunnhild Marthinsen ", "The web portal is made by Eirik Rindal and Gunnhild Marthinsen"]
}

const renderTextAbout = function(lang) {
    if (lang === "Norwegian") {
        index = 0
    } else if (lang === "English") {
        index = 1
    }

    // help page
    document.querySelector('#aboutHeader').innerHTML = textItemsAbout.aboutHeader[index]
    document.querySelector('#aboutText').innerHTML = textItemsAbout.aboutText[index]

}

renderTextAbout("Norwegian")

document.querySelector('#language').addEventListener('change', (e) => {
    console.log(e.target.value)
    language = e.target.value
    renderTextAbout(language)
    //document.location.reload(true)
})

