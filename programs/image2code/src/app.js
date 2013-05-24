var App = {};


App.Templates = {
	imgcode : _.template(imgCodeTemplate),
	aDownload : _.template(
		'<a download="<%= filename %>"></a>'),
	aOpen : _.template(
		'<a target="_blank"></a>')
};


App.checkForDownload = function() {
	if (App.fileOK && App.idOK) {
		$('#SpanId').html(_.escape(App.imgID));
		$('#FileReady').fadeIn();
	}
	else {
		$('#FileReady').fadeOut();
	}
};

App.downloadLink = function(linkHTML) {
	var code = App.Templates.imgcode({
		id   : App.imgID,
		data : App.fileBase64
	});

	var blob = new ($G.get('Blob'))(
		[ code ], { type : 'application/javascript'});

	var a = $(linkHTML);
	var url = ($G.get('URL')).createObjectURL(blob);
	a[0].href = url;
	$('body').append(a);
	a[0].click();
};

App.onContinue = function() {
	$('#Intro').hide();
	$('#Main').fadeIn();
};

App.onDownload = function() {
	var html = App.Templates.aDownload({
		filename : App.imgID + ".js"
	});
	App.downloadLink(html);
};

App.onFileChanged = function() {
	if (this.files.length === 0) {
		App.fileOK = false;
		return;
	}
	App.fileReader.readAsDataURL(this.files[0]);
};

App.onFileLoaded = function() {
	App.fileOK     = true;
	App.fileBase64 = this.result;

	App.checkForDownload();
};

App.onImgIdChanged = function() {
	if (this.value === '') {
		App.idOK = false;
		$('#IdError').fadeOut();
	}
	else if (/\W/.test(this.value)) {
		App.idOK = false;
		$('#IdError').fadeIn();
	}
	else {
		App.idOK = true;
		App.imgID = this.value;
		$('#IdError').fadeOut();
	}
	App.checkForDownload();
};

App.onOpen = function() {
	var html = App.Templates.aOpen();
	App.downloadLink(html);
};

App.buildUI = function() {
	$('body').css({
		fontSize  : '11px',
		textAlign : 'justify'
	});
	$('input').addClass('ui-widget ui-corner-all');

	$('#Frame').css({
		backgroundColor : '#ffffff',
		opacity : '0.9',
		margin  : '0',
		padding : '0',
		width   : '400px',
		height  : '400px'
	}).position({
		my : 'left top',
		at : 'left top',
		of : '#output'
	});

	$('#Intro').addClass('ui-widget ui-widget-content')
	.css({
		width     : '336px',
		height    : '336px',
		margin    : '12px 0 0 0',
		padding   : '32px',
		overflowY : 'auto'
	});

	$('#Continue').css({
		float : 'right'
	}).button().click(App.onContinue);

	$('#Main').addClass('ui-widget ui-widget-content')
	.css({
		width     : '336px',
		height    : '336px',
		margin    : '12px 0 0 0',
		padding   : '32px',
		overflowY : 'auto'
	});

	$('#SpanId').css({
		fontFamily : 'monospace',
		fontWeight : 'bold'
	});
	$('#Download').button().css({
		margin  : '4px auto',
		display : 'block'
	});
	$('#Open').button().css({
		margin  : '4px auto',
		display : 'block'
	});
	$('#IdError').css({
		padding   : '8px',
		marginTop : '12px'
	}).addClass(
		'ui-widget ui-state-error ui-corner-all');

	$('#ImgId').on('keyup', App.onImgIdChanged);
	$('#FileInput').on('change', App.onFileChanged);
	$('#Download').click(App.onDownload);
	$('#Open').click(App.onOpen);

	if (! App.supportsDownload) {
		$('#DownloadDiv').hide(); }

	$('#IdError').hide();
	$('#FileReady').hide();
	$('#Main').hide();
};

App.onBackgroundReady = function(bg) {
	background(255, 255, 255);
	image(bg, 0, 0);
};

App.init = function() {
	loadBackground(App.onBackgroundReady);

	App.fileOK = false;
	App.idOK   = false;

	var testTag = $('<a></a>');
	App.supportsDownload = (
		testTag[0].download !== undefined);

	App.fileReader = new ($G.get('FileReader'))();
	App.fileReader.onload = App.onFileLoaded;

	$G.insertHtml(htmlUI);
	$G.loadJQueryUI(App.buildUI, 'redmond');
};

App.init();