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

var images       = getSVGImages();
var nImages      = images.length;
var currentImg   = 0;
var shiftPressed = false;
var title        = new CanvasWrapper(200, 40);

imageMode(CENTER);

var renderTitle = function() {
	title.clear();
	title.ctx.font = '14px sans-serif';
	title.ctx.fillStyle = '#ffffff';
	title.ctx.textAlign = 'center';
	var pic = (currentImg + 1).toString();
	title.ctx.fillText(
		'Graphic ' + pic + ' of ' + nImages, 100, 16);
	title.ctx.font = 'bold 16px sans-serif';
	title.ctx.fillText(images[currentImg].name, 100, 34);
};

var draw = function() {
	var img = images[currentImg];
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

	fill(0xcc2e3436);
	noStroke();
	rect(100, 16, 200, 40, 8);

	pushMatrix();
	translate(200, 36);
	title.draw();
	popMatrix();
};

var keyPressed = function() {
	var img = images[currentImg];
	switch (keyCode) {
	case SHIFT:
		shiftPressed = true;
		break;

	case RIGHT:
		if (shiftPressed) {
			img.angle += 5; }
		else {
			currentImg = (currentImg + 1) % nImages;
			renderTitle();
		}
		break;

	case LEFT:
		if (shiftPressed) {
			img.angle -= 5; }
		else {
			currentImg = currentImg - 1 + nImages;
			currentImg %= nImages;
			renderTitle();
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
	if (keyCode === SHIFT) { shiftPressed = false; }
};

renderTitle();
