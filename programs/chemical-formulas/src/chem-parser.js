var ChemParser = $class(ParserBase, function() {
	ChemParser._super.init.call(this);
});

ChemParser.Tokens = {
	INT    : 0,
	ELEM   : 1,
	PAREN1 : 2,
	PAREN2 : 3
};

ChemParser.TokenNames = [
	'Integer',
	'Element',
	'Opening Parenthesis',
	'Closing Parenthesis'
];

ChemParser.RegEx = {
	ws     : /^\s+/,
	int    : /^\d+/,
	elem   : /^[A-Z][a-z]{0,2}/,
	paren1 : /^\(/,
	paren2 : /^\)/
};

ChemParser.tokenString = function(tok) {
	var name = ChemParser.TokenNames[tok.t];
	if (tok.v) { name += " (" + tok.v + ")"; }
	return name;
};

ChemParser.prototype.lexer = function(str) {
	var len = str.length;
	var R   = ChemParser.RegEx;
	var T   = ChemParser.Tokens;
	var s, m, val;
	for (var i = 0; i < len; ) {
		s = str.substr(i);
		if ((m = R.ws.exec(s)) !== null) {
			i += m[0].length;
			continue;
		}
		if ((m = R.int.exec(s)) !== null) {
			val = parseInt(m[0], 10);
			this.tokens.push({ t : T.INT, v : val });
			i += m[0].length;
			continue;
		}
		if ((m = R.elem.exec(s)) !== null) {
			this.tokens.push({ t : T.ELEM, v : m[0] });
			i += m[0].length;
			continue;
		}
		if ((m = R.paren1.exec(s)) !== null) {
			this.tokens.push({ t : T.PAREN1 });
			i += m[0].length;
			continue;
		}
		if ((m = R.paren2.exec(s)) !== null) {
			this.tokens.push({ t : T.PAREN2 });
			i += m[0].length;
			continue;
		}
		var r = s.length < 4 ? s : s.substr(0, 3) + '...';
		throw "Can't recognize '" + r + "' at index " + i;
	}
};

/**
Grammar:

  <formula>  ::= <compound>+
  <compound> ::= ( ELEMENT | '(' <formula> ')' ) INT?
**/
ChemParser.prototype.parse = function(str) {
	this.init();
	this.lexer(str);
	
	var f = this.parseFormula();
	if (! this.end()) {
		var name = ChemParser.tokenString(this.peek());
		throw "Wasn't expecting this: " + name;
	}
	return f;
};

ChemParser.prototype.parseFormula = function() {
	var T = ChemParser.Tokens;
	var f = new Formula();
	f.isComp = true;
	while (true) {
		if (this.end()) { break; }
		var tok = this.peek();
		if (tok.t !== T.ELEM && tok.t !== T.PAREN1) {
			break; }
		f.add(this.parseCompound());
	}
	return f;
};

ChemParser.prototype.parseCompound = function() {
	var T = ChemParser.Tokens;
	var f = new Formula();
	var tok = this.peek();
	if (tok.t === T.ELEM) {
		var elem = this.pop().v;
		if (Elements[elem] === undefined) {
			throw "I don't know what '" + elem + "' is"; }
		f.element = elem;
	}
	else if (tok.t === T.PAREN1) {
		this.pop();
		f = this.parseFormula();
		this.readToken(T.PAREN2);
	}
	else {
		var name = ChemParser.tokenString(tok);
		throw "I wasn't expecting this: " + name;
	}

	if (!this.end() && this.peek().t === T.INT) {
		f.number = this.pop().v; }

	return f;
};
