function renderHeaderContent (lang) {

    if (lang === "English") {
        index = 1
    } else {
        index = 0
    }

    //header
    let logo = document.querySelector('#logo');
    let uniLogo = document.querySelector('#Uni-logo')
    const homeLink = document.getElementById('home-link');
    
    if (window.location.href.includes('tmu')) {
        logo.src = textItems.logoTMU[index];
        homeLink.setAttribute('href', '/museum/tmu');
    } else if (window.location.href.includes('/um')) {
        logo.src = textItems.logoUM[index];
        homeLink.setAttribute('href', '/museum/um');
    } else if (window.location.href.includes('/museum/nbh')) {
        logo.src = textItems.logoNBH[index];
        homeLink.setAttribute('href', '/museum/nbh');
    } else if (window.location.href.includes('/museum/nhm')) {
        logo.src = textItems.logoNHM[index];
        homeLink.setAttribute('href', '/museum/nhm');
        uniLogo.src = textItems.logoUiO[index]
    }


    document.querySelector('#help-link').innerHTML = textItems.helpButton[index]
    document.querySelector('#tools-link').innerHTML = textItems.toolsButton[index]
    document.querySelector('#search-page-link').innerHTML = textItems.searchPageLink[index]
    document.querySelector('#arkiv-link').innerHTML = textItems.arkivLink[index]
    document.querySelector('#menu_help-link').innerHTML = textItems.helpButton[index]
    document.querySelector('#menu_tools-link').innerHTML = textItems.toolsButton[index]
    document.querySelector('#menu_search-page-link').innerHTML = textItems.searchPageLink[index]
    document.querySelector('#menu_arkiv-link').innerHTML = textItems.arkivLink[index]
    document.querySelector('#mobileMenuBtn').innerHTML = textItems.mobileMenuBtn[index]

    /* When the user clicks on the menu-button (mobile-screens),
    toggle between hiding and showing the dropdown content */
    document.getElementById("mobileMenuBtn").onclick = function () {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            const dropdowns = document.getElementsByClassName("dropdown-content");
            let i;
            for (i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
}