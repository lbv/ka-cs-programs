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
	
	this.cfg.cssBGAlpha = toCss(
		this.cfg.colorBG & 0xccffffff);

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
	this.dirty = true;
	$key.addListenerDown(this.onKeyDown, this);
	$key.addListenerUp(this.onKeyUp, this);
};

KeysIndicator.prototype.drawKey = function(key) {
	this.cw.ctx.strokeStyle = this.cfg.cssBG;
	this.cw.ctx.lineWidth = 1.6;

	if (key.on) {
		this.cw.ctx.fillStyle = this.cfg.cssBGAlpha; }
	else {
		this.cw.ctx.fillStyle = 'rgba(0, 0, 0, 0)'; }

	this.cw.roundBox(0, 0, 20, 20, 3);
	this.cw.ctx.stroke();
	this.cw.ctx.fill();

	if (key.on) {
		this.cw.ctx.fillStyle = this.cfg.cssFG; }
	else {
		this.cw.ctx.fillStyle = this.cfg.cssBG; }
	this.cw.ctx.fillText(key.str, 10, 16);
};

KeysIndicator.prototype.render = function() {
	this.cw.clear();
	for (var kc in this.k) {
		var key = this.k[kc];
		pushMatrix();
		this.cw.ctx.save();

		if (this.cfg.scale !== 1) {
			scale(this.cfg.scale, this.cfg.scale);
			this.cw.ctx.scale(
				this.cfg.scale, this.cfg.scale);
		}
		var x = this.x + key.col * 20;
		var y = this.y + key.row * 20;
		translate(x, y);
		this.cw.ctx.translate(x, y);
		this.drawKey(key);

		this.cw.ctx.restore();
		popMatrix();
	}
	this.dirty = false;
};

KeysIndicator.prototype.draw = function() {
	if (this.dirty) { this.render(); }
	imageMode(CORNER);
	this.cw.draw();
};

KeysIndicator.prototype.onKeyDown = function(code) {
	if (this.k.hasOwnProperty(code)) {
		this.k[code].on = true;
		this.dirty = true;
	}
};

KeysIndicator.prototype.onKeyUp = function(code) {
	if (this.k.hasOwnProperty(code)) {
		this.k[code].on = false;
		this.dirty = true;
	}
};
