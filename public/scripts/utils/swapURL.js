// function to swap urls for header-links, and remove journal-link from header
function swapURL(path, link) {
    document.getElementById(link).setAttribute('href', path)
}
    
const getMuseumSpecificURL = () => {
    if (window.location.href.includes('/um')) {
        swapURL('/museum/um/help', 'help-link')
        swapURL('/museum/um/showStat', 'statistikk-link')
        swapURL('/museum/um/', 'search-page-link')
        document.getElementById('journal-link').style.display = 'none'
        // mobile-screen-links
        swapURL('/museum/um/help', 'menu_help-link')
        swapURL('/museum/um/showStat', 'menu_statistikk-link')
        swapURL('/museum/um/', 'menu_search-page-link')
        document.getElementById('menu_journal-link').style.display = 'none'
    } else if (window.location.href.includes('tmu')){
        swapURL('/museum/tmu/help','help-link')
        swapURL('/museum/tmu/showStat', 'statistikk-link')
        swapURL('/museum/tmu/', 'search-page-link')
        document.getElementById('journal-link').style.display = 'none'
        // mobile-screen-links
        swapURL('/museum/tmu/help', 'menu_help-link')
        swapURL('/museum/tmu/showStat', 'menu_statistikk-link')
        swapURL('/museum/tmu/', 'menu_search-page-link')
        document.getElementById('menu_journal-link').style.display = 'none'
    } else {
        swapURL('/museum/nhm/help', 'help-link')
        swapURL('/museum/nhm/showStat', 'statistikk-link')
        swapURL('/museum/nhm/', 'search-page-link')
        // mobile-screen-links
        swapURL('/museum/nhm/help', 'menu_help-link')
        swapURL('/museum/nhm/showStat', 'menu_statistikk-link')
        swapURL('/museum/nhm/', 'menu_search-page-link')
    }
}

getMuseumSpecificURL()

