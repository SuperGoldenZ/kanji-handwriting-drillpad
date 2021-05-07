var kanjiCanvas = {
    canvas: null,
    context: null,
    paint: false,
    mouseX: 0,
    mouseY: 0,
    clickX: new Array(),
    clickY: new Array(),
    clickDrag: new Array(),
    strokes: new Array(),
    strokeNum: 0,
    kanji: null,
    errorMessage: null,
    vivus: null,
    canDraw: false,
    retry: true,
    width: null,
    height: null,

    init: function(width, height) {
        this.strokeNum = 0;
        this.strokes = new Array();
        this.clickDrag = new Array();
        this.clickX = new Array();
        this.clickY = new Array();
        this.mouseX = 0;
        this.mouseY = 0;
        this.paint = false;
        this.canDraw = false;

        if (width !== undefined && height !== undefined) {
            console.log("width,height: " + width + "," + height);
            this.width = width;
            this.height = height;

            $("#kanji_canvas").css("height", height + "px");
            $("#kanji_canvas").css("width", width + "px");

            $("#kanji_area").css("height", height + "px");
            $("#kanji_area").css("width", width + "px");

            $("#kanji_svg").css("height", height + "px");
            $("#kanji_svg").css("width", width + "px");

            if (this.canvas !== null) {
                this.canvas.width = width;
                this.canvas.height = height;
            }
        }
    },
    clear: function() {
        this.init();
        //this.kanji = null;

        console.log("Canvas cleared");
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        make_kanji_canvas(this.kanji);
    },
    addClick: function(x, y, dragging) {
        var xRatio = this.canvas.width / this.height;
        var yRatio = this.canvas.height / this.width;

        var xRatio = 1;
        var yRatio = 1;

        var xRatio = this.canvas.width / this.height;
        var yRatio = this.canvas.height / this.width;
        console.log("yRatio= " + this.canvas.height + " / " + this.height + " = " + yRatio);

        this.clickX.push(x * xRatio);
        //console.log("y * yRatio = " + y + " / " + this.height + " = " + yRatio);
        this.clickY.push(y * yRatio);
        this.strokes[this.strokes.length - 1].addPoint(new Point(x * (210 / this.width), y * (210 / this.height)));
        this.clickDrag.push(dragging);
    },
    addStroke: function() {
        this.strokeNum = this.strokeNum + 1;
        this.strokes.push(new KanjiStroke(this.strokeNum, new Array()));
    },
    checkKanji: function() {
        var svg = document.getElementById("kanji_svg").contentDocument.documentElement;
        var svgStrokes = $(svg).find('path');

        var checkStrokes = check_strokes(this.strokes, svgStrokes);
        if (checkStrokes == false) {
            $('#kanji_canvas').trigger('kanjierror');
            kanjiCanvas.canDraw = false;
        } else if (this.strokeNum == svgStrokes.length) {
            kanjiCanvas.canDraw = false;
            $('#kanji_canvas').trigger('kanjicomplete');
        }

        return checkStrokes;
    },
    redraw: function() {
        var context = this.context;
        var clickX = this.clickX;
        var clickY = this.clickY;
        var clickDrag = this.clickDrag;

        context.strokeStyle = "#000000";
        //context.lineJoin = "round";
        context.lineWidth = 2;


        //          var xRatio = this.canvas.width / this.height;
        //          var yRatio = this.canvas.height / this.width;

        //var xRatio = this.canvas.width / 209;
        //var yRatio = this.canvas.height / 209;
        var xRatio = 1;
        var yRatio = 1;

        for (var i = clickX.length - 1; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1] * xRatio, clickY[i - 1] * yRatio);
            } else {
                context.moveTo(clickX[i] * xRatio - 1, clickY[i] * yRatio);
            }
            context.lineTo(clickX[i] * xRatio, clickY[i] * yRatio);
            context.closePath();
            context.stroke();
        }
    },
    showActualStroke: function(color) {
        var svg = document.getElementById("kanji_svg").contentDocument.documentElement;
        var svgStrokes = $(svg).find('path');
        $(svgStrokes[this.strokeNum - 1]).css("opacity", 1);
        $(svgStrokes[this.strokeNum - 1]).attr("stroke", color);
    },
    drawBlankCanvas: function() {
        console.log("drawing blank canvas");
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#FFFFFF";
        this.context.fillRect(1, 1, this.canvas.width - 2, this.canvas.height - 2);
    },
    setBorderColor: function(color) {
        this.context.beginPath();
        this.context.lineWidth = "1";
        this.context.strokeStyle = color;
        this.context.rect(1, 1, this.canvas.width - 3, this.canvas.height - 2);
        this.context.closePath();
        this.context.stroke();
    },
    drawGridLines: function() {
        this.drawBlankCanvas();

        this.context.beginPath();
        this.context.lineWidth = "1";
        this.context.strokeStyle = "grey";

        this.context.rect(1, 1, this.canvas.width - 1, (this.canvas.height / 2) - 1);
        this.context.rect(1, 1, (this.canvas.width / 2) - 1, this.canvas.height - 1);
        this.context.closePath();
        this.context.stroke();

        this.setBorderColor("black");

    },
    makeKanjiCanvas: function(kanji, showHint) {
        var canvasElement = document.getElementById("kanji_canvas");
        var context = canvasElement.getContext("2d");
        this.context = context;
        this.canvas = canvasElement;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.kanji = kanji;

        this.drawGridLines();

        if (kanji == ' ') {
            return;
        }

        var kanjiCodeHex = kanji.charCodeAt(0).toString(16);
        var imageFilename = 'images/kanji/0' + kanjiCodeHex + '.svg';

        $('#kanji_svg').attr('data', imageFilename);


        if (showHint) {
            setTimeout(fadeOutGuide, 1000);
        } else {
            console.log("Not showing hint");
            setTimeout(function() {
                fadeOutGuide(1);
            }, 100);
            $('#kanji_svg').css("opacity", 0);
        }
    }
};

function check_strokes(userStrokes, actualStrokes) {
    var result = true;

    for (var i = 0; i < userStrokes.length; i++) {
        if (userStrokes[i].points.length <= 1) {
            kanjiCanvas.errorMessage = "Stroke not long enough";
            return false;
        }
        if (!check_start_end_points(userStrokes[i], actualStrokes[i].outerHTML)) {
            return false;
        }
    }

    return result;
}

function check_start_end_points(userStroke, actualStroke) {
    var result = true;

    var userStartPoint = userStroke.points[0];
    var userEndPoint = userStroke.points[userStroke.points.length - 1];

    var actualStartPoint = Raphael.getPointAtLength(actualStroke, 0);
    console.log(actualStartPoint);

    //@todo remove 2.1 magic number
    actualStartPoint.x *= 2.1;
    actualStartPoint.y *= 2.1;

    //@todo remove 2.1 magic number
    var strokeLength = Raphael.getTotalLength(actualStroke);
    var actualEndPoint = Raphael.getPointAtLength(actualStroke, strokeLength);
    actualEndPoint.x *= 2.1;
    actualEndPoint.y *= 2.1;

    var userMidPoint = userStroke.points[Math.floor(userStroke.points.length / 2)];
    var actualMidPoint = Raphael.getPointAtLength(actualStroke, Math.floor(Raphael.getTotalLength(actualStroke) / 2));
    actualMidPoint.x *= 2.1;
    actualMidPoint.y *= 2.1;


    result = result && comparePoints(userStartPoint, userEndPoint, actualStartPoint, actualEndPoint);
    result = result && comparePoint(userMidPoint, actualMidPoint);

    return result;
}

function sig_difference(val1, val2) {
    return (Math.abs(val1 - val2) > 35);
}

function comparePoint(userPoint, actualPoint) {
    if (sig_difference(actualPoint.x, userPoint.x)) {
        kanjiCanvas.errorMessage = actualPoint.x < userPoint.x ? "Middle of stroke should be more to the left" : "Middle of stroke should be more to the right";
        return false;
    }

    // This was too sensitive for one stroke in KAORU
    //    if (sig_difference(actualPoint.y, userPoint.y)) {
    //        kanjiCanvas.errorMessage = actualPoint.y < userPoint.y ? "Middle of stroke should be higher" : "Middle of stroke should be lower";
    //        return false;
    //    }

    return true;
}

function comparePoints(userStartPoint, userEndPoint, actualStartPoint, actualEndPoint) {
    var result = true;

    if (sig_difference(actualStartPoint.x, userStartPoint.x)) {
        kanjiCanvas.errorMessage = actualStartPoint.x < userStartPoint.x ? "Stroke should start more to the left" : "Stroke should start more to the right";
        return false;
    }

    if (sig_difference(actualStartPoint.y, userStartPoint.y)) {
        kanjiCanvas.errorMessage = actualStartPoint.y < userStartPoint.y ? "Stroke should start higher" : "Stroke should start lower " + Math.floor(actualStartPoint.y) + " vs user " + Math.floor(userEndPoint.y);
        return false;
    }

    if (sig_difference(actualEndPoint.x, userEndPoint.x)) {
        kanjiCanvas.errorMessage = actualEndPoint.x < userEndPoint.x ? "Stroke should end more to the left" : "Stroke should end more to the right";
        return false;
    }

    if (sig_difference(actualEndPoint.y, userEndPoint.y)) {
        kanjiCanvas.errorMessage = actualEndPoint.y < userEndPoint.y ? "Stroke should end higher" : "Stroke should end lower";
        return false;
    }


    if (sig_difference(actualEndPoint.x, actualStartPoint.x)) {
        if (actualEndPoint.x - actualStartPoint.x < 0 && userEndPoint.x - userStartPoint.x >= 0) {
            kanjiCanvas.errorMessage = "Stroke must start from right and end to the left";
            return false;
        } else if (actualEndPoint.x - actualStartPoint.x > 0 && userEndPoint.x - userStartPoint.x <= 0) {
            kanjiCanvas.errorMessage = "Stroke must start from left and end to the right";
            return false;
        }
    }
    /* else if (sig_difference(userStartPoint.x, userEndPoint.x)) {
               kanjiCanvas.errorMessage = "Stroke is too wide";
               return false;        
       } */

    if (sig_difference(actualEndPoint.y, actualStartPoint.y)) {
        if (actualEndPoint.y - actualStartPoint.y < 0 && userEndPoint.y - userStartPoint.y >= 0) {
            kanjiCanvas.errorMessage = "Stroke must start from the bottom and go up";
            return false;
        } else if (actualEndPoint.y - actualStartPoint.y > 0 && userEndPoint.y - userStartPoint.y <= 0) {
            kanjiCanvas.errorMessage = "Stroke must start from the top and go down";
            return false;
        }
    }
    /*else if (sig_difference(userStartPoint.y, userEndPoint.y)) {
               kanjiCanvas.errorMessage = "Stroke is too tall";
               return false;        
       } */

    return result;
}

function make_kanji_canvas(kanji, showHint, width, height) {
    if (showHint === undefined) {
        showHint = true;
    }

    $('#kanji_canvas').show();
    if (kanji === undefined) {
        kanjiCanvas.init(width, height);
        kanjiCanvas.clear();
    } else {
        kanjiCanvas.init(width, height);
        kanjiCanvas.makeKanjiCanvas(kanji, showHint);

        var englishHint = getEnglishHint(kanji);
        if (englishHint != null) {
            $("#draw_kanji_label").html("Draw kanji for " + englishHint);
        } else {
            $("#draw_kanji_label").html("Select a kanji to practice from the list");
        }
        
    }
}

function make_canvas_drawable(canvas, retry) {
    canvas.addEventListener("touchstart", onCanvasMouseDown);
    canvas.addEventListener("touchend", onCanvasMouseUp);
    canvas.addEventListener("touchmove", onCanvasMouseMove);

    canvas.addEventListener("mousedown", onCanvasMouseDown);
    canvas.addEventListener("mousemove", onCanvasMouseMove);
    canvas.addEventListener("mouseup", onCanvasMouseUp);
    canvas.addEventListener("mouseleave", onCanvasMouseUp);
    if (retry === false) {
        kanjiCanvas.retry = retry;
    }
}

function onCanvasMouseDown(e) {
    if (kanjiCanvas.canDraw == false) {
        return;
    }

    kanjiCanvas.paint = true;
    var x, y;

    if (e instanceof MouseEvent) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;
    }

    kanjiCanvas.mouseX = x - this.offsetLeft;
    kanjiCanvas.mouseY = y - this.offsetTop;

    var kanjiArea = document.getElementById("kanji_area");
    kanjiCanvas.addStroke();
    kanjiCanvas.addClick(x - kanjiArea.offsetLeft, y - kanjiArea.offsetTop);
    kanjiCanvas.redraw();
}

function clear_kanji_canvas() {
    var kanjiClear = document.getElementById("kanji_canvas");
    kanjiCanvas.clear();
}

function onCanvasMouseMove(e) {
    if (kanjiCanvas.paint && kanjiCanvas.canDraw != false) {
        var kanjiArea = document.getElementById("kanji_area");
        if (e instanceof MouseEvent) {
            kanjiCanvas.addClick(e.pageX - kanjiArea.offsetLeft, e.pageY - kanjiArea.offsetTop, true);
        } else if (e instanceof TouchEvent) {
            var x = e.changedTouches[0].pageX;
            var y = e.changedTouches[0].pageY;

            kanjiCanvas.addClick(x - kanjiArea.offsetLeft, y - kanjiArea.offsetTop, true);
        }

        kanjiCanvas.redraw();
    }
}

function onCanvasMouseUp(e) {
    if (kanjiCanvas.paint == false) {
        return;
    }

    kanjiCanvas.paint = false;
    var validKanji = kanjiCanvas.checkKanji();
    if (validKanji) {
        kanjiCanvas.showActualStroke("black");
        if (kanjiCanvas.canDraw) {
            kanjiCanvas.drawGridLines();
        } else {
            // @todo special animation when complete  
            kanjiCanvas.drawGridLines();
            //kanjiCanvas.drawBlankCanvas();
            //kanjiCanvas.setBorderColor("green");
        }
    } else {
        kanjiCanvas.showActualStroke("red");
        kanjiCanvas.vivus = new Vivus('kanji_svg', {
            "duration": 25
        });
        // @todo special animation when error
        //kanjiCanvas.setBorderColor("#f93500");
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function KanjiStroke(num, points) {
    this.num = num;
    this.points = points;

    this.addPoint = function(point) {
        this.points.push(point);
        //console.log(point);
    }
}

function fadeOutGuide(speed) {
    var svg = document.getElementById("kanji_svg").contentDocument.documentElement;
    var svgStrokes = $(svg).find('text').animate({
        opacity: 0,
    }, {
        complete: function() {
            kanjiCanvas.canDraw = true;
            $('#kanji_svg').css("opacity", 1);
        },
        duration: speed
    });

    var svgStrokes = $(svg).find('path').animate({
        opacity: 0
    }, { duration: speed });
}

function toggle_guide() {
    if ($('#kanji_svg').is(":visible")) {
        //$('#kanji_svg').hide();

        var svg = document.getElementById("kanji_svg").contentDocument.documentElement;
        var svgStrokes = $(svg).find('path').each(function() {
            $(this).attr("opacity", 0);
        });
        var svgStrokes = $(svg).find('text').each(function() {
            $(this).attr("opacity", 0);
        });

        $('#toggle_guide_button').html('Show Guide');
    } else {
        $('#kanji_svg').show();
        $('#toggle_guide_button').html('Hide Guide');
    }
}