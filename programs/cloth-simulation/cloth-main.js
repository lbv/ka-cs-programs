//
// Global variables
//
var rows    = 5;
var cols    = 5;
var gravity = 0.0005;

var grabbing = false;  // are we grabbing a particle?

var closePartI = -1;   // row of the part. closest to mouse
var closePartJ = -1;   // column
var closeDist  = 100;  // square of minimum distance

var psys;  // particle system
var ps;    // particles

var gui = new GUI();


//
// Functions
//
var startSimulation = function() {
	psys = new ParticleSystem();
	ps   = [];

	var spX = floor(200 / (cols - 1));
	var spY = floor(200 / (rows - 1));

	var i, j;

	// Add individual particles
	for (i = 0; i < rows; ++i) {
		ps[i] = [];
		for (j = 0; j < cols; ++j) {
			var x = 100 + j * spX;
			var y = 100 + i * spY;
			var m = i === 0 && (j === 0 || j === cols-1) ?
				0 : 1;
			ps[i][j] = psys.newParticle(x, y, m);
		}
	}

	// Add constraints that hold the particles together
	for (i = 0; i < rows; ++i) {
		for (j = 1; j < cols; ++j) {
			psys.addConstraint(ps[i][j-1], ps[i][j]); } }

	for (j = 0; j < cols; ++j) {
		for (i = 1; i < rows; ++i) {
			psys.addConstraint(ps[i-1][j], ps[i][j]); } }

	var g = new $pjs.PVector(0, gravity);
	psys.pushForce(g);
};

var init = function() {
	var updateRows = function(val) {
		rows = val;
		startSimulation();
	};

	var updateCols = function(val) {
		cols = val;
		startSimulation();
	};

	var updateG = function(val) {
		gravity = val;
		startSimulation();
	};

	var scaleRows    = new GUIHScale(3, 10, 1, updateRows);
	var scaleCols    = new GUIHScale(3, 10, 1, updateCols);
	var scaleGravity = new GUIHScale(
		0.00001, 0.001, 0.0001, updateG);

	gui.addWidget(scaleRows, 18, 30);
	gui.addWidget(scaleCols, 146, 30);
	gui.addWidget(scaleGravity, 274, 30);

	var lblFont = 'bold 14px sans-serif';
	var lbl;

	lbl = new GUILabel("Rows", lblFont);
	gui.addWidget(lbl, 18, 14);
	lbl = new GUILabel("Columns", lblFont);
	gui.addWidget(lbl, 146, 14);
	lbl = new GUILabel("Gravity", lblFont);
	gui.addWidget(lbl, 274, 14);

	scaleRows.setValue(rows);
	scaleCols.setValue(cols);
	scaleGravity.setValue(gravity);

	scaleGravity.setLabels('Weak', 'Strong');
	
	gui.endWidgets();
	startSimulation();
};

var drawParticles = function() {
	noStroke();
	fill(0, 0, 0);

	var closest = 1000;
	if (! grabbing) {
		closePartI = -1;
		closePartJ = -1;
	}

	var i, j;
	for (i = 0; i < rows; ++i) {
		for (j = 0; j < cols; ++j) {
			var p  = ps[i][j];
			var sz = p.im === 0 ? 5 : 2;

			ellipse(p.r.x, p.r.y, sz, sz);
			if (grabbing || p.im === 0) { continue; }

			var dx = p.r.x - mouseX;
			var dy = p.r.y - mouseY;
			var dist = dx*dx + dy*dy;

			if (dist <= closeDist && dist < closest) {
				closest = dist;
				closePartI = i;
				closePartJ = j;
			}
		}
	}

	stroke(0.5);
	var p1, p2;
	for (i = 0; i < rows; ++i) {
		for (j = 1; j < cols; ++j) {
			p1 = ps[i][j-1]; p2 = ps[i][j];
			line(p1.r.x, p1.r.y, p2.r.x, p2.r.y);
		}
	}


	for (j = 0; j < cols; ++j) {
		for (i = 1; i < rows; ++i) {
			p1 = ps[i-1][j]; p2 = ps[i][j];
			line(p1.r.x, p1.r.y, p2.r.x, p2.r.y);
		}
	}

	if (closePartI >= 0) {
		var closeP = ps[closePartI][closePartJ];
		fill(0xff729fcf);
		ellipse(closeP.r.x, closeP.r.y, 6, 6);
	}
};

var draw = function() {
	background(255, 255, 255);
	drawParticles();
	gui.draw();
	psys.advance();
};

var mousePressed = function() {
	gui.onMousePressed();
	if (closePartI >= 0) {
		grabbing = true;
		var part = ps[closePartI][closePartJ];
		part.im = 0;
		part.r.x = part.pr.x = mouseX;
		part.r.y = part.pr.y = mouseY;
		psys.dirty = true;
	}
};

var mouseReleased = function() {
	if (grabbing) {
		grabbing = false;
		var part = ps[closePartI][closePartJ];
		part.im = 1;
		psys.dirty = true;
		closePartI = closePartJ = -1;
	}
};

var mouseDragged = function() {
	gui.onMouseDragged();
	if (grabbing) {
		var part = ps[closePartI][closePartJ];
		part.r.x = part.pr.x = mouseX;
		part.r.y = part.pr.y = mouseY;
	}
};


//
// Entry point
//
init();
