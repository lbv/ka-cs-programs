var Formula = function() {
	this.isComp  = false;
	this.element = null;
	this.number  = 1;

	this.children = [];
	this.parent   = null;
};

Formula.prototype.add = function(form) {
	this.children.push(form);
	form.parent = this;
};

Formula.prototype.toString = function() {
	var str = '';
	if (! this.isComp) {
		str = this.element;
	}
	else {
		var paren = this.parent !== null &&
			this.children.length > 1;
		if (paren) { str += '('; }
		for (var i = 0; i < this.children.length; ++i) {
			str += this.children[i].toString(); }
		if (paren) { str += ')'; }
	}

	if (this.number !== 1) {
		str += "" + this.number; }
	return str;
};

Formula.prototype.toHtml = function() {
	var str = '';
	if (! this.isComp) {
		str = this.element;
	}
	else {
		var paren = this.parent !== null &&
			this.children.length > 1;
		if (paren) { str += '('; }
		for (var i = 0; i < this.children.length; ++i) {
			str += this.children[i].toHtml(); }
		if (paren) { str += ')'; }
	}

	if (this.number !== 1) {
		str += "<sub>" + this.number + "</sub>"; }
	return str;
};

Formula.prototype.getComposition = function() {
	
};

