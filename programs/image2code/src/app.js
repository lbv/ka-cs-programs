var App = {};

App.Templates = {
	imgcode : _.template(imgCodeTemplate),
	aDownload : _.template(
		'<a download="<%= filename %>"></a>')
};

App.onContinue = function() {
	$('#Intro').hide();
	$('#Main').fadeIn();
};

App.onDownload = function() {
	var code = App.Templates.imgcode({
		id   : App.imgID,
		data : App.fileBase64
	});

	var blob = new ($G.get('Blob'))(
		[ code ], { type : 'application/javascript'});

	var aHtml = App.Templates.aDownload({
		filename : App.imgID + ".js"
	});
	var a = $(aHtml);
	var url = ($G.get('URL')).createObjectURL(blob);
	$G.log('url is', url);
	a[0].href = url;
	$('body').append(a);
	a[0].click();
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

App.checkForDownload = function() {
	if (App.fileOK && App.idOK) {
		$('#SpanId').html(_.escape(App.imgID));
		$('#DownloadDiv').fadeIn();
	}
	else {
		$('#DownloadDiv').fadeOut();
	}
};

App.buildUI = function() {
	$('body').css({	fontSize : '11px' });
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

	$('#Download').button().css({
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

	$('#IdError').hide();
	$('#DownloadDiv').hide();
	$('#Main').hide();
};

App.init = function() {
	App.bg = getBackground();
	frameRate(1);

	App.fileOK = false;
	App.idOK   = false;

	App.fileReader = new ($G.get('FileReader'))();
	App.fileReader.onload = App.onFileLoaded;

	$G.insertHtml(htmlUI);
	$G.loadJQueryUI(App.buildUI);
};

App.init();

draw = function() {
	if (App.bg) {
		background(255, 255, 255);
		image(App.bg, 0, 0);
	}
};
