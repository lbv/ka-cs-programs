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

	var blob = new ($global.get('Blob'))(
		[ code ], { type : 'application/javascript'});

	var a = $(linkHTML);
	var url = ($global.get('URL')).createObjectURL(blob);
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

App.onOpen = function() {
	var html = App.Templates.aOpen();
	App.downloadLink(html);
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
	$('#Download').click(App.onDownload);
	$('#Open').click(App.onOpen);

	$('#ImgId').on('keyup', App.onImgIdChanged);

	var fileReader = new $FileReader(
		fileReaderTpl[0], '#-image-select');
	fileReader.onLoad = App.onFileLoaded;

	if (! App.supportsDownload) {
		$('#DownloadDiv').hide(); }

	$('#IdError').hide();
	$('#FileReady').hide();
	$('#Main').hide();
};

App.init = function() {
	var baseURL = "http://localhost:3333/assets/";

	var mamConfig = {
		images: {
			bg: baseURL + 'img/bg.jpg'
		},
		onReady: function(media) {
			App.bg = media.images.bg;
		},
		draw: function() {
			image(App.bg, 0, 0);
		}
	};

	App.fileOK = false;
	App.idOK   = false;

	var testTag = $('<a></a>');
	App.supportsDownload = (
		testTag[0].download !== undefined);

	$global.addCSS('css-i2c', baseURL + 'css/default.css');

	$.when(
		$global.ajax('UI', baseURL + 'htm/ui.htm', 'html'),
		$global.ajax('FileReader', baseURL +
			'htm/file-reader.htm', 'html'),
		$global.loadMAM(mamConfig),
		$global.loadJQueryUI('redmond')).done(App.onLoad);
};

textAlign(CENTER, CENTER);
var draw = function() {
	background(255, 255, 255);
	text("loading", 200, 200);
};

App.init();
