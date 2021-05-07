// This is a JavaScript file

var game = null, 
fireGlyph,
fire,
fireBall,
rakutenLogo = null, map, cursors, wizard, fireLayer, snowmen, endGame = false,
errorText, destX, destY, casting = false;

function init_game_page()
{
    $('#kanji_area').hide();
    
    var canvas = document.getElementById("kanji_canvas");
    if (canvas != null) { 
       //make_kanji_canvas('火', false);
       make_canvas_drawable(canvas, false);
       $('#kanji_canvas').on('kanjicomplete', onGameKanjiComplete);
       $('#kanji_canvas').on('kanjierror', onGameKanjiError);
       $("#kanji_svg").hide();
    }    
    
    //Phaser.AUTO
    game = new Phaser.Game(screen.width, screen.height, Phaser.AUTO, 'game-area', { preload: preload, create: create, update: update });
}

function preload() {
    game.load.image('fireBall', 'assets/fire_prev.png');
    game.load.image('rakuten', 'images/ic_rakuten_r.png');
    game.load.image('tiles', 'assets/grass-tiles-2-small.png');
    game.load.image('trees', 'assets/tree2-final.png');
    game.load.image('fireIcon', 'assets/fire.png');    
    game.load.image('snowman', 'assets/snowman.png');
    game.load.spritesheet('wizard', 'assets/wizard.png', 64, 64, 64);
    game.load.tilemap('forest', 'assets/forest.json', null, Phaser.Tilemap.TILED_JSON);
}

function create() {    
    map = game.add.tilemap('forest', 16, 16);    
    map.addTilesetImage('grass-tiles-2-small', 'tiles');
    layer = map.createLayer('Ground');    
    layer.resizeWorld();

    //map.addTilesetImage('tree-16', 'trees');
    //treeLayer = map.createLayer('Trees');
    //treeLayer.renderSettings.enableScrollDelta = false;
    //treeLayer.resizeWorld();


    //  Here we create our coins group
    snowmen = game.add.group();
    snowmen.enableBody = true;
    
    fireGlyph = game.add.group();
    fireGlyph.enableBody = true;
    
    //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
    //map.createFromObjects('SnowmanObjects', 194, 'snowman', 0, true, false, snowmen);
    map.createFromObjects('SnowmanObjects', 194, 'snowman', 0, true, true, snowmen);
    
    map.createFromObjects('FireObject', 193, 'fireIcon', 0, true, true, fireGlyph);
    //map.addTilesetImage('snowman-16', 'snowman');
    //snowmanLayer = map.createLayer('Snowman');
    //snowmanLayer.resizeWorld();
    //map.setCollisionBetween(113, 176, true, snowmanLayer);
    
    //map.addTilesetImage('fire-16', 'fireIcon');
    //fireLayer = map.createLayer('Fire');
    //fireLayer.resizeWorld();    
    //map.setCollisionBetween(177, 192, true, "Fire");
    
   
    wizard = game.add.sprite(140,map.heightInPixels, 'wizard');
    console.log("Height in pixels: " + map.heightInPixels);
    var walkNorth = wizard.animations.add('walk', 
        [32, 33, 34, 35,
         40, 41, 42, 43,
         48, 49, 50, 51,
         56, 57, 58, 59]
    );
    
    wizard.animations.play('walk', 32, true);
    wizard.fixedToCamera = false;
    wizard.scale.x = 1.5;
    wizard.scale.y = 1.5;    
    //wizard.anchor.x = 0.5;
    //wizard.anchor.y = 0.5;
    
    game.camera.follow(wizard);
    
    fireBall = game.add.sprite(0, 0, 'fireBall');
    fireBall.visible = false;
    //fireBall.anchor.x = 0.5
    //fireBall.anchor.y = 0.5;
    
    
    //@todo don't use screen.height which does not work in monaca preview
    fire = game.add.sprite(75, screen.height - 64*3, 'fireIcon');
    fire.fixedToCamera = true;
    fire.visible = false;
    fire.anchor.x = 0.5;
    fire.anchor.y = 0.5;
    //makeFireDraggable();
    cursors = game.input.keyboard.createCursorKeys();
    game.camera.y = 1100;

    //@todo don't use screen.height which does not work in monaca preview
    errorText = game.add.text(0, screen.height - 64*2, "Beat the Snowman with Fire!", { font: "12px Arial", fill: "#ffff00", align: "center", backgroundColor : "black" });
    errorText.fixedToCamera = true;
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    game.physics.arcade.enable([fireBall, wizard]);
    game.physics.arcade.gravity.y = 0;
    wizard.body.setSize(64, 64, 0, 0);
    fireBall.body.setSize(64,64, 0, 0);
    //fireGlyph.body.setSize(64,64,0,0);
    wizard.body.velocity.y = -64*3;    
    wizard.body.velocity.x = 0;    
    //wizard.body.bounce.set(1);
    
    game.input.onTap.add(onMapTap);
        
}

function onMapTap(signal)
{
    console.log("Signal");
    console.log(signal);

    //wizard.body.velocity.x = (wizard.x - signal.x);
    
    if (wizard.x > signal.x) {
        wizard.body.velocity.x = -150;
        
        /*game.physics.arcade.moveToXY(wizard,
            64, 
            wizard.y, 
                256);        */
    } else {
        wizard.body.velocity.x = 150;
        /*game.physics.arcade.moveToXY(wizard,
            750, 
            wizard.y, 
                256);                */
    }
}

function update() {
    //game.camera.y -= 4;

    //return;
    
    // if (cursors.left.isDown)
    // {
    //     game.camera.x -= 4;
    // }
    // else if (cursors.right.isDown)
    // {
    //     game.camera.x += 4;
    // }

    if (casting) {
        wizard.body.velocity.y = 0
    }
    
    game.physics.arcade.collide(fireBall, snowmen, snowmanFire, checkSnowmanCollide, this);
    game.physics.arcade.overlap(wizard, fireGlyph, pickupFire, checkFireCollide, this);
    game.physics.arcade.overlap(wizard, snowmen, snowmanBump, checkSnowmanBump);
    
    
    
    //if (game.camera.y < 710 && !fire.inputEnabled) {
    //}

    //if (game.camera.y < 128) {
      //  wizard.animations.stop('walk');
    //}
    
//     if (cursors.down.isDown) {
  //      game.camera.y += 4;        
    // } //else if (game.camera.y >= 128) {
         //game.camera.y -= 4;
     //}   
    
    //wizard.y -= 4;
    //game.camera.y -= 4;
}

function checkFireCollide()
{
    return true;
}

function checkSnowmanBump()
{    
    return snowmen.visible;
}

function checkSnowmanCollide(fireball, snowman)
{
    return fireball.active && snowman.active;
}

function snowmanFire(fire, snowman)
{
    errorText.text = "You hit the snowman!";    
    fire.kill();
    snowman.kill();
    //snowman.reset();
    //console.log("Killed snowman");
    //console.log(snowman);
    //wizard.fixedToCamera = false;    
    //endGame = true;
    //snowmen.visible = false;        
}

function pickupFire(wizard, localFireGlyph)
{
    console.log("Pickup fire");
    localFireGlyph.kill();
    fire.visible = true;    
    makeFireDraggable();                
    wizard.body.velocity.y = -64*3;        
}

function snowmanBump(player, snowman)
{
    //console.log("Snowman bump");
    //if (snowmanLayer.visible) {
        wizard.body.velocity.y = 128*3;
        goNorth();
        //snowman.destroy();
    //}
}


function goNorth()
{
    if (wizard.body.velocity.y > -128) {
        wizard.body.velocity.y -= 32;
        setTimeout(goNorth, 50);
    }
}

function makeFireDraggable()
{        
        fire.inputEnabled = true;
        fire.input.enableDrag();
        fire.events.onDragStart.add(onDragStart, this);
        fire.events.onDragStop.add(onDragStop, this);    
}

function onDragStart(sprite, pointer) {
    sprite.moves = false;
    casting = true;
}
    
function onDragStop(sprite, pointer) {
    sprite.moves = true;
    result = sprite.key + " dropped at x:" + pointer.x + " y: " + pointer.y;
    console.log(result);
    
    if (pointer.y < 400)
    {   
        destX = pointer.x;
        destY = pointer.y;
        fire.x = 25;
        fire.y = document.body.scrollHeight - 64*3;
        fire.fixedToCamera = true;                    
        fire.visible = false;
    
        //$("#kanji_area").css({top: pointer.y-105, left: pointer.x-105, position:'absolute'});
        //$("#kanji_svg").css({top: pointer.y-105, left: pointer.x-105, position:'absolute'});

        make_kanji_canvas('火', false, 150, 150);

        errorText.text = "x,y = " + pointer.x + ", " + pointer.y + " " + kanjiCanvas.width + " " + kanjiCanvas.height;
        
        $("#kanji_area").css({top: pointer.y-(kanjiCanvas.height/8), left: pointer.x-kanjiCanvas.width/2});
        $("#kanji_svg").css({top: pointer.y-(kanjiCanvas.height/8), left: pointer.x-kanjiCanvas.width/2});
        
        $('#kanji_area').show();
        //make_kanji_canvas('火');
        
        //@todo: don't show guide as option
        $('#kanji_svg').show();                                    
    }
    
}

function onGameKanjiComplete()
{   
    fire.input.enabled = true;
    $('#kanji_area').fadeOut();
    $('#kanji_svg').fadeOut(); 

    fire.x = 25;
    //@todo don't use screen.height which does not work in monaca preview
    fire.y = screen.height - 64*3;
    fire.visible = true;
    
    fireBall.revive();    
    if (wizard.world !== undefined) {
        fireBall.x = wizard.world.x-32;
        fireBall.y = wizard.world.y+64;
    } else {
        fireBall.x = wizard.x-32;
        fireBall.y = wizard.y+64;        
    }
    
    game.physics.arcade.moveToXY(fireBall, destX, destY, 256*2);
    //var velocityX = (destX - wizard.x) * 3;
    //var velocityY = (destY - wizard.y) * 3;
    
    //fireBall.body.velocity.set(velocityX, velocityY);

    wizard.animations.play('walk', 60, true);    
    wizard.body.velocity.y = -64*3;
    casting = false;
}

function onGameKanjiError()
{
    setTimeout(function () {
        fire.visible = true;
        fire.input.enabled = true;
        $('#kanji_area').fadeOut();        
        $('#kanji_svg').fadeOut();        

        fire.x = 25;
        fire.y = screen.height - 64*3;
        fire.fixedToCamera = true;            
        errorText.text = kanjiCanvas.errorMessage;      
        casting = false;
        wizard.body.velocity.y = -64*3;
    }, 500);
}