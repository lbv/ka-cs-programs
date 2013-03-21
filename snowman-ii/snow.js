/**
 * Snow
 *
 * Represents a single snowflake.
 */
var Snow = function(id, particle, scale, kol) {
	this.id       = id;
	this.scale    = scale;
	this.particle = particle;
	this.kol      = kol;
};

Snow.size   = 6;
Snow.shadow = 0.5;

Snow.prototype.draw = function() {
	if (this.particle.im === 0) { return; }

	pushMatrix();
	translate(this.particle.r.x, this.particle.r.y);
	scale(this.scale, this.scale);

	noStroke();
	fill($colors.gray1[2]);
	ellipse(-Snow.shadow, Snow.shadow, Snow.size, Snow.size);
	fill(this.kol);
	ellipse(0, 0, Snow.size, Snow.size);

	popMatrix();
};

/**
 * SnowLayer
 *
 * A snow layer, holding a number of snowflakes.
 *
 * Methods:
 *
 *   constructor(maxSnow, small, big)
 *     Build a layer of snow, with "maxSnow" snowflakes,
 *     each one scaled between "small" and "big".
 *
 *   check()
 *     Makes sure the layer has the correct number of
 *     snowflakes.
 *
 *   draw()
 *     Draw all snowflakes in the layer, and updates their
 *     state.
 *
 *   removeSnow(snow)
 *     Removes the given snow object from the layer.
 *
 *   forEach(callback, ctx)
 *     Calls the callback function for each snowflake object
 *     in the layer, using the optional ctx object for
 *     context. The callback should have the signature:
 *        callback(snow)
 */
var SnowLayer = function(maxSnow, small, big) {
	this.maxSnow = maxSnow;
	this.small   = small;
	this.big     = big;

	this.serial    = 1;
	this.psys      = new ParticleSystem();
	this.n         = 0;
	this.nInactive = 0;
	this.snow      = {};
	this.timer     = new Timer();

	var gravity = new $pjs.PVector(0, 1e-5);
	var wind    = new $pjs.PVector(0, 0);
	this.psys.pushForce(gravity);
	this.psys.pushForce(wind);

	var updateWind = function() {
		this.timer.add(1000, updateWind, this);
		wind.x += random(-1e-6, 1e-6);
		wind.y += random(-5e-6, 5e-6);
		wind.x = constrain(wind.x, -5e-6, 5e-6);
		wind.y = constrain(wind.x, -1e-5, 5e-6);
		this.psys.popForce();
		this.psys.pushForce(wind);
	};

	this.timer.add(1000, updateWind, this);
};

SnowLayer.prototype.addSnow = function() {
	++this.n;
	var id    = this.serial++;
	var scale = random(this.small, this.big);
	var kol   = lerpColor(
		$colors.blue[0], $colors.gray1[2],
		random(0.4, 0.8));

	var sz = scale * Snow.size;
	var locX = random(sz, width - sz);
	var part = this.psys.newParticle(locX, -sz, 0);

	var s = new Snow(id, part, scale, kol);
	s.size = sz;
	var prop = 's_' + id;
	this.snow[prop] = s;

	++this.nInactive;

	var activator = function() {
		--this.nInactive;
		this.psys.dirty = true;
		s.particle.im = 1;
		s.particle.pr.y = s.particle.r.y - 1;
	};
	var maxDelay = this.nInactive * 800;
	var delay    = random(maxDelay - 800, maxDelay);
	this.timer.add(delay, activator, this);
};

SnowLayer.prototype.removeSnow = function(snow) {
	this.psys.remove(snow.particle);
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
	for (var name in this.snow) {
		cb.call(ctx, this.snow[name]); }
};

SnowLayer.prototype.draw = function() {
	this.timer.step();
	this.psys.advance();

	for (var name in this.snow) {
		var s = this.snow[name];
		s.draw();
	}
};
