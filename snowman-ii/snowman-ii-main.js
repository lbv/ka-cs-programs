//
// Global variables
//

// Two layers of snowflakes: one behind the snowman, and one
// in front
var snowBG = new SnowLayer(32, 0.8, 1.4);
var snowFG = new SnowLayer(8, 1.4, 2);

// The snowman
var snowman = new Snowman(200, 388, 1.0);

// A small keyboard indicator
var keysInd = new KeysIndicator(
	8, 8, $colors.blue[1], $colors.white, [
	[ UP,    "\u2191", 0, 1 ],
	[ DOWN,  "\u2193", 1, 1 ],
	[ RIGHT, "\u2192", 1, 2 ],
	[ LEFT,  "\u2190", 1, 0 ],
	[ 65,    "A",      0, 4 ],
	[ 90,    "Z",      1, 4 ]
]);


// Configuration
var $cfg = {
	colorSky :
		lerpColor($colors.blue[0], $colors.white, 0.5),
	colorGround : $colors.gray1[1],

	groundHeight : 60
};


//
// Functions
//
var removeOldSnow = function() {
	var rem = [];
	snowBG.forEach(function(s) {
		var p = s.particle;
		if (p.r.y > height - $cfg.groundHeight + s.size) {
			rem.push(s); }
	});
	var i;
	for (i = 0; i < rem.length; ++i) {
		snowBG.removeSnow(rem[i]); }

	rem = [];
	snowFG.forEach(function(s) {
		var p = s.particle;
		if (p.r.y > height + s.size) { rem.push(s); }
	});
	for (i = 0; i < rem.length; ++i) {
		snowFG.removeSnow(rem[i]); }
};

var draw = function() {
	snowBG.check();
	snowFG.check();

	// the sky
	background($cfg.colorSky);

	snowBG.draw();

	// ground
	noStroke();
	fill($cfg.colorGround);
	rect(0, height - $cfg.groundHeight,
	     width, $cfg.groundHeight);

	snowman.draw();

	snowFG.draw();

	removeOldSnow();
	keysInd.draw();
};

var keyPressed = function() {
	keysInd.onKeyPressed();
	snowman.onKeyPressed();
};

var keyReleased = function() {
	keysInd.onKeyReleased();
	snowman.onKeyReleased();
};
