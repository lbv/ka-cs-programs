var SnowPatterns = [];

var SnowPath1 = "m271.73 254.34c139.07 254.95 297.05 113.52 55.17-47.2-325.76-216.45 108.06-313.54-95.64 20.33-151.26 247.92 50.21 314.01 68.46 24.18 24.56-390.34 325.56-63.19-65.43-72.66-290.33-7.04-246.84 200.49 13.29 71.37 350.33-173.89 217.5 250.36 30.21-92.99-139.07-254.95-297.05-113.52-55.16 47.2 325.76 216.45-108.07 313.54 95.64-20.33 151.25-247.92-50.22-314.02-68.46-24.18-24.57 390.34-325.57 63.19 65.43 72.66 290.32 7.04 246.83-200.49-13.3-71.37-350.33 173.89-217.5-250.36-30.21 92.99z";

var SnowPath2 = "m441.44 64.433c-36.033-52.461 2.963-59.293-12.492 2.4454-14.19 56.688-14.467 57.425 10.706 4.6884 27.416-57.436 52.831-27.081-8.3636-9.5954-56.188 16.055-56.965 16.184 1.2926 11.616 63.449-4.9749 49.868 32.213 4.128-12.041-41.998-40.633-42.498-41.242-9.4132 6.9272 36.033 52.461-2.963 59.293 12.492-2.4454 14.19-56.688 14.467-57.425-10.706-4.6884-27.416 57.436-52.831 27.081 8.3636 9.5954 56.188-16.055 56.965-16.184-1.2926-11.616-63.449 4.9749-49.868-32.213-4.128 12.041 41.998 40.633 42.498 41.242 9.4132-6.9272z";

var SnowPath3 = "m336.38 265.45c-80.862 31.701 78.192-8.7137-8.6127-11.635-83.816-2.8204 56.997 63.37-8.5502 11.057-67.885-54.178 46.642 63.36 5.7696-13.276-39.466-73.997-26.381 81.046-13.851-1.8761 12.977-85.879-31.55 72.073 14.382-1.6415 44.351-71.177-83.379 17.676-5.3006-12.933 80.862-31.701-78.192 8.7137 8.6127 11.635 83.816 2.8204-56.997-63.37 8.5502-11.057 67.885 54.178-46.642-63.36-5.7696 13.276 39.466 73.997 26.381-81.046 13.851 1.8761-12.977 85.879 31.55-72.073-14.382 1.6415-44.351 71.177 83.379-17.676 5.3006 12.933z";

var SnowPath4 = "m420.22 109.89c-65.409 26.933 62.324-2.4308-7.7884-11.811-70.112-9.3797 45.41 52.527-10.619 9.3479s33.267 52.759 6.334-12.65-22.785 65.59-13.405-4.5224c9.3797-70.112-29.057 55.189 14.122-0.83971s-68.195 13.063-2.786-13.87-62.324 2.4308 7.7884 11.811c70.112 9.3797-45.41-52.527 10.619-9.3479s-33.267-52.759-6.334 12.65 22.785-65.59 13.405 4.5224c-9.3797 70.112 29.057-55.189-14.122 0.83971s68.195-13.063 2.786 13.87z";

var CreateSnowPatterns = function() {
	var svg, path;
	svg = new SVGLiteSVG({ width: 100, height: 100 });
	path = new SVGLitePath({
		transform :
			"translate(-296.55 -476.87)" +
			"matrix(.178 -.105 .105 .178 275.03 518.82)",
		opacity  : 0.54419,
		fillRule : 'evenodd',
		fill     : "#204a87",
		d : SnowPath1
	});
	svg.add(path);
	SnowPatterns.push(svg);

	svg = new SVGLiteSVG({ width: 70, height: 70 });
	path = new SVGLitePath({
		transform :
			"translate(-530.82 -604.35)" +
			"matrix(.76952 0 0 .76952 231.46 586.94)",
		opacity  : 0.54419,
		fillRule : 'evenodd',
		fill     : "#5c3566",
		d : SnowPath2
	});
	svg.add(path);
	SnowPatterns.push(svg);

	svg = new SVGLiteSVG({ width: 56, height: 56 });
	path = new SVGLitePath({
		transform :
			"translate(-158.75 -421.9)" +
			"matrix(.79397 0 0 .79397 -74.947 250.77)",
		opacity  : 0.54419,
		fillRule : 'evenodd',
		fill     : "#5c3566",
		d : SnowPath3
	});
	svg.add(path);
	SnowPatterns.push(svg);

	svg = new SVGLiteSVG({ width: 34, height: 34 });
	path = new SVGLitePath({
		transform :
			"translate(-166.3 -464.39)" +
			"matrix(.54816 0 0 .54816 -43.615 430.11)",
		opacity  : 0.54419,
		fillRule : 'evenodd',
		fill     : "#204a87",
		d : SnowPath4
	});
	svg.add(path);
	SnowPatterns.push(svg);
};

/**
 * Snow
 *
 * Represents a single snowflake.
 */
var Snow = function(id, psys) {
	this.id = id;

	var type = floor(random(SnowPatterns.length));
	var sp   = SnowPatterns[type];

	this.size = round(random(10, 40));
	this.img  = sp.render(this.size, this.size);

	this.rotation = random(360);

	var locX = round(random(width));
	this.particle = psys.newParticle(locX, -this.size, 0);
};


Snow.prototype.draw = function() {
	if (this.particle.im === 0) { return; }

	pushMatrix();
	imageMode(CENTER);
	translate(this.particle.r.x, this.particle.r.y);
	rotate(this.rotation);
	this.img.draw();
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
	var id = this.serial++;
	var s  = new Snow(id, this.psys);

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
