/**
 * CanvasWrapper
 *
 * Simple wrapper for the HTML canvas API. Created mainly to
 * avoid some strange bugs related to circular references
 * when using things PFont objects, but also because it can
 * be useful to have the lower-level access.
 *
 * Basically it creates a new `PImage`, and obtains a Canvas
 * context object from it, on which you operate.
 *
 * Methods:
 *
 *   $(method, ...)
 *     Calls the given `method` from the canvas, passing the
 *     given arguments. Returns whatever is returned by that
 *     method from the canvas.
 *
 *   set(property, value)
 *     Sets the given property of the canvas to some value.
 *
 *   get(property)
 *     Returns the given property.
 *
 *   draw()
 *     Draws the internal canvas on the real canvas.
 *
 *   clear()
 *     Clears everything from the canvas.
 *
 *   toCssColor(color)
 *     Returns the given `color` as a CSS definition for the
 *     same colour.
 */
var CanvasWrapper = function() {
	this.img = createImage(400, 400, ARGB);
	this.ctx = this.img.sourceImg.getContext("2d");

	this.ctx.font = '12px sans-serif';
	this.ctx.textBaseline = 'top';
};

CanvasWrapper.prototype.draw = function() {
	image(this.img, 0, 0);
};

CanvasWrapper.prototype.get = function(prop) {
	return this.ctx[prop];
};

CanvasWrapper.prototype.set = function(prop, val) {
	this.ctx[prop] = val;
};

CanvasWrapper.prototype.$ = function() {
	var method = arguments[0];
	var argv   = [].slice.call(arguments, 1);
	return this.ctx[method].apply(this.ctx, argv);
};

CanvasWrapper.prototype.clear = function() {
	this.ctx.clearRect(0, 0, 400, 400);
};

CanvasWrapper.prototype.toCssColor = function(kol) {
	var a = kol >>> 24;
	var r = (kol >> 16) & 0xff;
	var g = (kol >> 8) & 0xff;
	var b = kol & 0xff;

	if (a === 255) {
		return 'rgb(' + r + ',' + g + ',' + b + ')'; }
	var al = nf(a / 255, 1, 2);
	return 'rgba(' + r + ',' + g + ',' + b + ',' + al + ')';
};
