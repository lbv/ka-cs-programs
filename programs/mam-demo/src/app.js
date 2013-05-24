//
// The MAM "glue" code. This just needs to be copied/pasted
// as-is. It provides the `mamLoad` function, called further
// below.
//
var _pjs=this, mamLoad=function(cfg, cb, fn) {
	mamLoad.f = true; (function(){
	var g=this, z=function(){g.MAM2(g._mam, cb, fn, _pjs);};
	g.setTimeout(function() { if (mamLoad.f) {
	if (g._mam) { z(); } else { g.$.getScript(
	'//googledrive.com/host/0BzcEQMWUa0znRE1wQU9KUGR2R2s'+
	'/mam/mam-pre1-min.js').done(function() {
	g._mam=g.MAM(cfg, _pjs);z(); }); }}}, 0); })();
};



//
// The main configuration object. It specifies all the media
// assets that will be loaded for this program.
//
var baseUrl = 'http://localhost:3333/assets';
var config = {
	images: {
		tiles: baseUrl + '/img/tiles.png',
		guy: baseUrl + '/img/guy.png'
	},

	sprites: {
		grass: {
			sheet: 'tiles',
			x: 0, y: 0,
			width: 32, height: 32
		},
		rock0: {
			sheet: 'tiles',
			x: 32, y: 0,
			width: 32, height: 32
		},
		rock1: {
			sheet: 'tiles',
			x: 64, y: 0,
			width: 32, height: 32
		},
		rock2: {
			sheet: 'tiles',
			x: 96, y: 0,
			width: 32, height: 32
		},
		house: {
			sheet: 'tiles',
			x: 0, y: 32,
			width: 120, height: 148
		},
		tree: {
			sheet: 'tiles',
			x: 0, y: 180,
			width: 64, height: 88
		},
		well: {
			sheet: 'tiles',
			x: 64, y: 180,
			width: 40, height: 64
		},
		walkingDown: {
			sheet: 'guy',
			x: 0, y: 32,
			width: 32, height: 32,
			frames: 4
		},
		walkingUp: {
			sheet: 'guy',
			x: 0, y: 0,
			width: 32, height: 32,
			frames: 4
		}
	},

	audio: {
		theme: baseUrl + '/snd/theme.ogg',
		boom: baseUrl + '/snd/boom.ogg'
	},

	fonts: [
		'Special Elite',
		'Tangerine',
		'Average Sans'
	]
};


// Global variable to reference all the imported assets
var media;


//
// This function will be called when the loading of assets
// is complete. It simply sets the global `media` variable.
//
var onMediaReady = function(loadedMedia) {
	media = loadedMedia;
};


// Data for a simple animation of a little guy walking
var animation = {
	x: 120, y: 60,
	frame: 0,
	next: 0,
	period: 60,
	state: 'walkingDown'
};


//
// Music control
//
var musicPlaying = false;

var toggleMusic = function() {
	if (musicPlaying) {
		media.audio.theme.pause();
	}
	else {
		media.audio.theme.loop = true;
		media.audio.theme.play();
	}
	musicPlaying = !musicPlaying;
};


//
// Intro screen, shown right after the assets have been
// loaded.
//
var showIntro = true;
var drawIntro = function() {
	background(255, 255, 255);
	fill(78, 154, 6);

	textFont(media.fonts[2], 11);
	textAlign(CENTER, BASELINE);
	text("The media assets are ready\n" +
		"Press the SPACE key to continue", 200, 200);
};


//
// Key-press handler
//
var keyPressed = function() {
	if (showIntro) {
		if (keyCode === 32) {  // Space
			showIntro = false;
		}
	}
	else {
		if (keyCode === 77) {  // M
			toggleMusic();
		}
		else if (keyCode === 83) {  // S
			media.audio.boom.play();
		}
	}
};


//
// This will be the new `draw` function after the assets
// have been loaded.
//
var drawScene = function() {
	if (showIntro) {
		drawIntro();
		return;
	}

	var x, y;
	// fill the background with grass
	for (x = 0; x < 400; x += 32) {
		for (y = 0; y < 400; y += 32) {
			image(media.sprites.grass, x, y);
		}
	}	

	// sprinkle some rocks in the scene
	image(media.sprites.rock1, 64, 128);
	image(media.sprites.rock1, 160, 200);
	image(media.sprites.rock2, 192, 16);
	image(media.sprites.rock2, 32, 352);

	// a tree and a well
	image(media.sprites.tree, 290, 40);
	image(media.sprites.well, 64, 230);

	// a house, with a rocky entrance
	pushMatrix();
	translate(278, 288);
	image(media.sprites.rock0, 0, 0);
	image(media.sprites.rock0, 0, 32);
	image(media.sprites.rock0, 32, 0);
	image(media.sprites.rock0, 32, 32);
	popMatrix();
	image(media.sprites.house, 250, 140);

	// animated guy
	var anim = media.sprites[animation.state];
	image(anim[animation.frame], animation.x, animation.y);

	var currTime = millis();
	if (currTime >= animation.next) {
		if (animation.state === 'walkingDown') {
			animation.y += 3;
		}
		else {
			animation.y -= 3;
		}

		++animation.frame;
		animation.frame %= anim.length;
		animation.next = currTime + animation.period;

		if (animation.y > 340) {
			animation.state = 'walkingUp';
			animation.frame = 0;
			animation.y = 340;
		}
		if (animation.y < 60) {
			animation.state = 'walkingDown';
			animation.frame = 0;
			animation.y = 60;
		}
	}

	// Fonts demo
	var size;
	y = 64;
	fill(0, 0, 0);
	textAlign(CENTER, BASELINE);
	for (size = 12; size <= 24; size += 4) {
		textFont(media.fonts[0], size);
		text("Hello world (Special Elite font)", 200, y);

		textFont(media.fonts[1], size);
		text("Hello world (Tangerine font)", 200, y + 190);

		y += size + 12;
	}

	// Information about audio
	textAlign(RIGHT, BASELINE);
	textFont(media.fonts[2], 12);
	fill(255, 255, 255);
	var msg;
	if (musicPlaying) {
		msg = "Music is playing, press M to pause it";
	}
	else {
		msg = "Music is paused, press M to play";
	}
	text(msg, 392, 392);
	text("Press S to play a sound effect", 392, 374);
};


//
// Starts the loading of assets defined inside `config`.
// Once all of them have been loaded, it replaces the
// regular `draw` function with `drawScene`, and it calls
// `onMediaReady` one time.
//
mamLoad(config, onMediaReady, drawScene);


//
// The main `draw` function. This will be used only while
// the assets are being loaded (after that, it's replaced
// with the function passed as the second parameter to
// `mamLoad`. This means that this is probably a good place
// to create any type of "Loading..." message/animation you
// want for your program.
//
var angle = 0;
var angleMode = "radians";

var draw = function() {
	background(255, 255, 255);

	// write message
	textAlign(CENTER, BASELINE);
	fill(46, 52, 54);
	text("loading media assets", 200, 200);

	// draw "spinner"
	stroke(46, 52, 54);
	noFill();
	ellipse(200, 210, 10, 10);

	pushMatrix();
	translate(200, 210);
	rotate(angle);
	ellipse(5, 0, 3, 3);
	popMatrix();

	angle += PI/12;
};
