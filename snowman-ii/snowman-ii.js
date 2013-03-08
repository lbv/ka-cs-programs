/**
 * Snowman II
 * ==========
 *
 * Version 1 (2013-03-08)
 *
 * Spin-off of the official "Snowman" program. It adds falling snowflakes, and
 * control of the snowman with the keyboard.
 *
 * This program seems to work fine in Google Chrome. In others browsers... not
 * so much.
 *
 * This program was built mainly to test a few things from the programming
 * platform. Because of this, it includes a few features that are not very
 * beginner-friendly, for those who want to explore the source code. Sorry.
 *
 * Still, I hope you have fun looking at the code, and by taking your time with
 * it, I'm sure you will find interesting ways to tweak it :).
 *
 * Original Snowman:
 *   http://www.khanacademy.org/cs/snowman/823735629
 *
 * Snowman II on GitHub:
 *   https://github.com/lbv/ka-cs-programs/tree/master/snowman-ii
 *
 * This is released into the public domain. Feel free to use it as you please.
 */

/**
 * Global object, filled with general goodies to use in different programs
 */
var $ = {};

// Reference to "main" context
$.pjs = this;

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

$.fps = function() {
	fill($.colors.red[0]);
	text($.pjs.__frameRate, 16, height - 16);
};

/**
 * Data structure that maintains its elements in order, so that the "top"
 * element is always the smallest, according to a custom comparator
 */
var Heap = function(cmp) {
	this.data = [];
	this.cmp  = cmp;
};

Heap.prototype.size = function() { return this.data.length; };

Heap.prototype.push = function(v) {
	this.data.push(v);
	this.moveUp_(this.data.length - 1);
};

Heap.prototype.pop = function() {
	if (this.data.length === 0) { throw new Error('The heap is empty'); }
	var e = this.data[0];
	this.data[0] = this.data.pop();
	this.moveDown_(0);
	return e;
};

Heap.prototype.peek = function() {
	if (this.data.length === 0) { throw new Error('The heap is empty'); }
	return this.data[0];
};

Heap.prototype.moveUp_ = function(idx) {
	while (idx > 0) {
		var parent = floor((idx-1)/2);
		if (this.cmp(this.data[parent], this.data[idx]) <= 0) { return; }
		var aux = this.data[parent];
		this.data[parent] = this.data[idx];
		this.data[idx] = aux;
		idx = parent;
	}
};

Heap.prototype.moveDown_ = function(idx) {
	var sz = this.data.length;
	while (true) {
		var c1 = idx*2 + 1;
		var c2 = idx*2 + 2;
		var sw = idx;
		if (c1 < sz && this.cmp(this.data[c1], this.data[sw]) <= 0) { sw = c1; }
		if (c2 < sz && this.cmp(this.data[c2], this.data[sw]) <= 0) { sw = c2; }
		if (sw === idx) { return; }
		var aux = this.data[sw];
		this.data[sw] = this.data[idx];
		this.data[idx] = aux;
		idx = sw;
	}
};

// Time in seconds from the last frame
$.timeStep = 0;

// Extra data to handle timers
$.timers = new Heap(function(a, b) { return a.t - b.t; });
$.timePrev = 0;

// Calls function "f" after "ms" milliseconds
$.addTimer = function(ms, f) {
	$.timers.push({ t: millis() + ms, cb : f });
};

// Function that should be hooked into the main program loop
$.loopStep = function() {
	var ms = millis();
	$.timeStep = (ms - $.timePrev) / 1000;
	$.timePrev = ms;
	while ($.timers.size() > 0 && $.timers.peek().t <= ms) {
		$.timers.pop().cb.call();
	}
};

/**
 * A single particle 
 */
var Particle = function(x, y, id) {
	this.r  = new PVector(x, y, 0);  // vector for position of the particle
	this.ro = new PVector(x, y, 0);  // old position vector
	this.v  = new PVector(0, 0, 0);  // velocity approximation
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
		var aux = new PVector(part.r.x, part.r.y, 0);
		part.v = PVector.sub(part.r, part.ro);
		part.r.add(part.v);
		part.r.add(PVector.mult(part.a, t2));
		part.ro = aux;
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

/**
 * A small on-screen representation of a group of keys being pressed
 */
var KeysIndicator = function(x, y, keys) {
	this.x = x;
	this.y = y;
	this.k = {};

	for (var i = 0; i < keys.length; ++i) {
		var key = keys[i];
		this.k[key[0]] = {
			str : key[1],
			row : key[2],
			col : key[3],
			on  : false
		};
	}
};

KeysIndicator.size   = $.ul * 3;
KeysIndicator.radius = $.ul * 0.5;
KeysIndicator.font   = createFont("sans-serif", 18);

KeysIndicator.prototype.drawKey = function(key) {
	stroke($.colors.blue[2]);
	strokeWeight(1.5);
	if (key.on) { fill($.colors.blue[2] & 0xccffffff); }
	else        { noFill(); }
	rect(0, 0, KeysIndicator.size, KeysIndicator.size, KeysIndicator.radius);
	if (key.on) { fill($.colors.white); }
	else        { fill($.colors.blue[2]); }
	textFont(KeysIndicator.font, 18);
	text(key.str, 0, 16);
};

KeysIndicator.prototype.draw = function() {
	for (var kc in this.k) {
		var key = this.k[kc];
		pushMatrix();
		translate(this.x + key.col * KeysIndicator.size,
		          this.y + key.row * KeysIndicator.size);
		this.drawKey(key);
		popMatrix();
	}
};

KeysIndicator.prototype.onKeyPressed = function(k, kc) {
	if (this.k.hasOwnProperty(kc)) { this.k[kc].on = true; }
};

KeysIndicator.prototype.onKeyReleased = function(k, kc) {
	if (this.k.hasOwnProperty(kc)) { this.k[kc].on = false; }
};


// A snowflake
var Snow = function(id, particle, scale, kol) {
	this.id       = id;
	this.scale    = scale;
	this.particle = particle;
	this.kol      = kol;
	this.active   = false;
};

Snow.size   = $.ul;
Snow.shadow = $.ul / 8;

Snow.prototype.draw = function() {
	if (! this.active) { return; }

	pushMatrix();
	translate(this.particle.r.x, this.particle.r.y);
	scale(this.scale, this.scale);

	noStroke();
	fill($.colors.gray1[2]);
	ellipse(-Snow.shadow, Snow.shadow, Snow.size, Snow.size);
	fill(this.kol);
	ellipse(0, 0, Snow.size, Snow.size);

	popMatrix();
};

// A snow layer, with maxSnow flakes, with a scale between "small" and "big"
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
	var id    = this.serial++;
	var scale = random(this.small, this.big);
	var kol   = lerpColor($.colors.blue[0], $.colors.gray1[2],
	                      random(0.4, 0.8));

	var sz = scale * Snow.size;
	var locX = random(sz, width - sz);
	var part = this.ps.newParticle(locX, -sz);

	var s = new Snow(id, part, scale, kol);
	s.size = sz;
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
 * A snowman, whose appearance is based on the official "Snowman" program.
 */
var Snowman = function(x, y, scale) {
	this.ps     = new ParticleSystem();
	this.p      = this.ps.newParticle(x, y);
	this.ground = y;
	this.scale  = scale;

	this.isGrowing   = false;
	this.isShrinking = false;

	this.moveL   = false;
	this.moveR   = false;
	this.moveD   = false;
	this.jumping = false;
};

Snowman.ball   = $.ul * 25;
Snowman.shadow = color(240, 240, 240);
Snowman.ax     = $.ul * 64;   // horizontal acceleration
Snowman.ay     = $.ul * 512;  // vertical acceleration
Snowman.vjump  = $.ul * 3;    // max vertical speed when jumping
Snowman.ag     = $.ul * 128;  // downwards (gravity) acceleration

Snowman.prototype.onTheGround = function() {
	return this.p.r.y >= this.ground - 8;
};

Snowman.prototype.draw = function() {
	if (this.isGrowing || this.isShrinking) {
		if (this.isGrowing)   { this.scale += 0.02; }
		if (this.isShrinking) { this.scale -= 0.02; }
		this.scale = constrain(this.scale, 0.4, 1.2);
	}

	this.p.a.set(0, 0, 0);
	if (this.moveL) { this.p.a.x -= Snowman.ax * this.scale; }
	if (this.moveR) { this.p.a.x += Snowman.ax * this.scale; }

	if (this.jumping) {
		this.p.a.y -= Snowman.ay * this.scale;
	}
	else {
		this.p.a.y += Snowman.ag * this.scale;
		if (this.moveD) { this.p.a.y += Snowman.ay * this.scale; }
	}

	this.ps.advance($.timeStep);

	if (! this.moveL && ! this.moveR && this.onTheGround()) {
		if (abs(this.p.v.x) < 1) { this.p.r.x = this.p.ro.x; }
		else {
			this.p.r.x = this.p.ro.x + this.p.v.x * 0.85;
		}
	}

	if (this.p.r.y > this.ground) { this.p.r.y = this.ground; }
	if (this.p.v.y < -Snowman.vjump * this.scale) {
		this.p.r.y = this.p.ro.y - Snowman.vjump * this.scale;
		this.jumping = false;
	}

	pushMatrix();
	translate(this.p.r.x, this.p.r.y);
	scale(this.scale, this.scale);

	noStroke();

	// bottom snowball
	fill($.colors.white);
	ellipse(0, - 0.5 * Snowman.ball, Snowman.ball, Snowman.ball);

	// middle snowball shadow
	fill(Snowman.shadow);
	ellipse(0, - 1.09 * Snowman.ball, 0.8 * Snowman.ball, 0.8 * Snowman.ball);

	// middle snowball
	fill($.colors.white);
	ellipse(0, - 1.12 * Snowman.ball, 0.8 * Snowman.ball, 0.8 * Snowman.ball);

	// top snowball shadow
	fill(Snowman.shadow);
	ellipse(0, - 1.67 * Snowman.ball, 0.6 * Snowman.ball, 0.6 * Snowman.ball);

	// top snowball
	fill($.colors.white);
	ellipse(0, - 1.7 * Snowman.ball, 0.6 * Snowman.ball, 0.6 * Snowman.ball);

	// buttons
	fill($.colors.red[1]);
	ellipse(0, -1.25 * Snowman.ball, 0.06 * Snowman.ball, 0.06 * Snowman.ball);
	ellipse(0, -1.06 * Snowman.ball, 0.06 * Snowman.ball, 0.06 * Snowman.ball);

	//nose
	fill($.colors.orange[1]);
	triangle(0, -1.62 * Snowman.ball, 0, -1.55 * Snowman.ball,
	         0.16 * Snowman.ball, -1.53 * Snowman.ball);

	// set color for eyes, hat, and arms
	fill($.colors.gray2[1]);

	// eyes
	var eyeSize = 0.08 * Snowman.ball;
	var distanceFromCenter = 0.14 * Snowman.ball;
	ellipse(-distanceFromCenter, -1.67 * Snowman.ball, eyeSize, eyeSize);
	ellipse(distanceFromCenter, -1.67 * Snowman.ball, eyeSize, eyeSize);

	// hat
	fill($.colors.gray2[2]);
	rect(-0.41 * Snowman.ball, -1.91 * Snowman.ball, 0.82 * Snowman.ball,
	     0.03 * Snowman.ball);
	rect(-0.25 * Snowman.ball, -2.27 * Snowman.ball, 0.49 * Snowman.ball,
	     0.39 * Snowman.ball);

	// for the arms, we want a thick line
	stroke($.colors.gray2[1]);
	strokeWeight(2);

	// left arm
	line(-0.82 * Snowman.ball, -1.6 * Snowman.ball,
	     -0.38 * Snowman.ball, -1.3 * Snowman.ball);
	line(-0.71 * Snowman.ball, -1.75 * Snowman.ball,
	     -0.66 * Snowman.ball, -1.49 * Snowman.ball);
	line(-0.86 * Snowman.ball, -1.4 * Snowman.ball,
	     -0.59 * Snowman.ball, -1.44 * Snowman.ball);

	// right arm
	line(0.4 * Snowman.ball, -1.26 * Snowman.ball,
	     0.88 * Snowman.ball, -1.57 * Snowman.ball);
	line(0.68 * Snowman.ball, -1.44 * Snowman.ball,
	     0.92 * Snowman.ball, -1.41 * Snowman.ball);
	line(0.56 * Snowman.ball, -1.36 * Snowman.ball,
	     0.73 * Snowman.ball, -1.7 * Snowman.ball);

	popMatrix();
};

Snowman.prototype.onKeyPressed = function(k, kc) {
	if      (kc === 65) { this.isGrowing = true; }
	else if (kc === 90) { this.isShrinking = true; }
	else if (kc === RIGHT) { this.moveR = true; }
	else if (kc === LEFT)  { this.moveL = true; }
	else if (kc === DOWN)  { this.moveD = true; }
	else if (kc === UP && this.onTheGround()) { this.jumping = true; }
};

Snowman.prototype.onKeyReleased = function(k, kc) {
	if      (kc === 65) { this.isGrowing = false; }
	else if (kc === 90) { this.isShrinking = false; }
	else if (kc === RIGHT) { this.moveR = false; }
	else if (kc === LEFT)  { this.moveL = false; }
	else if (kc === DOWN)  { this.moveD = false; }
};

/**
 * Program specific data
 */

// Wind vector (for the snow flakes)
$.wind = new PVector(0, 0, 0);

// Gravity of the world
$.gravity = new PVector(0, 16*$.ul, 0);

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

	snowSpeed : $.ul * 0.15,
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

	p.a.set(0, 0, 0);
	if (p.v.y <= $.cfg.snowSpeed) { p.a.set($.gravity); }

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
};

var keyPressed = function() {
	$.ki.onKeyPressed(key, keyCode);
	$.snowman.onKeyPressed(key, keyCode);
};

var keyReleased = function() {
	$.ki.onKeyReleased(key, keyCode);
	$.snowman.onKeyReleased(key, keyCode);
};

