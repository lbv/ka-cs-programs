$global.loadJQueryUI = function(theme) {
	theme = theme || 'smoothness';
	var cssURL = URLS[ENV].JQUI_CSS.replace('THEME', theme);
	$global.addCSS('ka-jquery-ui', cssURL);
	return $global.ajax(
		'jQueryUI', URLS[ENV].JQUI, 'script');
};
