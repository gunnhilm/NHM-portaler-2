// function to swap urls according to chosen museum for header-links, and remove journal-link from header for museums but NHM
// in: path (string, path to page)
// in: link (string, id of header link)
// is called by getMuseumSpesificURL()
function swapURL(path, link) {
    document.getElementById(link).setAttribute('href', path)
}

//calls swapURL-function for all header-links, with correct museum path
const getMuseumSpecificURL = () => {
    if (window.location.href.includes('/um')) {
        swapURL('/museum/um/help', 'help-link')
        swapURL('/museum/um/tools', 'tools-link')
        swapURL('/museum/um/', 'search-page-link')
        document.getElementById('journal-link').style.display = 'none'
        // mobile-screen-links
        swapURL('/museum/um/help', 'menu_help-link')
        swapURL('/museum/um/tools', 'menu_tools-link')
        swapURL('/museum/um/', 'menu_search-page-link')
        document.getElementById('menu_journal-link').style.display = 'none'
    } else if (window.location.href.includes('tmu')){
        swapURL('/museum/tmu/help','help-link')
        swapURL('/museum/tmu/tools', 'tools-link')
        swapURL('/museum/tmu/', 'search-page-link')
        document.getElementById('journal-link').style.display = 'none'
        // mobile-screen-links
        swapURL('/museum/tmu/help', 'menu_help-link')
        swapURL('/museum/tmu/tools', 'menu_tools-link')
        swapURL('/museum/tmu/', 'menu_search-page-link')
        document.getElementById('menu_journal-link').style.display = 'none'
    }  else if (window.location.href.includes('nbh')){
        swapURL('/museum/nbh/help','help-link')
        swapURL('/museum/nbh/tools', 'tools-link')
        swapURL('/museum/nbh/', 'search-page-link')
        document.getElementById('journal-link').style.display = 'none'
        // mobile-screen-links
        swapURL('/museum/nbh/help', 'menu_help-link')
        swapURL('/museum/nbh/tools', 'menu_tools-link')
        swapURL('/museum/nbh/', 'menu_search-page-link')
        document.getElementById('menu_journal-link').style.display = 'none'
    }else {
        swapURL('/museum/nhm/help', 'help-link')
        swapURL('/museum/nhm/', 'search-page-link')
        swapURL('/museum/nhm/tools', 'tools-link')
        // mobile-screen-links
        swapURL('/museum/nhm/help', 'menu_help-link')
        swapURL('/museum/nhm/tools', 'menu_tools-link')
        swapURL('/museum/nhm/', 'menu_search-page-link')
    }
}

getMuseumSpecificURL()

