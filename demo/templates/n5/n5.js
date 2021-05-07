function onKanjiComplete()
{
    $('#draw_kanji_label').text("You did it!  Great!!!");
    setTimeout(make_kanji_canvas, 2000);    
}

function onKanjiError()
{
    $('#draw_kanji_label').text(kanjiCanvas.errorMessage);                
    setTimeout(make_kanji_canvas, 2000);    
}

function init_home_page() {
    
    var canvas = document.getElementById("kanji_canvas");
    if (canvas != null) { 
       make_kanji_canvas('一', true, 210, 210);
       make_canvas_drawable(canvas);
       $('#kanji_canvas').on('kanjicomplete', onKanjiComplete);
       $('#kanji_canvas').on('kanjierror', onKanjiError);
    }
}