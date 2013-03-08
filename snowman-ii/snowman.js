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
