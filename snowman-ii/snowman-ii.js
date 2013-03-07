/**
 * Snowman II
 * ==========
 *
 * Spin-off of the official "Snowman" program. It adds falling snow flakes,
 * controlled by a simple physics-based simulation.
 *
 * Original Snowman:
 *   http://www.khanacademy.org/cs/snowman/823735629
 * Snowman II:
 *
 *
 * Currently a work in progress.
 *
 * This is released into the public domain. Feel free to use it as you please.
 */

/**
 * Global object, filled with general goodies to use in different programs
 */
var $ = {};

// Basic unit of length (approx 6 pixels in a 400x400 canvas)
$.ul = width / 64;

// Palette of colors, based on the Tango Icon Theme Guidelines
$.colors = {
	yellow : [ 0xfffce94f, 0xffedd400, 0xffc4a000 ],
	orange : [ 0xfffcaf3e, 0xfff57900, 0xffce5c00 ],
	brown  : [ 0xffe9b96e, 0xffc17d11, 0xff8f5902 ],
	green  : [ 0xff8ae234, 0xff73d216, 0xff4e9a06 ],
	blue   : [ 0xff729fcf, 0xff3465a4, 0xff204a87 ],
	purple : [ 0xffad7fa8, 0xff75507b, 0xff5c3566 ],
	red    : [ 0xffef2929, 0xffcc0000, 0xffa40000 ],
	gray1  : [ 0xffeeeeec, 0xffd3d7cf, 0xffbabdb6 ],
	gray2  : [ 0xff888a85, 0xff555753, 0xff2e3436 ],
	white  : 0xffffffff,
	black  : 0xff000000
};

// Time in seconds from the last frame
$.timeStep = 0;

// Extra data to handle timers
$.timers = [];
$.timePrev = 0;

// Calls function "f" after "ms" milliseconds
$.addTimer = function(ms, f) {
	var t = millis() + ms;
	var lo = 0;
	var hi = $.timers.length;
	while (lo < hi) {
		var mid = floor((lo + hi) / 2);
		if ($.timers[mid].t < t) { lo = mid + 1; }
		else { hi = mid; }
	}
	$.timers.splice(lo, 0, { t: t, cb : f });
};

// Function that should be hooked into the main program loop
$.loopStep = function() {
	var ms = millis();
	$.timeStep = (ms - $.timePrev) / 1000;
	$.timePrev = ms;
	while ($.timers.length > 0 && $.timers[0].t <= ms) {
		$.timers[0].cb();
		$.timers.shift();
	}
};

/**
 * A single particle 
 */
var Particle = function(x, y, id) {
	this.v  = new PVector(x, y, 0);  // vector for position of the particle
	this.vo = new PVector(x, y, 0);  // old position vector
	this.a  = new PVector(0, 0, 0);  // acceleration vector
	this.id = id;
};

/**
 * A system that handles a group of particles
 */
var ParticleSystem = function() {
	this.p = {};
	this.n = 0;
	this.serial = 1;
};

// Add a new particle to the system, in coordinates (x, y)
ParticleSystem.prototype.newParticle = function(x, y) {
	var part = new Particle(x, y, this.serial++);
	++this.n;
	var prop = 'p_' + part.id;
	this.p[prop] = part;
	return part;
};

// Advance time in the system, by "timeStep" seconds
ParticleSystem.prototype.advance = function(timeStep) {
	var t2 = timeStep * timeStep;
	for (var name in this.p) {
		var part = this.p[name];
		var aux = new PVector(part.v.x, part.v.y, 0);
		part.v.add(part.v);
		part.v.sub(part.vo);
		part.v.add(PVector.mult(part.a, t2));
		part.vo = aux;
	}
};

// Remove a single particle from the system
ParticleSystem.prototype.remove = function(particle) {
	var prop = 'p_' + particle.id;
	if (this.p.hasOwnProperty(prop)) {
		delete this.p[prop];
		--this.n;
	}
};


// A snow flake
var Snow = function(id, particle, size, kol) {
	this.id       = id;
	this.size     = size;
	this.particle = particle;
	this.kol      = kol;
	this.active   = false;
};

Snow.prototype.draw = function() {
	if (! this.active) { return; }

	noStroke();
	fill(this.kol);
	var p = this.particle;
	arc(p.v.x, p.v.y, this.size, this.size, 0, 360);
};

// A snow layer, with maxSnow flakes, with size between "small" and "big"
var SnowLayer = function(maxSnow, small, big) {
	this.maxSnow = maxSnow;
	this.small   = small;
	this.big     = big;

	this.serial    = 1;
	this.ps        = new ParticleSystem();
	this.n         = 0;
	this.nInactive = 0;
	this.snow      = {};
	this.noiseX    = 0;
	this.noiseY    = 0;
};

SnowLayer.prototype.addSnow = function() {
	++this.n;
	var id   = this.serial++;
	var size = random(this.small, this.big);
	var kol  = lerpColor($.colors.blue[0], $.colors.gray1[2],
	                     random(0.33, 0.66));

	var locX = random(size, width - size);
	var part = this.ps.newParticle(locX, -size);

	var s = new Snow(id, part, size, kol);
	var prop = 's_' + id;
	this.snow[prop] = s;

	++this.nInactive;
	var obj = this;
	var activator = function() {
		--obj.nInactive;
		s.active = true;
	};
	var delay = this.nInactive * 800;
	$.addTimer(random(delay - 800, delay), activator);
};

SnowLayer.prototype.removeSnow = function(snow) {
	this.ps.remove(snow.particle);
	var prop = 's_' + snow.id;
	if (this.snow.hasOwnProperty(prop)) {
		delete this.snow[prop];
		--this.n;
	}
};

SnowLayer.prototype.check = function() {
	while (this.n < this.maxSnow) { this.addSnow(); }
};

SnowLayer.prototype.forEach = function(cb, ctx) {
	for (var name in this.snow) { cb.call(ctx, this.snow[name]); }
};

SnowLayer.prototype.draw = function() {
	for (var name in this.snow) {
		var s = this.snow[name];
		s.draw();
	}
};

/**
 * Program specific data
 */

// Wind vector (for the snow flakes)
$.wind = new PVector(0, 0, 0);

// Gravity of the world
$.gravity = new PVector(0, 5, 0);

$.snowBG = new SnowLayer(32, 0.5 * $.ul, 1.5*$.ul);
$.snowFG = new SnowLayer(8, 1.5 * $.ul, 2*$.ul);


// Configuration
$.cfg = {
	colorSky    : lerpColor($.colors.blue[0], $.colors.white, 0.5),
	colorHat    : $.colors.gray2[2],
	colorGround : $.colors.gray1[1],

	groundHeight : $.ul * 10,

	windDelta : $.ul / 2,
	windMinY  : -$.ul / 3,
	windMaxY  : $.ul / 2,
	windMinX  : -$.ul / 2,
	windMaxX  : $.ul / 2
};


$.applyForceSnow = function(s) {
	if (! s.active) { return; }
	var p = s.particle;
	// wind force, proportional to the snow flake size
	var fwind = PVector.mult($.wind, s.size / $.ul);
	// random component for the wind
	var rwind = new PVector(random(-$.ul/3, $.ul/3),
	                        random(-$.ul/3, $.ul/3), 0);
	p.a.set($.gravity);
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
		if (p.v.y > height - $.cfg.groundHeight + s.size) {
			rem.push(s);
		}
	});
	var i;
	for (i = 0; i < rem.length; ++i) { $.snowBG.removeSnow(rem[i]); }

	rem = [];
	$.snowFG.forEach(function(s) {
		var p = s.particle;
		if (p.v.y > height + s.size) {
			rem.push(s);
		}
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
};

