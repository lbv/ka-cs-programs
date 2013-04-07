var App = {};

App.init = function() {
	// Two layers of snowflakes: one behind the snowman, and
	// one on the front
	App.snowBG = new SnowLayer(32, 0.8, 1.4);
	App.snowFG = new SnowLayer(8, 1.4, 2);

	// The snowman
	App.snowman = new Snowman(200, 388, 1.0);

	// A small keyboard indicator
	App.keysInd = new KeysIndicator(
		8, 8, [
		[ UP,    "\u2191", 0, 1 ],
		[ DOWN,  "\u2193", 1, 1 ],
		[ RIGHT, "\u2192", 1, 2 ],
		[ LEFT,  "\u2190", 1, 0 ],
		[ 65,    "A",      0, 4 ],
		[ 90,    "Z",      1, 4 ]
	]);

	App.colorSky = lerpColor(
		$colors.blue[0], $colors.white, 0.5);
	App.colorGround = $colors.gray1[1];

	App.groundHeight = 60;
};


App.removeOldSnow = function() {
	var rem = [];
	App.snowBG.forEach(function(s) {
		var p = s.particle;
		if (p.r.y > height - App.groundHeight + s.size) {
			rem.push(s); }
	});
	var i;
	for (i = 0; i < rem.length; ++i) {
		App.snowBG.removeSnow(rem[i]); }

	rem = [];
	App.snowFG.forEach(function(s) {
		var p = s.particle;
		if (p.r.y > height + s.size) { rem.push(s); }
	});
	for (i = 0; i < rem.length; ++i) {
		App.snowFG.removeSnow(rem[i]); }
};

var draw = function() {
	App.snowBG.check();
	App.snowFG.check();

	// the sky
	background(App.colorSky);

	App.snowBG.draw();

	// ground
	noStroke();
	fill(App.colorGround);
	rect(0, height - App.groundHeight,
	     width, App.groundHeight);

	App.snowman.draw();

	App.snowFG.draw();

	App.removeOldSnow();
	App.keysInd.draw();
};

var keyPressed = function() {
	App.keysInd.onKeyPressed();
	App.snowman.onKeyPressed();
};

var keyReleased = function() {
	App.keysInd.onKeyReleased();
	App.snowman.onKeyReleased();
};

App.init();
