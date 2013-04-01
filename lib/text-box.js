var TextBox = function(boxCfg, txtCfg) {
	this.cfg = {
		width  : 400,
		height : 400,
		color  : CanvasWrapper.toCssColor(0xcc2e3436),
		radius : 5,
		stroke : ''
	};
	for (var prop in boxCfg) {
		if (this.cfg[prop] !== undefined) {
			this.cfg[prop] = boxCfg[prop]; }
	}

	var w = this.cfg.width, h = this.cfg.height;
	this.cw = new CanvasWrapper(w, h);

	this.groups = [];
	this.addGroup(txtCfg);
};

TextBox.prototype.addGroup = function(cfg) {
	var group = {
		text    : [],
		font    : '12px sans-serif',
		color   : '#ffffff',
		hAlign  : 'center',
		vAlign  : 'center',
		height  : 12,
		spacing : 2,

		marginBottom : 4,
		marginLeft   : 4,
		marginRight  : 4,
		marginTop    : 4
	};

	for (var prop in cfg) {
		if (group[prop] !== undefined) {
			group[prop] = cfg[prop]; }
	}

	this.groups.push(group);
};

TextBox.prototype.addText = function(txt, grp) {
	if (grp === undefined) { grp = 0; }
	this.groups[grp].text.push(txt);
};

TextBox.prototype.setText = function(grp, idx, txt) {
	this.groups[grp].text[idx] = txt;
};

TextBox.prototype.render = function() {
	this.cw.clear();
	this.renderBox();
	for (var i = 0; i < this.groups.length; ++i) {
		this.renderGroup(this.groups[i]); }
};

TextBox.prototype.renderBox = function() {
	var c   = this.cfg;
	var ctx = this.cw.ctx;

	ctx.fillStyle = c.color;
	if (this.cfg.radius === 0) {
		ctx.fillRect(0, 0, c.width, c.height);
		return;
	}
	var w = c.width, h = c.height, r = c.radius;
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
	ctx.fill();
	if (c.stroke !== '') {
		ctx.strokeStyle = c.stroke;
		ctx.stroke();
	}
};

TextBox.prototype.renderGroup = function(g) {
	var c   = this.cfg;
	var ctx = this.cw.ctx;

	ctx.save();
	ctx.font = g.font;
	ctx.fillStyle = g.color;
	switch (g.hAlign) {
	case 'left':
		ctx.textAlign = 'left';
		ctx.translate(g.marginLeft, 0);
		break;
	case 'right':
		ctx.textAlign = 'right';
		ctx.translate(c.width - g.marginRight, 0);
		break;
	case 'center':
		ctx.textAlign = 'center';
		ctx.translate(round(c.width / 2), 0);
		break;
	}

	var nlines = g.text.length;
	var hAll = nlines*g.height + g.spacing * (nlines - 1);
	var y;

	switch (g.vAlign) {
	case 'top':
		ctx.translate(0, g.marginTop + g.height);
		break;
	case 'bottom':
		y = c.height - (hAll+g.marginBottom) + g.height;
		ctx.translate(0, y);
		break;
	case 'center':
		y = round((c.height - hAll) / 2) + g.height;
		ctx.translate(0, y);
		break;
	}

	var n = g.text.length;
	for (var i = 0; i < n; ++i) {
		var txt = g.text[i];
		ctx.fillText(txt, 0, 0);
		ctx.translate(0, g.height + g.spacing);
	}
	ctx.restore();
};
