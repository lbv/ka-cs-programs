var $class = function() {
	var _super, init;
	if (arguments.length === 1) { init = arguments[0]; }
	else {
		_super = arguments[0]; init = arguments[1]; }

	var skip = false;
	var clss = function() {
		if (skip) { return; }
		this.init.apply(this, arguments);
	};
	if (_super !== undefined) {
		_super._setSkip();
		clss.prototype = new _super();
		_super._clrSkip();
		clss.prototype.constructor = clss;
		clss._super = _super.prototype;
	}
	clss.prototype.init = init;
	clss._setSkip = function() { skip = true; };
	clss._clrSkip = function() { skip = false; };
	return clss;
};
