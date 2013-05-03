var App = {};

App.buildUI = function() {
	$('body').css({
		fontSize : '11px'
	});

	$('#Frame').css({
		'width'  : '400px',
		'height' : '400px'
	}).position({
		my : 'left top',
		at : 'left top',
		of : '#output'
	});

	$('#Accordion').accordion({ heightStyle: "fill" })
	.position({
		my : 'left top',
		at : 'left top+12',
		of : '#Frame'
	});
};

App.init = function() {
	$G.insertHtml(htmlUI);
	$G.loadJQueryUI(App.buildUI);
};

App.init();
