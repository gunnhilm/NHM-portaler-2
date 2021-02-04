// function to swap urls for header-links, and remove journal-link from header
function swapURL(path, link) {
    document.getElementById(link).setAttribute('href', path)
}
    
const getMuseumSpecificURL = () => {
    if (window.location.href.includes('um')) {
        swapURL('/nhm/um/help', 'help-link')
        swapURL('/nhm/um/showStat', 'statistikk-link')
        swapURL('/nhm/um/', 'search-page-link')
        document.getElementById('journal-link').style.display = 'none'
        // mobile-screen-links
        swapURL('/nhm/um/help', 'menu_help-link')
        swapURL('/nhm/um/showStat', 'menu_statistikk-link')
        swapURL('/nhm/um/', 'menu_search-page-link')
        document.getElementById('menu_journal-link').style.display = 'none'
    } else if (window.location.href.includes('tmu')){
        swapURL('/nhm/tmu/help','help-link')
        swapURL('/nhm/tmu/showStat', 'statistikk-link')
        swapURL('/nhm/tmu/', 'search-page-link')
        document.getElementById('journal-link').style.display = 'none'
        // mobile-screen-links
        swapURL('/nhm/tmu/help', 'menu_help-link')
        swapURL('/nhm/tmu/showStat', 'menu_statistikk-link')
        swapURL('/nhm/tmu/', 'menu_search-page-link')
        document.getElementById('menu_journal-link').style.display = 'none'
    } else {
        swapURL('/nhm/nhm/help', 'help-link')
        swapURL('/nhm/nhm/showStat', 'statistikk-link')
        swapURL('/nhm/nhm/', 'search-page-link')
        // mobile-screen-links
        swapURL('/nhm/nhm/help', 'menu_help-link')
        swapURL('/nhm/nhm/showStat', 'menu_statistikk-link')
        swapURL('/nhm/nhm/', 'menu_search-page-link')
    }
}

getMuseumSpecificURL()

