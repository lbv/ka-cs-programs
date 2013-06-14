var App = {};

App.Templates = {
	imgcode : _.template(imgCodeTemplate)
};


App.checkForDownload = function() {
	if (! App.fileOK || !App.idOK) {
		$('#FileReady').fadeOut();
		return;
	}

	$('#SpanId').html(_.escape(App.imgID));
	$('#FileReady').fadeIn();

	var code = App.Templates.imgcode({
		id   : App.imgID,
		data : App.fileBase64
	});
	if (_.isObject(App.downloader)) {
		App.downloader.destroy(); }
	App.downloader = new $FileDownload(
		code, 'application/javascript');
};

App.onContinue = function() {
	$('#Intro').fadeOut().promise().then(function() {
		$('#Main').fadeIn();
	});
};

App.onFileLoaded = function(data) {
	App.fileOK     = true;
	App.fileBase64 = data;

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

App.onLoad = function(html, fileReaderTpl) {
	$global.insertHTML(html[0]);

	App.entered = false;
	$('#Frame').position({
		my : 'left top',
		at : 'left top',
		of : '#output',
		collision: 'none'
	}).on('mouseenter', function() {
		if (App.entered) { return; }
		$(this).animate({ opacity: 0.9 });
		App.entered = true;
	});

	$('input').addClass('ui-widget ui-corner-all');

	$('#Intro').addClass('ui-widget ui-widget-content');
	$('#Main').addClass('ui-widget ui-widget-content');

	$('#IdError').addClass(
		'ui-widget ui-state-error ui-corner-all');

	$('.button').button();
	$('#Continue').click(App.onContinue);

	$('#Download').click(function() {
		App.downloader.download(App.imgID + '.js');
	});
	$('#Open').click(function() {
		App.downloader.open();
	});

	$('#ImgId').on('keyup', App.onImgIdChanged);

	var fileReader = new $FileReader(
		fileReaderTpl[0], '#-image-select');
	fileReader.onLoad = App.onFileLoaded;

	if (! $File.support.Download) {
		$('#DownloadDiv').hide(); }

	$('.filereader-notice').dialog({
		buttons: [ {
			text: 'Continue',
			click: function() { $(this).dialog('close'); }
		} ]
	}).dialog('close');

	$('#IdError').hide();
	$('#FileReady').hide();
	$('#Main').hide();

	if (! $File.support.FileReader) {
		$('.filereader-notice').dialog('open'); }
};

App.init = function() {
	var baseURL = URLS[ENV].APP_BASE;

	var mamConfig = {
		images: { bg: baseURL + 'img/bg.jpg' },
		onReady: function(media) {
			App.bg = media.images.bg;
		},
		draw: function() { image(App.bg, 0, 0); }
	};

	App.fileOK = false;
	App.idOK   = false;

	$global.addCSS('css-i2c', baseURL + 'css/default.css');

	$.when(
		$global.ajax('UI', baseURL + 'htm/ui.htm', 'html'),
		$global.ajax('FileReader', baseURL +
			'htm/file-reader.htm', 'html'),
		$global.loadMAM(mamConfig),
		$global.loadJQueryUI('redmond')).done(App.onLoad);
};

textAlign(CENTER, CENTER);
fill(52, 101, 164);
var draw = function() {
	background(255, 255, 255);
	text("loading", 200, 200);
};

App.init();
