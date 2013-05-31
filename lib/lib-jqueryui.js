$global.loadJQueryUI = function(theme) {
	theme = theme || 'smoothness';
	var cssURL = URL_JQUI_CSS.replace('THEME', theme);
	$global.addCSS('ka-jquery-ui', cssURL);

	var tag = $('#ka-jquery-ui');
	if (_.isObject(tag.data('promise'))) {
		return tag.data('promise'); }

	var promise = $global.ajax(
		'jQueryUI', URL_JQUI, 'script');
	tag.data('promise', promise);
	return promise;
};
