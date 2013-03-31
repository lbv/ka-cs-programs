var ParserBase = $class(function() {
	this.tokens = [];
	this.cur    = 0;  // current token
});

ParserBase.prototype.lexer = function() {};

ParserBase.prototype.end = function() {
	return this.cur >= this.tokens.length;
};

ParserBase.prototype.peek = function() {
	return this.tokens[this.cur];
};

ParserBase.prototype.pop = function() {
	return this.tokens[this.cur++];
};

ParserBase.prototype.readToken = function(expectedType) {
	if (this.end()) { throw 'Reached end of input'; }
	var tok = this.pop();
	if (tok.t !== expectedType) {
		throw "Invalid token " + tok.t +
			" (" + expectedType + " expected)";
	}
	return tok;
};
