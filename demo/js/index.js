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
    navigator.resetToPage('templates/n5/index.html');

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

document.addEventListener('init', function(event) {  
  var page = event.target;
  if (page.matches('#kanjiPage')) {    
    page.querySelector('ons-toolbar-button').onclick = function() {
      ons.notification.alert(`Kanji Handwriting Drillpad<br/>
Copyright 2021 Alexander Harry Golden<br/><br/>

Developed using the following open source software:<br/><br/>
Provided Under <a href = "https://opensource.org/licenses/MIT" target="_new">MIT License</a>:
<ul>
<li><a href = "https://jquery.com/" target="_new">jQuery</a><br/></li>
<li><a href = "https://dmitrybaranovskiy.github.io/raphael/" target = "_new">Raphaël</a></li>
<li><a href = "https://maxwellito.github.io/vivus/" target = "_new">vivus</a></li></ul>

Provided Under <a href = "https://creativecommons.org/licenses/by-sa/3.0/" target="_new">Creative Commons Attribution-ShareAlike 3.0 Unported</a>:
<ul><li><a href = "https://github.com/KanjiVG/kanjivg" target = "_new">KanjiVG</a></li></ul>

Provided Under <a href = "https://www.apache.org/licenses/LICENSE-2.0" target="_new">Apache License Version 2.0</a>:
<ul><li><a href = "https://github.com/OnsenUI" target = "_new">OnsenUI</a></li></ul>
`);
    };
  }
});