var $ = {};

$.gif = new GIFReader(new Base64Reader(monaLisaData));

$.monaImg = $.gif.getImages()[0];
$.scale   = 0.67;
$.x       = 0;
$.y       = 0;
$.help    = false;

$.thZoom = new TextHelper({
	fontName : "sans-serif",
	fontSize : 12,
	spacing  : 0,
	bgColor  : 0xcc555753,
	fgColor  : 0xffffffff,
	rect     : [ 8, 8, 90, 26 ],
	margin   : [ 8, 16 ],
	text     : [ "Zoom: ?%" ]
});

$.thHelp = new TextHelper({
	fontName : "sans-serif",
	fontSize : 14,
	spacing  : 20,
	bgColor  : 0xcc555753,
	fgColor  : 0xfffce94f,
	rect     : [ 8, 120, 260, 160 ],
	margin   : [ 8, 24 ],
	text     : [
		"Keyboard controls:",
		"",
		"0 : Reset zoom level to 100%",
		"= : Fit image to canvas",
		"+ : Zoom in",
		"- : Zoom out",
		"arrows : Move around when zoomed" ]
});


$.centerImage = function() {
	$.x = (width - $.monaImg.width * $.scale) / 2;
};

$.updateScale = function(delta) {
	var oldScale = $.scale;
	$.scale = constrain($.scale + delta, 0.1, 2.0);

	var diff = $.scale - oldScale;
	var dx = -(diff * $.monaImg.width / 2);
	var dy = -(diff * $.monaImg.height / 2);

	$.x += dx;
	$.y += dy;
};

var draw = function() {
	background(0xffd3d7cf);
	pushMatrix();
	translate(floor($.x), floor($.y));
	scale($.scale, $.scale);
	image($.monaImg, 0, 0);
	popMatrix();

	var zoom = round($.scale * 100);
	$.thZoom.cfg.text[0] = "Zoom: " + zoom + "%";
	$.thZoom.draw();

	if ($.help) { $.thHelp.draw(); }
};

var keyPressed = function() {
	switch (keyCode) {
	case 72:  // 'H'
		$.help = !$.help;
		break;

	case UP:
		if ($.y < 0) { $.y = min(0, $.y + 3 * $.scale); }
		break;

	case DOWN:
		var top = height - $.monaImg.height * $.scale;
		if ($.y > top) {
			$.y = max(top, $.y - 3 * $.scale); }
		break;

	case LEFT:
		if ($.x < 0) { $.x = min(0, $.x + 3 * $.scale); }
		break;

	case RIGHT:
		var left = width - $.monaImg.width * $.scale;
		if ($.x > left) {
			$.x = max(left, $.x - 3 * $.scale); }
		break;

	}

	switch (floor(key)) {
	case 48:  // '0'
		$.scale = 1.0;
		$.x = $.y = 0;
		break;

	case 61:  // '='
		$.scale = 0.67;
		$.y = 0;
		$.centerImage();
		break;

	case 43:  // '+'
		$.updateScale(0.02);
		break;
		
	case 45:  // '-'
		$.updateScale(-0.02);
		break;
	}
};

$.centerImage();

println("Press 'H' to toggle help");
