/**
 * TextLayer
 *
 * Simple wrapper for the HTML canvas text-manipulation API.
 * Created mainly to avoid some strange bugs related to
 * circular references with PFont objects, but also because
 * it can be useful to have lower-level access.
 */
var TextLayer = function() {
	this.img = createImage(400, 400, ARGB);
	this.ctx = this.img.sourceImg.getContext("2d");

	this.ctx.font = '12px sans-serif';
	this.ctx.textBaseline = 'top';
};

TextLayer.prototype.draw = function() {
	image(this.img, 0, 0);
};

TextLayer.prototype.fill = function(txt, x, y) {
	this.ctx.fillText(txt, x, y);
};

TextLayer.prototype.setFillStyle = function(style) {
	this.ctx.fillStyle = style;
};

TextLayer.prototype.setFont = function(fnt) {
	this.ctx.font = fnt;
};

TextLayer.prototype.setBaseline = function(bl) {
	this.ctx.textBaseline = bl;
};

TextLayer.prototype.measure = function(txt) {
	return this.ctx.measureText(txt).width;
};

TextLayer.prototype.translate = function(x, y) {
	this.ctx.translate(x, y);
};

TextLayer.prototype.save = function() { this.ctx.save(); };

TextLayer.prototype.restore = function() {
	this.ctx.restore();
};

TextLayer.prototype.clear = function() {
	this.ctx.clearRect(0, 0, 400, 400);
};
