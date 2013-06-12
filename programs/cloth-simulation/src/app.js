var App = {
	rows: 7,
	cols: 7,

	gravity: 0.0005,

	grabbing: false,  // are we grabbing a particle?

	closePartI: -1,   // row of the part. closest to mouse
	closePartJ: -1,   // column
	closeDist:  100,  // square of minimum distance

	gui: new GUI()
};


App.startSimulation = function() {
	var psys = new ParticleSystem();
	var ps   = [];  // particles

	var spX = floor(200 / (App.cols - 1));
	var spY = floor(200 / (App.rows - 1));

	var i, j;
	var x, y, m;
	var isCorner;

	// Add individual particles
	for (i = 0; i < App.rows; ++i) {
		ps[i] = [];
		for (j = 0; j < App.cols; ++j) {
			x = 100 + j * spX;
			y = 100 + i * spY;

			isCorner = i === 0 &&
				(j === 0 || j === App.cols - 1);
			m = isCorner ? 0 : 1;

			ps[i][j] = psys.newParticle(x, y, m);
		}
	}

	// Add constraints that hold the particles together
	for (i = 0; i < App.rows; ++i) {
		for (j = 1; j < App.cols; ++j) {
			psys.addConstraint(ps[i][j-1], ps[i][j]); } }

	for (j = 0; j < App.cols; ++j) {
		for (i = 1; i < App.rows; ++i) {
			psys.addConstraint(ps[i-1][j], ps[i][j]); } }

	var g = new $pjs.PVector(0, App.gravity);
	psys.pushForce(g);

	App.psys = psys;
	App.ps   = ps;
};

App.init = function() {
	var updateRows = function(val) {
		App.rows = val;
		App.startSimulation();
	};

	var updateCols = function(val) {
		App.cols = val;
		App.startSimulation();
	};

	var updateG = function(val) {
		App.gravity = val;

		App.psys.popForce();
		var g = new $pjs.PVector(0, App.gravity);
		App.psys.pushForce(g);
	};

	var scaleRows    = new GUIHScale(3, 10, 1, updateRows);
	var scaleCols    = new GUIHScale(3, 10, 1, updateCols);
	var scaleGravity = new GUIHScale(
		0.00001, 0.001, 0.0001, updateG);

	var gui = App.gui;

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

	scaleRows.setValue(App.rows);
	scaleCols.setValue(App.cols);
	scaleGravity.setValue(App.gravity);

	scaleGravity.setLabels('Weak', 'Strong');
	
	App.gui.endWidgets();
	App.startSimulation();
};

App.drawParticles = function() {
	noStroke();
	fill(0, 0, 0);

	var ps = App.ps;

	var closest = 1000;

	if (! App.grabbing) {
		App.closePartI = -1;
		App.closePartJ = -1;
	}
	
	var i, j;
	for (i = 0; i < App.rows; ++i) {
		for (j = 0; j < App.cols; ++j) {
			var p  = ps[i][j];
			var sz = p.im === 0 ? 5 : 2;

			ellipse(p.r.x, p.r.y, sz, sz);
			if (App.grabbing || p.im === 0) { continue; }

			var dx = p.r.x - mouseX;
			var dy = p.r.y - mouseY;
			var dist = dx*dx + dy*dy;

			if (dist <= App.closeDist && dist < closest) {
				closest = dist;
				App.closePartI = i;
				App.closePartJ = j;
			}
		}
	}

	stroke(0.5);
	var p1, p2;
	for (i = 0; i < App.rows; ++i) {
		for (j = 1; j < App.cols; ++j) {
			p1 = ps[i][j-1]; p2 = ps[i][j];
			line(p1.r.x, p1.r.y, p2.r.x, p2.r.y);
		}
	}


	for (j = 0; j < App.cols; ++j) {
		for (i = 1; i < App.rows; ++i) {
			p1 = ps[i-1][j]; p2 = ps[i][j];
			line(p1.r.x, p1.r.y, p2.r.x, p2.r.y);
		}
	}

	if (App.closePartI >= 0) {
		var closeP = ps[App.closePartI][App.closePartJ];
		fill(0xff729fcf);
		ellipse(closeP.r.x, closeP.r.y, 6, 6);
	}
};

var draw = function() {
	background(255, 255, 255);
	App.drawParticles();
	App.gui.draw();
	App.psys.advance();
};

var mousePressed = function() {
	var psys = App.psys;
	var ps   = App.ps;

	App.gui.onMousePressed();
	if (App.closePartI >= 0) {
		App.grabbing = true;
		var part = ps[App.closePartI][App.closePartJ];
		part.im = 0;
		part.r.x = part.pr.x = mouseX;
		part.r.y = part.pr.y = mouseY;
		psys.dirty = true;
	}
};

var mouseReleased = function() {
	var psys = App.psys;
	var ps   = App.ps;

	if (App.grabbing) {
		App.grabbing = false;
		var part = ps[App.closePartI][App.closePartJ];
		part.im = 1;
		psys.dirty = true;
		App.closePartI = App.closePartJ = -1;
	}
};

var mouseDragged = function() {
	var psys = App.psys;
	var ps   = App.ps;

	App.gui.onMouseDragged();
	if (App.grabbing) {
		var part = ps[App.closePartI][App.closePartJ];
		part.r.x = part.pr.x = mouseX;
		part.r.y = part.pr.y = mouseY;
	}
};

App.init();
