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

App.onLoad = function(html) {
	$global.insertHTML(html[0]);

	

	$('#Frame').position({
		my : 'left top',
		at : 'left top',
		of : '#output',
		collision: 'none'
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
	$('#FileInput').on('change', App.onFileChanged);

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

	App.fileReader = new ($global.get('FileReader'))();
	App.fileReader.onload = App.onFileLoaded;

	$global.addCSS('css-i2c', baseURL + 'css/default.css');

	$.when(
		$global.ajax('UI', baseURL + 'htm/ui.htm', 'html'),
		$global.loadMAM(mamConfig),
		$global.loadJQueryUI('redmond')).done(App.onLoad);
};

textAlign(CENTER, CENTER);
var draw = function() {
	background(255, 255, 255);
	text("loading", 200, 200);
};

App.init();
