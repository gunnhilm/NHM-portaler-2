// function to swap urls according to chosen museum for advanced-search-link
// in: path (string, path to page)
// in: link (string, id of header link)
// is called by getMuseumSpesificURL()
function swapURL(path, link) {
    document.getElementById(link).setAttribute('href', path)
}

//calls swapURL-function for all header-links and advanced-search-link, with correct museum path
const getMuseumSpecificURL = () => {
    if (window.location.href.includes('/um')) {
        swapURL('/museum/um/advancedSearch/', 'adv-search-link')
    } else if (window.location.href.includes('tmu')){
        swapURL('/museum/tmu/advancedSearch', 'adv-search-link')
    }  else if (window.location.href.includes('nbh')){
        swapURL('/museum/nbh/advancedSearch', 'adv-search-link')
    }else {
        swapURL('/museum/nhm/advancedSearch', 'adv-search-link')
    }
}

getMuseumSpecificURL()

