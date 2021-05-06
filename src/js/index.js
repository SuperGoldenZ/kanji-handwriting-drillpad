var splitterMenu;
var splitterContent;
var toolbarTitle;

/**
 * Initializes app variables
 */
function initializeApp() {
    splitterMenu = document.getElementById('splitterMenu');
    splitterContent = document.getElementById('splitterContent');
    toolbarTitle = document.getElementById('toolbarTitle');


    const navigator = document.querySelector('#navigator');
    navigator.resetToPage('/templates/home/n5.html');

    //hideStrokeOrder();
    console.log("Loaded");
}

/**
 * Loads a page and sets the toolbar title
 */
function loadPage(page, title) {
    toolbarTitle.innerHTML = title;

    //splitterContent.load(page);
    //splitterMenu.close()
}

/**
 * Toggles the Side menu
 */
function toggleMenu() {
    splitterMenu.toggle();
}

// Initialize the app on Onsen UI `ready` event
ons.ready(initializeApp);


var dmak = null;


document.addEventListener('show', function(event) {
    var page = event.target;
    console.log(page);
    
    if (page.matches('#kanjiPage')) {
        init_home_page();        
    }
    
    if (page.matches("#gamePage")) {
        init_game_page();
    }
});
