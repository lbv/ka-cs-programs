var GUI = $class(function() {
	this.widgets  = [];
	this.rTree    = [];
	this.selected = [];

	this.cfg = {
		colorFG  : 0xff000000,
		colorBG  : 0xdddddddd
	};

	this.cw  = new CanvasWrapper();
	this.ctx = this.cw.ctx;

	this.ctx.fillStyle = '#000000';
	this.ctx.textBaseline = 'top';
});

GUI.prototype.addWidget = function(w, x, y, s) {
	var scale = s === undefined ? 1.0 : s;
	w.anchor(x, y, scale, this);
	this.widgets.push(w);
};

GUI.prototype.buildRTree = function(idx, data, a, b) {
	if (a >= b) { return; }
	if (a === b - 1) {
		this.rTree[idx] = {
			left   : data[a][0],
			top    : data[a][1],
			right  : data[a][2],
			bottom : data[a][3],
			widget : data[a][4]
		};
		return;
	}

	var mid = floor((a + b) / 2);
	var lt  = 2*idx + 1, rt = lt + 1;

	this.buildRTree(lt, data, a, mid);
	this.buildRTree(rt, data, mid, b);

	var ltNode = this.rTree[lt];
	var rtNode = this.rTree[rt];

	this.rTree[idx] = {
		left   : min(ltNode.left, rtNode.left),
		top    : min(ltNode.top, rtNode.top),
		right  : max(ltNode.right, rtNode.right),
		bottom : max(ltNode.bottom, rtNode.bottom)
	};
};

GUI.prototype.endWidgets = function() {
	var data = [];
	var i, n = this.widgets.length;
	for (i = 0; i < n; ++i) {
		var widget = this.widgets[i];
		var left   = widget.x;
		var top    = widget.y;
		var right  = left + widget.width;
		var bottom = top + widget.height;
		data.push([ left, top, right, bottom, widget ]);
	}
	data.sort(function(a, b) {
		if (a[0] !== b[0]) { return a[0] - b[0]; }
		return a[1] - b[1];
	});

	this.rTree = [];
	this.buildRTree(0, data, 0, data.length);
};

GUI.prototype.findSelectedWidgets = function(idx, x, y) {
	if (idx >= this.rTree.length) { return; }
	var node = this.rTree[idx];
	if (x < node.left || y < node.top ||
	    x > node.right || y > node.bottom) { return; }

	if (node.widget !== undefined) {
		this.selected.push(node.widget);
		return;
	}
	this.findSelectedWidgets(2*idx + 1, x, y);
	this.findSelectedWidgets(2*idx + 2, x, y);
};

GUI.prototype.onMouseDragged = function() {
	for (var i = 0; i < this.selected.length; ++i) {
		this.selected[i].onMouseDragged(); }
};

GUI.prototype.onMousePressed = function() {
	this.selected = [];
	this.findSelectedWidgets(0, mouseX, mouseY);
	for (var i = 0; i < this.selected.length; ++i) {
		this.selected[i].onMousePressed(); }
};

GUI.prototype.draw = function() {
	this.cw.clear();
	var i, n = this.widgets.length;
	for (i = 0; i < n; ++i) {
		var widget = this.widgets[i];

		if (widget.font !== null) {
			this.ctx.font = widget.font; }

		pushMatrix();
		this.ctx.save();

		translate(widget.x, widget.y);
		this.ctx.translate(widget.x, widget.y);
		if (widget.scale !== 1.0) {
			scale(widget.scale, widget.scale); }
		this.widgets[i].draw();

		this.ctx.restore();
		popMatrix();
	}
	this.cw.draw();
};


var GUIWidget = $class(function() {
	this.x     = 0;
	this.y     = 0;
	this.scale = 1.0;
	this.font  = null;
	this.gui   = null;

	this.baseWidth  = 0;
	this.baseHeight = 0;

	this.width  = 0;
	this.height = 0;
});

GUIWidget.prototype.anchor = function(x, y, s, gui) {
	this.x = x;
	this.y = y;

	this.gui    = gui;
	this.scale  = s;
	this.width  = round(this.baseWidth * this.scale);
	this.height = round(this.baseHeight * this.scale);
};

GUIWidget.prototype.draw = function() {};

GUIWidget.prototype.onMousePressed = function() {};
GUIWidget.prototype.onMouseDragged = function() {};


var GUILabel = $class(GUIWidget, function(text, font) {
	GUILabel._super.init.call(this);
	
	this.text = text;
	if (font !== undefined) { this.font = font; }
});

GUILabel.prototype.draw = function() {
	this.gui.ctx.fillText(this.text, 0, 0);
};


var GUIScale = $class(GUIWidget,function(lo, hi, step, cb) {
	GUIScale._super.init.call(this);

	this.lo   = lo;
	this.hi   = hi;
	this.step = step;
	this.cb   = cb;
	this.font = '10px sans-serif';

	this.val   = null;
	this.drag  = false;
	this.range = this.hi - this.lo;

	this.label1  = lo === undefined ? '' : lo.toString();
	this.label2  = hi === undefined ? '' : hi.toString();
	this.label1W = 0;
	this.label2W = 0;
});

GUIScale.prototype.anchor = function() {
	GUIScale._super.anchor.apply(this, arguments);
	this.calcLabelWidths();
};

GUIScale.prototype.setValue = function(val, notify) {
	var units = round((val - this.lo) / this.step);
	var newVal = constrain(
		this.lo + units * this.step, this.lo, this.hi);

	if (newVal === this.val) { return; }
	this.val = newVal;

	if (notify) { this.cb.call(this, this.val); }
};

GUIScale.prototype.setLabels = function(lbl1, lbl2) {
	this.label1 = lbl1;
	this.label2 = lbl2;
	this.calcLabelWidths();
};

GUIScale.prototype.calcLabelWidths = function() {
	var ctx = this.gui.ctx;
	ctx.font = this.font;

	this.label1W = ctx.measureText(this.label1).width;
	this.label2W = ctx.measureText(this.label2).width;
};


var GUIHScale = $class(GUIScale,function(lo, hi, step, cb) {
	GUIHScale._super.init.apply(this, arguments);

	this.baseWidth  = 110;
	this.baseHeight = 12;
	this.handleX    = 0;
});

GUIHScale.prototype.setValue = function(val) {
	GUIHScale._super.setValue.apply(this, arguments);

	this.handleX = floor(
		(this.val - this.lo) / (this.hi - this.lo) *
		this.baseWidth);
};

GUIHScale.prototype.draw = function() {
	stroke(this.gui.cfg.colorFG);
	noFill();
	strokeWeight(1);
	rect(0, 5, 110, 3, 1);

	fill(this.gui.cfg.colorFG);
	ellipse(this.handleX, 6, 12, 12);

	var ctx = this.gui.ctx;

	ctx.fillText(this.label1, 0, 14);
	ctx.fillText(this.label2, 110 - this.label2W, 14);
};

GUIHScale.prototype.onMousePressed = function() {
	var x = mouseX, y = mouseY;
	var dx = x - (this.x + this.handleX * this.scale);
	var dy = y - (this.y + 6 * this.scale);
	var d2 = dx*dx + dy*dy;

	var r     = 6 * this.scale;
	var top   = this.y + 5 * this.scale;
	var bot   = this.y + 8 * this.scale;

	if (d2 <= r*r) {
		this.drag = true;
	}
	else if (y >= top && y <= bot) {
		this.drag = true;
		var val = (x - this.x) / this.width * this.range +
			this.lo;
		this.setValue(val, true);
	}
	else {
		this.drag = false;
	}
};

GUIHScale.prototype.onMouseDragged = function() {
	if (! this.drag) { return; }

	var val = (mouseX - this.x) / this.width * this.range +
		this.lo;
	this.setValue(val, true);
};
