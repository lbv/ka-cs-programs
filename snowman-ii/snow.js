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
