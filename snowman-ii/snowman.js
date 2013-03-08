var Snowman = function(x, y, scale) {
	this.ps     = new ParticleSystem();
	this.p      = this.ps.newParticle(x, y);
	this.ground = y;
	this.scale  = scale;
};

Snowman.ball = $.ul * 25;
Snowman.shadow = color(240, 240, 240);

Snowman.prototype.draw = function() {
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
