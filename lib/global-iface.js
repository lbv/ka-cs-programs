var GlobalIface = function() {
	this.cons = this.get('console');
	this.$    = this.get('$');
};

GlobalIface.Urls = {
	jqUIcss :
		'//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/' +
		'themes/THEME/jquery-ui.css',
	jqUIjs :
		'//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/' +
		'jquery-ui.min.js'
};

GlobalIface.prototype.get = function(p) {
	return ((function() { return this; })())[p];
};

GlobalIface.prototype.log = function() {
	this.cons.log.apply(this.cons, arguments);
};

GlobalIface.prototype.insertHtml = function(html) {
	if (this.$('#KAContainer').length > 0) { return; }
	var container = this.$('<div id="KAContainer" />');
	container.append(this.$(html));
	this.$('canvas').first().parent().append(container);
};

GlobalIface.prototype.loadJQueryUI = function(cb, theme) {
	if (theme === undefined) { theme = 'smoothness'; }
	var cssLink = this.$('<link rel="stylesheet" />')
		.attr({
			type: 'text/css',
			href: GlobalIface.Urls.jqUIcss.
				replace('THEME', theme)
		});
	this.$('head').append(cssLink);
	var url = GlobalIface.Urls.jqUIjs;
	this.$.getScript(url).done(cb).fail(function() {
		throw 'failed to load JQuery UI';
	});
};

var $G = new GlobalIface();
var $  = $G.$;
