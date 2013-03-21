/**
 * KeysIndicator
 *
 * A small on-screen representation of a group of keys being
 * pressed. The keys are drawn as a rectangular "matrix"
 * with eacj key occupying a certain position of the matrix.
 *
 * Methods:
 *
 *   constructor(x, y, keys, config)
 *     Builds a new KeysIndicator, to be drawn at (x,y),
 *     with the given keys and configuration. `keys` should
 *     be an array of arrays, representing the keys to keep
 *     track of.
 *
 *     Each key is stored as an array of 4 elements, in
 *     order: its keycode, its string representation, and
 *     its row and column inside the matrix.
 *
 *     The `config` argument is an optional object that can
 *     contain the following properties: colorBG, colorFG,
 *     scale, font.
 *
 *   onKeyPressed(), onKeyReleased()
 *     Should be called from the main `keyPressed` and
 *     `keyReleased` functions.
 *
 *   draw()
 *     Should be called from the main `draw`, to draw the
 *     keyboard indicator on the canvas.
 */
var KeysIndicator = function(x, y, keys, cfg) {
	this.x = x;
	this.y = y;

	this.cfg = {
		colorBG : 0xff3465a4,
		colorFG : 0xffffffff,
		scale   : 1,
		font    : '14px sans-serif'
	};

	for (var prop in cfg) {
		if (this.cfg.hasOwnProperty(prop)) {
			this.cfg[prop] = cfg[prop]; }
	}

	this.cw = new CanvasWrapper();
	this.cw.set('font', this.cfg.font);

	this.cfg.cssBG = this.cw.toCssColor(this.cfg.colorBG);
	this.cfg.cssFG = this.cw.toCssColor(this.cfg.colorFG);

	this.k = {};
	for (var i = 0; i < keys.length; ++i) {
		var key = keys[i];
		var kw = this.cw.$('measureText', key[1]).width;
		this.k[key[0]] = {
			str : key[1],
			row : key[2],
			col : key[3],
			on  : false,
			x   : floor((20 - kw) / 2)
		};
	}
};

KeysIndicator.prototype.drawKey = function(key) {
	stroke(this.cfg.colorBG);
	strokeWeight(1.6);

	if (key.on) { fill(this.cfg.colorBG & 0xccffffff); }
	else        { noFill(); }

	rect(0, 0, 20, 20, 3);

	if (key.on) {
		this.cw.set('fillStyle', this.cfg.cssFG); }
	else {
		this.cw.set('fillStyle', this.cfg.cssBG); }
	this.cw.$('fillText', key.str, key.x, 2);
};

KeysIndicator.prototype.draw = function() {
	this.cw.clear();
	for (var kc in this.k) {
		var key = this.k[kc];
		pushMatrix();
		this.cw.$('save');

		if (this.cfg.scale !== 1) {
			scale(this.cfg.scale, this.cfg.scale);
			this.cw.$('scale', this.cfg.scale,
			          this.cfg.scale);
		}
		var x = this.x + key.col * 20;
		var y = this.y + key.row * 20;
		translate(x, y);
		this.cw.$('translate', x, y);
		this.drawKey(key);

		this.cw.$('restore');
		popMatrix();
	}
	this.cw.draw();
};

KeysIndicator.prototype.onKeyPressed = function() {
	if (this.k.hasOwnProperty(keyCode)) {
		this.k[keyCode].on = true; }
};

KeysIndicator.prototype.onKeyReleased = function() {
	if (this.k.hasOwnProperty(keyCode)) {
		this.k[keyCode].on = false; }
};
