/**
 * Program specific data
 */

// Wind vector (for the snow flakes)
$.wind = new PVector(0, 0, 0);

// Gravity of the world
$.gravity = new PVector(0, 8*$.ul, 0);

$.snowBG = new SnowLayer(32, 0.8, 1.4);
$.snowFG = new SnowLayer(8, 1.4, 2);


// Configuration
$.cfg = {
	colorSky    : lerpColor($.colors.blue[0], $.colors.white, 0.5),
	colorHat    : $.colors.gray2[2],
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

$.drawSnowman = function() {
	// we don't need outlines for any of these shapes
	noStroke();

	// ground
	fill($.cfg.colorGround);
	rect(0, height - $.cfg.groundHeight, width, $.cfg.groundHeight);

	// set the size of the biggest snowball
	var snowballSize = 154;
	// set x coordinate of the snowman
	var snowmanX = 200;

	// bottom snowball
	fill(255, 255, 255);
	ellipse(snowmanX, 309, snowballSize, snowballSize);

	// middle snowball shadow
	fill(240, 240, 240);
	ellipse(snowmanX, 218, 0.8 * snowballSize, 0.8 * snowballSize);

	// middle snowball
	fill(255, 255, 255);
	ellipse(snowmanX, 212, 0.8 * snowballSize, 0.8 * snowballSize);

	// top snowball shadow
	fill(240, 240, 240);
	ellipse(snowmanX, 128, 0.6 * snowballSize, 0.6 *snowballSize);

	// top snowball
	fill(255, 255, 255);
	ellipse(snowmanX, 123, 0.6 * snowballSize, 0.6 *snowballSize);

	// buttons
	fill($.colors.red[1]);
	ellipse(snowmanX, 194, 10, 10);
	ellipse(snowmanX, 222, 10, 10);

	//nose
	fill($.colors.orange[1]);
	triangle(snowmanX, 136, snowmanX, 147, snowmanX + 25, 151);

	// set color for eyes, hat, and arms
	fill(43, 38, 38);

	// eyes
	var eyeSize = 12;
	var distanceFromCenter = 22;
	ellipse(snowmanX - distanceFromCenter, 129, eyeSize, eyeSize);
	ellipse(snowmanX + distanceFromCenter, 129, eyeSize, eyeSize);

	// hat
	fill($.cfg.colorHat);
	rect(snowmanX - 63, 92, 126, 5);
	rect(snowmanX - 39, 37, 76, 60);

	// for the arms, we want a thick line
	stroke(43, 38, 38);
	strokeWeight(2);

	// left arm
	line(snowmanX - 127, 140, snowmanX - 58, 187);
	line(snowmanX - 109, 117, snowmanX - 101, 157);
	line(snowmanX - 132, 171, snowmanX - 91, 165);

	// right arm
	line(snowmanX + 61, 192, snowmanX + 135, 144);
	line(snowmanX + 104, 165, snowmanX + 142, 169);
	line(snowmanX + 86, 176, snowmanX + 113, 125);
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
	$.drawSnowman();
	$.snowFG.draw();

	$.removeOldSnow();
	$.fps();
};
