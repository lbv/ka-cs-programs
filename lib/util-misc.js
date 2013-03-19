var $fps = function() {
	fill(255, 0, 0);
	text($pjs.__frameRate, 16, height - 16);
};

var $grabImage = function(x, y, imgWidth, imgHeight) {
	var img = createImage(imgWidth, imgHeight, ARGB);
	var ctx = img.sourceImg.getContext("2d");
	var data = toImageData(x, y, imgWidth, imgHeight);
	ctx.putImageData(data, 0, 0);
	return img;
};
