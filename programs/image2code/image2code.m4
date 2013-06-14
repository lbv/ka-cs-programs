/**

m4_undivert(`gen/top-summary.md')
**/

var DEBUG = false;
var ENV   = 'prod';

var URLS = {
	dev: {
		APP_BASE: '//localhost:3333/assets/',
		JQUI: '//localhost:3333/ext/jquery-ui/ui/' +
			'jquery-ui.js',
		JQUI_CSS: '//localhost:3333/ext/jquery-ui/' +
			'themes/THEME/jquery-ui.css',
		MAM: '//localhost:3333/ext/mam.js'
	},
	prod: {
		APP_BASE: '//dl.dropboxusercontent.com/u/17178990' +
			'/assets/image2code/',
		JQUI: '//ajax.googleapis.com/ajax/libs/jqueryui/' +
			'1.10.3/jquery-ui.min.js',
		JQUI_CSS: '//ajax.googleapis.com/ajax/libs/' +
			'jqueryui/1.10.3/themes/THEME/jquery-ui.css',
		MAM: '//googledrive.com/host/0BzcEQMWUa0znRE1wQU' +
			'9KUGR2R2s/mam/mam-pre4-min.js'
	}
};


m4_undivert(`util-global.js')
m4_undivert(`lib-jqueryui.js')
m4_undivert(`lib-mam.js')
m4_undivert(`util-files.js')

m4_undivert(`gen/imgcode-template.js')

m4_undivert(`src/app.js')
