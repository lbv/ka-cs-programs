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
