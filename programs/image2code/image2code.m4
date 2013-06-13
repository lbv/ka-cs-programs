/**

m4_undivert(`gen/top-summary.md')
**/

var DEBUG = false;

var URL_BASE = "http://localhost:3333/";

var URL_JQUI = URL_BASE + 'ext/jquery-ui/ui/jquery-ui.js';
var URL_JQUI_CSS = URL_BASE + 'ext/jquery-ui/themes/THEME/jquery-ui.css';
var URL_MAM = URL_BASE + 'ext/mam.js';


/*
var URL_JQUI = '//ajax.googleapis.com/ajax/libs/jqueryui/' +
	'1.10.3/jquery-ui.min.js';
var URL_JQUI_CSS = '//ajax.googleapis.com/ajax/libs/' +
	'jqueryui/1.10.3/themes/THEME/jquery-ui.css';
var URL_MAM = '//googledrive.com/host/0BzcEQMWUa0znRE1wQU'+
	'9KUGR2R2s/mam/mam-pre4-min.js';
*/

m4_undivert(`util-global.js')
m4_undivert(`lib-jqueryui.js')
m4_undivert(`lib-mam.js')

m4_undivert(`gen/imgcode-template.js')

m4_undivert(`src/app.js')
