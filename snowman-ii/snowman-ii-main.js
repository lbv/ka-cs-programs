/**
 * Program specific data
 */

// Wind vector (for the snow flakes)
$.wind = new PVector(0, 0, 0);

// Gravity of the world
$.gravity = new PVector(0, 8*$.ul, 0);

// Two layers of snowflakes: one behind the snowman, and one in front
$.snowBG = new SnowLayer(32, 0.8, 1.4);
$.snowFG = new SnowLayer(8, 1.4, 2);

// The snowman
$.snowman = new Snowman(width / 2, height - $.ul * 2, 1.0);

// A small keyboard indicator
$.ki = new KeysIndicator(width - $.ul * 17, $.ul * 2, [
	[ UP,    " \u2191", 0, 1 ],
	[ DOWN,  " \u2193", 1, 1 ],
	[ RIGHT, "\u2192",  1, 2 ],
	[ LEFT,  "\u2190",  1, 0 ],
	[ 65,    " A",      0, 4 ],
	[ 90,    " Z",      1, 4 ]
]);


// Configuration
$.cfg = {
	colorSky    : lerpColor($.colors.blue[0], $.colors.white, 0.5),
	colorGround : $.colors.gray1[1],

	groundHeight : $.ul * 10,

	windDelta : $.ul / 2,
	windMinY  : -$.ul / 4,
	windMaxY  : $.ul / 2,
	windMinX  : -$.ul / 2,
	windMaxX  : $.ul / 2,
	windRnd   : $.ul / 3
};


$.applyForceSnow = function(s) {
	if (! s.active) { return; }
	var p = s.particle;

	if (p.v.y <= 0) { p.a.set($.gravity); }
	else            { p.a.set(0, 0, 0); }

	// wind force, proportional to the snow flake size
	var fwind = PVector.mult($.wind, s.scale);
	// random component for the wind
	var rwind = new PVector(random(-$.cfg.windRnd, $.cfg.windRnd),
	                        random($.cfg.windRnd), 0);
	p.a.add(fwind);
	p.a.add(rwind);
};

$.forces = function() {
	$.wind.x = constrain($.wind.x + random(-$.cfg.windDelta, $.cfg.windDelta),
	                     $.cfg.windMinX, $.cfg.windMaxX);
	$.wind.y = constrain($.wind.y + random(-$.cfg.windDelta, $.cfg.windDelta),
	                     $.cfg.windMinY, $.cfg.windMaxY);


	$.snowBG.forEach($.applyForceSnow);
	$.snowFG.forEach($.applyForceSnow);
};

$.removeOldSnow = function() {
	var rem = [];
	$.snowBG.forEach(function(s) {
		var p = s.particle;
		if (p.r.y > height - $.cfg.groundHeight + s.size) { rem.push(s); }
	});
	var i;
	for (i = 0; i < rem.length; ++i) { $.snowBG.removeSnow(rem[i]); }

	rem = [];
	$.snowFG.forEach(function(s) {
		var p = s.particle;
		if (p.r.y > height + s.size) { rem.push(s); }
	});
	for (i = 0; i < rem.length; ++i) { $.snowFG.removeSnow(rem[i]); }

};

var draw = function() {
	$.loopStep();

	$.snowBG.check();
	$.snowFG.check();

	$.forces();

	$.snowBG.ps.advance($.timeStep);
	$.snowFG.ps.advance($.timeStep);

	// the sky
	background($.cfg.colorSky);

	$.snowBG.draw();

	noStroke();
	// ground
	fill($.cfg.colorGround);
	rect(0, height - $.cfg.groundHeight, width, $.cfg.groundHeight);

	$.snowman.draw();

	$.snowFG.draw();

	$.removeOldSnow();
	$.ki.draw();
	$.fps();
};

var keyPressed = function() {
	$.ki.onKeyPressed(key, keyCode);
};

var keyReleased = function() {
	$.ki.onKeyReleased(key, keyCode);
};
