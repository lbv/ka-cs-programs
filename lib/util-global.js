var $global = {
	get: function(p){return(function(){return this;}())[p];}
};

var $ = $global.get('$');
var _ = $global.get('_');

$global.cons = $global.get('console');

$global.log = function() {
	$global.cons.log.apply($global.cons, arguments);
};

$global.addCSS = function(id, url) {
	if ($('#' + id).length > 0) { return; }
	var tag = $('<link id="'+ id +'" rel="stylesheet" />');
	tag.attr({ type: 'text/css', href: url });
	$('head').append(tag);
};

$global.insertHTML = function(html) {
	if ($('#ka-container').length > 0) { return; }
	var container = $('<div id="ka-container" />');
	container.append($(html));
	$('canvas').first().parent().append(container);
};

$global.ajax = function(name, url, type) {
	var promises = $global.get('_promises');
	if (promises !== undefined && promises[name]) {
		return promises[name]; }

	var dfd = $.Deferred(), promise = dfd.promise();
	(function() {
		this._promises = this._promises || {};
		this.setTimeout(function() {
			if (! $global.ajax) { return; }
			this._promises[name] = promise;
			$.ajax({
				url: url,
				cache: !DEBUG,
				dataType: type
			}).done(function() {
				if (DEBUG) {
					$global.log('ajax result', this); }
				dfd.resolveWith(this, arguments);
			}).fail(function() {
				$global.log('ajax result', this);
				throw "Failed to load " + name +
					" at " + url;
			});
		}, 0);
	})();
	return promise;
};
