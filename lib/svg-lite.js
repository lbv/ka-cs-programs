var SVGLiteCommandList = $class(function() {
	this.cmds = [];
});

SVGLiteCommandList.prototype.add = function() {
	var cmd = {
		method : arguments[0],
		args   : [].slice.call(arguments, 1)
	};
	this.cmds.push(cmd);
};

SVGLiteCommandList.prototype.apply = function(ctx) {
	var n = this.cmds.length;
	for (var i = 0; i < n; ++i) {
		var cmd = this.cmds[i];
		ctx[cmd.method].apply(ctx, cmd.args);
	}
};


var SVGLiteStyleSet = $class(function() {
	this.defs = {};
});

SVGLiteStyleSet.prototype.add = function(prop, val) {
	this.defs[prop] = val;
};

SVGLiteStyleSet.prototype.apply = function(ctx) {
	for (var prop in this.defs) {
		ctx[prop] = this.defs[prop]; }
};


var SVGLiteTransformParser = $class(
	ParserBase, function() {
	SVGLiteTransformParser._super.init.call(this);
});

SVGLiteTransformParser.Tokens = {
	NAME   : 1,
	PAREN1 : 2,
	PAREN2 : 3,
	NUMBER : 4
};

SVGLiteTransformParser.RegEx = {
	ws     : /^[,\s]+/,
	name   : /^[a-z]\w*/,
	paren1 : /^\(/,
	paren2 : /^\)/,
	number : /^-?(\d*\.)?\d+/
};

SVGLiteTransformParser.prototype.lexer = function(str) {
	var T = SVGLiteTransformParser.Tokens;
	var R = SVGLiteTransformParser.RegEx;

	var len = str.length;
	var s, m;
	for (var i = 0; i < len; ) {
		s = str.substr(i);
		if ((m = R.ws.exec(s)) !== null) {
			i += m[0].length;
			continue;
		}
		if ((m = R.name.exec(s)) !== null) {
			this.tokens.push({ t : T.NAME, v : m[0] });
			i += m[0].length;
			continue;
		}
		if ((m = R.paren1.exec(s)) !== null) {
			this.tokens.push({ t : T.PAREN1 });
			++i;
			continue;
		}
		if ((m = R.paren2.exec(s)) !== null) {
			this.tokens.push({ t : T.PAREN2 });
			++i;
			continue;
		}
		if ((m = R.number.exec(s)) !== null) {
			var val = parseFloat(m[0]);
			this.tokens.push({ t : T.NUMBER, v : val });
			i += m[0].length;
			continue;
		}
		throw 'Invalid input';
	}
};

SVGLiteTransformParser.prototype.parse = function(str) {
	this.init();
	this.lexer(str);

	this.cmds = new SVGLiteCommandList();

	var T = SVGLiteTransformParser.Tokens;
	while (! this.end()) {
		var tok = this.peek();
		if (tok.t === T.NAME) {
			if (tok.v === 'matrix') {
				this.parseMatrix(); }
			else if (tok.v === 'translate') {
				this.parseTranslate(); }
			else if (tok.v === 'scale') {
				this.parseScale(); }
			else if (tok.v === 'rotate') {
				this.parseRotate(); }
			else { throw 'Invalid command'; }
		}
		else { throw 'Invalid token'; }
	}
	return this.cmds;
};

SVGLiteTransformParser.prototype.parseMatrix = function() {
	var T = SVGLiteTransformParser.Tokens;
	this.readToken(T.NAME);
	this.readToken(T.PAREN1);
	var a = this.readToken(T.NUMBER).v;
	var b = this.readToken(T.NUMBER).v;
	var c = this.readToken(T.NUMBER).v;
	var d = this.readToken(T.NUMBER).v;
	var e = this.readToken(T.NUMBER).v;
	var f = this.readToken(T.NUMBER).v;
	this.readToken(T.PAREN2);
	this.cmds.add('transform', a, b, c, d, e, f);
};

SVGLiteTransformParser.prototype.
parseTranslate = function() {
	var T = SVGLiteTransformParser.Tokens;
	this.readToken(T.NAME);
	this.readToken(T.PAREN1);
	var tx = this.readToken(T.NUMBER).v;
	var ty = 0;
	if (this.peek().t === T.NUMBER) {
		ty = this.readToken(T.NUMBER).v; }
	this.readToken(T.PAREN2);
	this.cmds.add('translate', tx, ty);
};

SVGLiteTransformParser.prototype.parseScale = function() {
	var T = SVGLiteTransformParser.Tokens;
	this.readToken(T.NAME);
	this.readToken(T.PAREN1);
	var sx = this.readToken(T.NUMBER).v;
	var sy = 0;
	if (this.peek().t === T.NUMBER) {
		sy = this.readToken(T.NUMBER).v; }
	this.readToken(T.PAREN2);
	this.cmds.add('scale', sx, sy);
};

SVGLiteTransformParser.prototype.parseRotate = function() {
	var T = SVGLiteTransformParser.Tokens;
	this.readToken(T.NAME);
	this.readToken(T.PAREN1);
	var angle = this.readToken(T.NUMBER).v;
	var cmd;
	if (this.peek().t === T.NUMBER) {
		var cx = this.readToken(T.NUMBER).v;
		var cy = this.readToken(T.NUMBER).v;
		this.cmds.add('translate', cx, cy);
		this.cmds.add('rotate', angle);
		this.cmds.add('translate', -cx, -cy);
	}
	else {
		this.cmds.add('rotate', angle); }
	this.readToken(T.PAREN2);
};


var SVGLitePathParser = $class(ParserBase, function() {
	SVGLitePathParser._super.init.call(this);
});

SVGLitePathParser.Tokens = {
	NUMBER  : 0,
	COMMAND : 1
};

SVGLitePathParser.RegEx = {
	ws     : /^[,\s]+/,
	number : /^-?(\d*\.)?\d+/,
	cmd    : /^[a-zA-Z]/
};

SVGLitePathParser.Commands = {
	c : 'CurveTo',
	h : 'HorizontalLineTo',
	l : 'LineTo',
	m : 'MoveTo',
	s : 'SmoothCurveTo',
	v : 'VerticalLineTo',
	z : 'ClosePath'
};

SVGLitePathParser.prototype.lexer = function(str) {
	var T = SVGLitePathParser.Tokens;
	var R = SVGLitePathParser.RegEx;

	var s, m;
	var len = str.length;
	for (var i = 0; i < len; ) {
		s = str.substr(i);
		if ((m = R.ws.exec(s)) !== null) {
			i += m[0].length;
			continue;
		}
		if ((m = R.number.exec(s)) !== null) {
			var val = parseFloat(m[0]);
			this.tokens.push({ t : T.NUMBER, v : val });
			i += m[0].length;
			continue;
		}
		if ((m = R.cmd.exec(s)) !== null) {
			this.tokens.push({ t : T.COMMAND, v : m[0] });
			++i;
			continue;
		}
		throw 'Invalid token';
	}
};

SVGLitePathParser.prototype.parse = function(pathDef) {
	this.init();
	this.lexer(pathDef);

	this.isPathAbs = true;
	this.pathX     = 0;
	this.pathY     = 0;
	this.pathStack = [];
	this.cmdNum    = 0;
	this.cmds      = new SVGLiteCommandList();

	var command = this.parseMove;

	var T = SVGLitePathParser.Tokens;
	var C = SVGLitePathParser.Commands;

	this.cmds.add('beginPath');
	while (! this.end()) {
		var tok = this.peek();
		if (tok.t === T.COMMAND) {
			var lcComm = tok.v.toLowerCase();
			if (C[lcComm] === undefined) {
				throw 'Invalid command: ' + tok.v; }
			this.isPathAbs = (
				tok.v >= 'A' && tok.v <= 'Z');
			var methodName = 'parse' + C[lcComm];
			command = this[methodName];
			this.pop();
		}
		command.call(this);
		++this.cmdNum;
	}
	this.cmds.add('stroke');
	this.cmds.add('fill');
	return this.cmds;
};

SVGLitePathParser.prototype.parseCoordX = function() {
	var T = SVGLitePathParser.Tokens;
	var num = this.readToken(T.NUMBER).v;
	return this.isPathAbs ? num : this.pathX + num;
};

SVGLitePathParser.prototype.parseCoordY = function() {
	var T = SVGLitePathParser.Tokens;
	var num = this.readToken(T.NUMBER).v;
	return this.isPathAbs ? num : this.pathY + num;
};

SVGLitePathParser.prototype.parseClosePath = function() {
	if (this.pathStack.length === 0) {
		throw 'Unexpected path command: z'; }
	this.cmds.add('closePath');
	var subp = this.pathStack.pop();
	this.pathX = subp[0];
	this.pathY = subp[1];
};

SVGLitePathParser.prototype.parseMoveTo = function() {
	var x = this.parseCoordX();
	var y = this.parseCoordY();
	this.cmds.add('moveTo', x, y);
	this.pathStack.push([ x, y ]);
	this.pathX = x;
	this.pathY = y;
};

SVGLitePathParser.prototype.parseCurveTo = function() {
	var x1 = this.parseCoordX();
	var y1 = this.parseCoordY();
	var x2 = this.parseCoordX();
	var y2 = this.parseCoordY();
	var x  = this.parseCoordX();
	var y  = this.parseCoordY();

	this.cmds.add('bezierCurveTo', x1, y1, x2, y2, x, y);
	this.pathX = x;
	this.pathY = y;
	this.smoothPoint = [ this.cmdNum, x2, y2 ];
};

SVGLitePathParser.prototype.
parseSmoothCurveTo = function() {
	var x1, y1;
	if (this.smoothPoint !== undefined &&
	    this.smoothPoint[0] === this.cmdNum - 1) {
		x1 = 2*this.pathX - this.smoothPoint[1];
		y1 = 2*this.pathY - this.smoothPoint[2];
	}
	else {
		x1 = this.pathX;
		y1 = this.pathY;
	}
	var x2 = this.parseCoordX();
	var y2 = this.parseCoordY();
	var x  = this.parseCoordX();
	var y  = this.parseCoordY();

	this.cmds.add('bezierCurveTo', x1, y1, x2, y2, x, y);
	this.pathX = x;
	this.pathY = y;
	this.smoothPoint = [ this.cmdNum, x2, y2 ];
};

SVGLitePathParser.prototype.parseLineTo = function() {
	var x  = this.parseCoordX();
	var y  = this.parseCoordY();

	this.cmds.add('lineTo', x, y);
	this.pathX = x;
	this.pathY = y;
};

SVGLitePathParser.prototype.
parseHorizontalLineTo = function() {
	var x  = this.parseCoordX();

	this.cmds.add('lineTo', x, this.pathY);
	this.pathX = x;
};

SVGLitePathParser.prototype.
parseVerticalLineTo = function() {
	var y  = this.parseCoordY();

	this.cmds.add('lineTo', this.pathX, y);
	this.pathY = y;
};


var SVGLiteElement = $class(function(attrs) {
	this.attr = this.baseAttributes();

	for (var a in attrs) {
		if (this.attr[a] !== undefined) {
			this.attr[a] = attrs[a]; }
	}

	this.parent   = null;
	this.children = [];

	this.transform = null;
	this.style     = null;
});

SVGLiteElement.prototype.baseAttributes = function() {
	return { id : null };
};

SVGLiteElement.prototype.parseTransform = function() {
	if (this.attr.transform === undefined ||
	    this.attr.transform === null) { return; }
	var parser = new SVGLiteTransformParser();
	this.transform = parser.parse(this.attr.transform);
};

SVGLiteElement.prototype.applyTransform = function(ctx) {
	if (this.parent !== null) {
		this.parent.applyTransform(ctx); }
	if (this.transform !== null) {
		this.transform.apply(ctx); }
};

SVGLiteElement.prototype.applyStyle = function(ctx) {
	if (this.parent !== null) {
		this.parent.applyStyle(ctx); }
	if (this.style !== null) {
		this.style.apply(ctx); }
};

SVGLiteElement.prototype.add = function(elem) {
	elem.parent = this;
	this.children.push(elem);
};

SVGLiteElement.prototype.render = function() {};

SVGLiteElement.prototype.compose = function(cw) {
	for (var i = 0; i < this.children.length; ++i) {
		var child = this.children[i];
		var cwChild = child.render(cw.w, cw.h);
		cw.ctx.drawImage(cwChild.img.sourceImg, 0, 0);
	}
};


var SVGLiteSVG = $class(SVGLiteElement, function(attrs) {
	SVGLiteSVG._super.init.call(this, attrs);
});

SVGLiteSVG.prototype.baseAttributes = function() {
	var attr = SVGLiteSVG._super.baseAttributes.call();
	attr.width  = 400;
	attr.height = 400;
	return attr;
};

SVGLiteSVG.prototype.render = function(w, h) {
	var cw = new CanvasWrapper(w, h);
	var sx = w / this.attr.width;
	var sy = h / this.attr.height;
	if (sx !== 1.0 || sy !== 1.0) {
		this.transform = new SVGLiteCommandList();
		this.transform.add('scale', sx, sy);
	}
	this.compose(cw);
	return cw;
};


var SVGLiteGroup = $class(SVGLiteElement, function(attrs) {
	SVGLiteGroup._super.init.call(this, attrs);
	this.parseTransform();
});

SVGLiteGroup.prototype.baseAttributes = function() {
	var attr = SVGLiteGroup._super.baseAttributes.call();
	attr.transform = null;
	return attr;
};

SVGLiteGroup.prototype.render = function(w, h) {
	var cw = new CanvasWrapper(w, h);
	this.compose(cw);
	return cw;
};


var SVGLitePath = $class(SVGLiteElement, function(attrs) {
	SVGLitePath._super.init.call(this, attrs);
	this.parseTransform();
	var parser = new SVGLitePathParser();
	this.path = parser.parse(this.attr.d);

	this.style = new SVGLiteStyleSet();
	this.style.add('fillStyle', this.attr.fill);
	this.style.add('strokeStyle', this.attr.stroke);
	if (this.attr.fillRule === 'evenodd') {
		this.style.add('mozFillRule', 'evenodd');
		var n = this.path.cmds.length;
		for (var i = 0; i < n; ++i) {
			var cmd = this.path.cmds[i];
			if (cmd.method === 'fill') {
				cmd.args.push('evenodd'); }
		}
	}
	if (this.attr.opacity !== 1.0) {
		this.style.add('globalAlpha', this.attr.opacity); }
});

SVGLitePath.prototype.baseAttributes = function() {
	var attr = SVGLitePath._super.baseAttributes.call();
	attr.transform = null;
	attr.d         = '';
	attr.fill      = '#000000';
	attr.opacity   = 1.0;
	attr.fillRule  = 'nonzero';
	attr.stroke    = 'rgba(0, 0, 0, 0)';
	return attr;
};

SVGLitePath.prototype.render = function(w, h) {
	var cw = new CanvasWrapper(w, h);
	var ctx = cw.ctx;

	this.applyTransform(ctx);
	this.applyStyle(ctx);
	this.path.apply(ctx);
	return cw;
};
