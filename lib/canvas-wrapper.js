var CanvasWrapper = function(w, h) {
	this.w = w === undefined ? 400 : w;
	this.h = h === undefined ? 400 : h;

	this.img = createImage(this.w, this.h, ARGB);
	this.ctx = this.img.sourceImg.getContext("2d");
};

CanvasWrapper.prototype.draw = function(x, y) {
	if (x === undefined) { x = 0; }
	if (y === undefined) { y = 0; }
	image(this.img, x, y);
};

CanvasWrapper.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.w, this.h);
};

CanvasWrapper.prototype.roundBox = function(x, y, w, h, r) {
	var ctx = this.ctx;
	ctx.save();
	ctx.translate(x, y);
	ctx.beginPath();
	ctx.moveTo(r, 0);
	ctx.lineTo(w - r, 0);
	ctx.quadraticCurveTo(w, 0, w, r);
	ctx.lineTo(w, h - r);
	ctx.quadraticCurveTo(w, h, w - r, h);
	ctx.lineTo(r , h);
	ctx.quadraticCurveTo(0, h, 0, h - r);
	ctx.lineTo(0, r);
	ctx.quadraticCurveTo(0, 0, r, 0);
	ctx.closePath();
	ctx.restore();
};
		
CanvasWrapper.toCssColor = function(kol) {
	var a = kol >>> 24;
	var r = (kol >> 16) & 0xff;
	var g = (kol >> 8) & 0xff;
	var b = kol & 0xff;

	if (a === 255) {
		return 'rgb(' + r + ',' + g + ',' + b + ')'; }
	var al = nf(a / 255, 1, 2);
	return 'rgba(' + r + ',' + g + ',' + b + ',' + al + ')';
};
