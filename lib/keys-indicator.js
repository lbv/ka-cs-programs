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
	this.cw.ctx.font      = this.cfg.font;
	this.cw.ctx.textAlign = 'center';

	var toCss = CanvasWrapper.toCssColor;
	this.cfg.cssBG = toCss(this.cfg.colorBG);
	this.cfg.cssFG = toCss(this.cfg.colorFG);

	this.k = {};
	for (var i = 0; i < keys.length; ++i) {
		var key = keys[i];
		this.k[key[0]] = {
			str : key[1],
			row : key[2],
			col : key[3],
			on  : false
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
		this.cw.ctx.fillStyle = this.cfg.cssFG; }
	else {
		this.cw.ctx.fillStyle = this.cfg.cssBG; }
	this.cw.ctx.fillText(key.str, 10, 17);
};

KeysIndicator.prototype.draw = function() {
	this.cw.clear();
	for (var kc in this.k) {
		var key = this.k[kc];
		pushMatrix();
		this.cw.ctx.save();

		if (this.cfg.scale !== 1) {
			scale(this.cfg.scale, this.cfg.scale);
			this.cw.$('scale', this.cfg.scale,
			          this.cfg.scale);
		}
		var x = this.x + key.col * 20;
		var y = this.y + key.row * 20;
		translate(x, y);
		this.cw.ctx.translate(x, y);
		this.drawKey(key);

		this.cw.ctx.restore();
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
