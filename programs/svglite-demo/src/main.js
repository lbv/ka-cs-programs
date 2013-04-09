var getSVGImages = function() {
	var svgSnow = new SVGLiteSVG({
		height : 100, width : 100 });

	var svgLayer = new SVGLiteGroup({
		id        : 'layer1',
		transform : 'translate(-296.55 -476.87)'
	});

	var svgPath = new SVGLitePath({
		id : "path5372",
		d  : pathSnowflake,

		fill     : "#204a87",
		opacity  : 0.54419,
		fillRule : "evenodd",

		transform :
			"matrix(.178 -.105 .105 .178 275.03 518.82)"
	});

	svgLayer.add(svgPath);
	svgSnow.add(svgLayer);

	var svgJimi = new SVGLiteSVG({
		width: 1080, height: 1080 });

	svgLayer = new SVGLiteGroup({
		id        : "layer1",
		transform : "translate(0 27.64)"
	});
	svgPath = new SVGLitePath({
		id : "path3011",
		d  : pathJimiHendrix
	});

	svgLayer.add(svgPath);
	svgJimi.add(svgLayer);

	var svgDove = new SVGLiteSVG({
		width: 100, height: 100 });
	svgLayer = new SVGLiteGroup({
		id        : "layer1",
		transform :
			"translate(-470.56 -633.94) " +
			"matrix(.95172 0 0 .95172 25.104 32.979)"
	});
	svgPath = new SVGLitePath({
		d    : pathDove1,
		fill : "#2c2ca0"
	});
	svgLayer.add(svgPath);
	svgPath = new SVGLitePath({
		d    : pathDove2,
		fill : "#ffffff"
	});
	svgLayer.add(svgPath);
	svgDove.add(svgLayer);

	return [
		{
			svg      : svgSnow,
			name     : 'Snowflake',
			rendered : false,
			width    : 200,
			height   : 200,
			angle    : 0,
			scale    : 1,
			maxScale : 2.1
		},
		{
			svg      : svgDove,
			name     : 'White Dove',
			rendered : false,
			width    : 200,
			height   : 200,
			angle    : 0,
			scale    : 1,
			maxScale : 2.1
		},
		{
			svg      : svgJimi,
			name     : 'Jimi Hendrix',
			rendered : false,
			width    : 200,
			height   : 200,
			angle    : 0,
			scale    : 1,
			maxScale : 2.1
		}
	];
};

var App = {};

App.renderTitle = function() {
	var A = App;
	var pic = (A.currentImg + 1).toString();
	var gtxt = 'Graphic ' + pic + ' of ' + A.nImages;
	A.title.setText(0, 0, gtxt);
	A.title.setText(1, 0, A.images[A.currentImg].name);
	A.title.render();
};

App.init = function() {
	App.images     = getSVGImages();
	App.nImages    = App.images.length;
	App.currentImg = 0;

	App.shiftPressed = false;
	App.showHelp     = false;

	App.title = new TextBox(
		{ width: 160, height: 40 }, { vAlign : 'top' });
	App.title.addText('Graphic');
	App.title.addGroup({
		vAlign       : 'bottom',
		marginBottom : 6,
		font         : 'bold 14px sans-serif' });
	App.title.addText('Name', 1);

	var U = $UnicodeChars;
	App.help = new TextBox({
		width  : 300,
		height : 220,
		stroke : '#555753',
		color  : CanvasWrapper.toCssColor(0xddeeeeec)
	}, {
		vAlign    : 'top',
		marginTop : 16,
		color     : '#4e9a06',
		font      : 'bold 18px serif'
	});
	App.help.addText('Keyboard Controls');
	App.help.addGroup({
		hAlign     : 'left',
		vAlign     : 'top',
		marginTop  : 58,
		marginLeft : 26,
		color      : '#4e9a06',
		font       : '14px monospace',
		height     : 14,
		spacing    : 6
	});
	App.help.addText("H", 1);
	App.help.addText(U.left, 1);
	App.help.addText(U.right, 1);
	App.help.addText(U.up, 1);
	App.help.addText(U.down, 1);
	App.help.addText("Shift " + U.left, 1);
	App.help.addText("Shift " + U.right, 1);
	App.help.addGroup({
		hAlign     : 'left',
		vAlign     : 'top',
		marginTop  : 58,
		marginLeft : 98,
		color      : '#000000',
		font       : '14px serif',
		height     : 14,
		spacing    : 6
	});
	App.help.addText('Show/hide this help', 2);
	App.help.addText('Go to previous graphic', 2);
	App.help.addText('Go to next graphic', 2);
	App.help.addText('Increase size of current graphic', 2);
	App.help.addText('Decrease size of current graphic', 2);
	App.help.addText('Rotate to the left', 2);
	App.help.addText('Rotate to the right', 2);
	App.help.render();

	imageMode(CENTER);
	App.renderTitle();
	println("Press 'H' to toggle the help box");
};


var draw = function() {
	var img = App.images[App.currentImg];

	if (! img.rendered) {
		var w = round(img.width * img.scale);
		var h = round(img.height * img.scale);
		img.cw = img.svg.render(w, h);
		img.rendered = true;
	}

	background(255, 255, 255);

	pushMatrix();
	translate(200, 200);
	rotate(img.angle);
	img.cw.draw();
	popMatrix();

	pushMatrix();
	translate(200, 36);
	App.title.cw.draw();
	popMatrix();

	if (App.showHelp) {
		pushMatrix();
		translate(200, 200);
		App.help.cw.draw();
		popMatrix();
	}
};

var keyPressed = function() {
	var A = App;
	var img = A.images[A.currentImg];

	switch (keyCode) {
	case SHIFT:
		A.shiftPressed = true;
		break;

	case 72:  // 'H'
		A.showHelp = ! A.showHelp;
		break;

	case RIGHT:
		if (A.shiftPressed) {
			img.angle += 5; }
		else {
			A.currentImg = A.currentImg + 1;
			A.currentImg %= A.nImages;
			A.renderTitle();
		}
		break;

	case LEFT:
		if (App.shiftPressed) {
			img.angle -= 5; }
		else {
			A.currentImg = A.currentImg - 1;
			A.currentImg += A.nImages;
			A.currentImg %= A.nImages;
			A.renderTitle();
		}
		break;

	case UP:
		img.scale = min(img.maxScale, img.scale + 0.09);
		img.rendered = false;
		break;

	case DOWN:
		img.scale = max(0.1, img.scale - 0.09);
		img.rendered = false;
		break;
	}
};

var keyReleased = function() {
	if (keyCode === SHIFT) { App.shiftPressed = false; }
};

App.init();
