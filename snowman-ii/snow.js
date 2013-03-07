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
