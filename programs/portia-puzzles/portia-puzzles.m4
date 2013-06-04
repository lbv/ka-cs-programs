/**

m4_undivert(`gen/top-summary.md')
**/

var DEBUG = false;

var URL_JQUI = 'http://localhost:3333/ext/jquery-ui/ui/jquery-ui.js';
var URL_JQUI_CSS = 'http://localhost:3333/ext/jquery-ui/themes/THEME/jquery-ui.css';

var URL_MAM = 'http://localhost:3333/ext/mam.js';

/*
var URL_JQUI = '//ajax.googleapis.com/ajax/libs/jqueryui/' +
	'1.10.3/jquery-ui.min.js';
var URL_JQUI_CSS = '//ajax.googleapis.com/ajax/libs/' +
	'jqueryui/1.10.3/themes/THEME/jquery-ui.css';
var URL_MAM = '//googledrive.com/host/0BzcEQMWUa0znRE1wQU'+
	'9KUGR2R2s/mam/mam-pre3-min.js';
*/

m4_undivert(`util-class.js')
m4_undivert(`util-global.js')
m4_undivert(`lib-jqueryui.js')
m4_undivert(`lib-mam.js')

m4_undivert(`src/graphics.js')
m4_undivert(`src/app.js')
m4_undivert(`src/states-warmup.js')
m4_undivert(`src/states-menus.js')
m4_undivert(`src/states-stories.js')
m4_undivert(`src/states-rooms.js')
m4_undivert(`src/states-extras.js')
