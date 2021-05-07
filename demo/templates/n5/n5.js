var kanjiData;

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
       make_kanji_canvas(' ', true, 210, 210);
       make_canvas_drawable(canvas);
       $('#kanji_canvas').on('kanjicomplete', onKanjiComplete);
       $('#kanji_canvas').on('kanjierror', onKanjiError);
    }

    $.get("japanese-kanji-jlpt-n5.yml", onKanjiList);
}

function onKanjiList(data)
{
  kanjiData = data.split("\n");

  for (var i=4; i < kanjiData.length; i++) {
    if ((kanjiData[i].trim()) == "") {
      continue;
    }

    addKanjiToMenu(kanjiData[i]);
  }
}

function getEnglishHint(kanji, kajiData)
{
  if (typeof kanjiData === 'undefined') {
    return null;
  }

  for (var i=0; i < kanjiData.length; i++) {    
    if ((kanjiData[i].trim()) == "") {
      continue;
    }

    var tokens = kanjiData[i].split(":");

    if (tokens[0].trim() == kanji) {      
      return tokens[1];
    }
  }

  return null;
}

function addKanjiToMenu(kanjiInfo)
{
  var tokens = kanjiInfo.split(":");

  var html = `
<ons-list-item tappable onClick="make_kanji_canvas('$kanji');$('#kanji_svg').show();">
    <label class="left">
        <ons-radio name="kanji" input-id="$kanjiLabel" checked></ons-radio>
    </label>
    <label for="$kanjiLabel" class="center">
        $kanjiLabel
    </label>
</ons-list-item>`;

  html = html.replace("$kanji", tokens[0].trim());
  html = html.replaceAll("$kanjiLabel", tokens[1].trim());

  $("#kanji_list").append(html);
}