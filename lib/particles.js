/**
 * Particle
 *
 * Stores the state of a single particle in 2D, including
 * its position, acceleration and mass. All units are
 * closely related to the programming environment, so
 * it's recommended to not think of them in terms of units
 * like m, m/s^2, kg, etc. You may try to do the conversions
 * if you want, though.
 *
 * Normally, you would only interact with a particle through
 * its position, while the acceleration is updated through
 * applying forces.
 *
 * The mass is represented as the multiplicative inverse of
 * the mass, for the sake of simplifying calculations. This
 * means that larger values are for objects with smaller
 * masses, which makes them more susceptible to forces.
 * A particle with infinite mass (useful to simulate
 * particles that remain stationary regardless of the forces
 * acting on it), has a value of zero.
 *
 * Typically, you should not create single particles by
 * yourself. Instead you create a ParticleSystem, and then
 * create new particles through it.
 */
var Particle = function(x, y, im, id) {
	this.r  = new $pjs.PVector(x, y);  // position
	this.pr = new $pjs.PVector(x, y);  // previous position
	this.a  = new $pjs.PVector(0, 0);  // acceleration

	this.im = im;  // inverse mass
	this.id = id;  // ID inside a system
};

/**
 * ParticleSystem
 *
 * A system that handles a group of particles, using a
 * variation of the standard Verlet integration that
 * accounts for fluctuating timesteps.
 *
 * To create a new particle, call the 'newParticle' method,
 * passing it the coordinates and the inverse of the mass of
 * the particle.
 *
 * To add an external force that applies to all particles in
 * the system, call 'pushForce'.
 *
 * To add a constraint, call 'addConstraint', passing two
 * particles, previously created with 'newParticle'.
 *
 * To move the simulation, call 'advance'. This should be
 * done at each frame (for example, calling it from the
 * main 'draw' function).
 */
var ParticleSystem = function() {
	this.ps = {};        // particles
	this.n  = 0;         // number of particles
	this.s  = 1;         // serial number (to create IDs)
	this.fs = [];        // stack of global forces
	this.cs = [];        // constraints

	this.t0 = 0;
	this.t1 = millis();  // two latest times

	this.dirty = false;  // global forces pending?
	this.iter  = 2;      // iters for resolving constraints
};

ParticleSystem.prototype.newParticle = function(x, y, im) {
	var part = new Particle(x, y, im, this.s++);
	++this.n;
	var prop = 'p_' + part.id;
	this.ps[prop] = part;
	return part;
};

ParticleSystem.prototype.pushForce = function(f) {
	this.fs.push(f);
	this.dirty = true;
};

ParticleSystem.prototype.popForce = function() {
	this.fs.pop();
	this.dirty = true;
};

ParticleSystem.prototype.applyGlobalForces = function() {
	this.tf = new $pjs.PVector(0, 0);  // total forces

	for (var i = 0; i < this.fs.length; ++i) {
		this.tf.add(this.fs[i]); }

	for (var name in this.ps) {
		var p = this.ps[name];
		p.a.x = this.tf.x * p.im;
		p.a.y = this.tf.y * p.im;
	}
	this.dirty = false;
};

ParticleSystem.prototype.verlet = function(dt, pdt) {
	var dt2 = dt*dt;
	var rdt = dt / pdt;
	for (var name in this.ps) {
		var p   = this.ps[name];
		var aux = new $pjs.PVector(p.r.x, p.r.y);
		var dr = PVector.sub(p.r, p.pr);
		p.r.add(PVector.mult(dr, rdt));
		p.r.add(PVector.mult(p.a, dt2));
		p.pr = aux;
	}
};

ParticleSystem.prototype.addConstraint = function(p1, p2) {
	this.cs.push([ p1, p2, p1.r.dist(p2.r) ]);
};

ParticleSystem.prototype.handleConstraints = function() {
	for(var i = 0; i < this.iter; ++i) {
		for (var j = 0; j < this.cs.length; ++j) {
			var p1 = this.cs[j][0];
			var p2 = this.cs[j][1];
			var rl = this.cs[j][2];

			if (p1.im === 0 && p2.im === 0) { continue; }
			var d    = PVector.sub(p2.r, p1.r);
			var dn   = d.x*d.x + d.y*d.y;
			var dl   = 0.5 * (rl + dn/rl);
			var diff = (dl - rl) / (dl * (p1.im + p2.im));
			p1.r.add(PVector.mult(d, p1.im * diff));
			p2.r.sub(PVector.mult(d, p2.im * diff));
		}
	}
};

ParticleSystem.prototype.advance = function() {
	var now = millis();
	var pdt = this.t1 - this.t0;
	var dt  = now - this.t1;

	this.t0 = this.t1;
	this.t1 = now;

	if (this.dirty) { this.applyGlobalForces(); }
	this.verlet(dt, pdt);
	this.handleConstraints();
};

ParticleSystem.prototype.remove = function(p) {
	var prop = 'p_' + p.id;
	if (this.ps.hasOwnProperty(prop)) {
		delete this.ps[prop];
		--this.n;
	}
};
