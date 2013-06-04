$global.loadJQueryUI = function(theme) {
	theme = theme || 'smoothness';
	var cssURL = URL_JQUI_CSS.replace('THEME', theme);
	$global.addCSS('ka-jquery-ui', cssURL);
	return $global.ajax('jQueryUI', URL_JQUI, 'script');
};
