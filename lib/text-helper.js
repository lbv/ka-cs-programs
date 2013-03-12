/**
 * TextHelper
 *
 * Simple class to aid in the drawing of text in the canvas.
 * You create an object, passing a "configuration" object,
 * that defined the following properties:
 *
 *   fontName: name of the font, e.g. "monospace", "serif"
 *   fontSize: size of the font in point
 *   spacing:  space in pixels between different lines
 *   bgColor:  color of the background for the text
 *   fgColor:  color for the text
 *   rect:     an array of 4 numbers, defining the rectangle
 *             where the text will be drawn
 *   margin:   an array of 2 numbers, indicating the margin
 *             relative to the upper left corner
 *   text:     an array of strings, each element represents
 *             a line of text
 *
 * To apply it, call the draw method when you need it.
 */
var TextHelper = function(cfg) {
	this.cfg  = cfg;
	this.font = createFont(cfg.fontName, cfg.fontSize);
};

TextHelper.prototype.draw = function() {
	noStroke();
	fill(this.cfg.bgColor);
	rect(this.cfg.rect[0], this.cfg.rect[1],
	     this.cfg.rect[2], this.cfg.rect[3], 5);
	fill(this.cfg.fgColor);
	textFont(this.font, this.cfg.fontSize);
	pushMatrix();
	translate(this.cfg.rect[0] + this.cfg.margin[0],
	          this.cfg.rect[1] + this.cfg.margin[1]);
	for (var i = 0; i < this.cfg.text.length; ++i) {
		text(this.cfg.text[i], 0, 0);
		translate(0, this.cfg.spacing);
	}
	popMatrix();
};
