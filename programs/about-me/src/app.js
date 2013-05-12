var App = {};

App.buildUI = function() {
	$('body').css({
		fontSize : '11px'
	});

	$('#Frame').css({
		backgroundColor : '#eeeeed',
		opacity : '0.9',
		width   : '400px',
		height  : '400px'
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

App.onBackgroundReady = function(bg) {
	background(255, 255, 255);
	image(bg, 0, 0);
};

App.init = function() {
	loadBackground(App.onBackgroundReady);

	$G.insertHtml(htmlUI);
	$G.loadJQueryUI(App.buildUI);
};

App.init();
