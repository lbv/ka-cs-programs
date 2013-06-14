var $FileReader = function(tpl, selector) {
	if ($FileReader.supportFileReader === undefined) {
		$FileReader.supportFileReader = !!
			$global.get('FileReader');
	}

	this.container = $(selector);
	this.container.html(tpl);

	this.container.find('input').addClass(
		'ui-widget ui-corner-all');
	this.container.find('input:submit').hide();

	this.choose = this.container.find('.choose');

	this.choose.css({ padding: '8px', width: '100%' });
	this.choose.find('.filename').
		css({ fontWeight: 'bold' });

	this.loadDiv  = this.choose.find('.file-load').hide();
	this.okDiv    = this.choose.find('.file-ok').hide();
	this.errorDiv = this.choose.find('.file-error').hide();

	var self = this;
	this.choose.find('button').button().click(function() {
		self.onChoose(); });

	this.dialog = this.container.find('.dialog');
	
	this.dialog.find('.method').buttonset();
	var method = this.dialog.find('input[name="method"]');
	method.on('change', function() {
		self.onMethodChange(); });
	
	this.dlgLocal  = this.dialog.find('.local').hide();	
	this.dlgRemote = this.dialog.find('.remote').hide();

	if (! $FileReader.supportFileReader) {
		this.dialog.find('.method input').val(['remote']).
			button('refresh');
		this.dialog.find('.ui-widget-header').hide();
		this.dlgRemote = this.dialog.find('.remote').show();
	}

	this.dialog.dialog({
		modal: true,
		buttons: [ {
			text: 'OK',
			click: function() { self.onDialogOK(); }
		}, {
			text: 'Cancel',
			click: function() { $(this).dialog('close'); }
		} ]
	}).dialog('close');

	if ($FileReader.supportFileReader) {
		this.fileReader = new ($global.get('FileReader'))();
		this.fileReader.onload = _.bind(
			this.onFileReaderLoad, this);
	}
};

$FileReader.prototype.onChoose = function() {
	this.dialog.dialog('open');
	if ($FileReader.supportFileReader) {
		this.dialog.find('.method input').val(['local']).
			button('refresh');
		this.onMethodChange();
	}
};

$FileReader.prototype.onDialogOK = function() {
	var method = this.dialog.
		find('.method input:checked').val();
	var form = this.dialog.find('.' + method + ' form');
	if (_.isFunction(form[0].checkValidity) &&
	    ! form[0].checkValidity()) {
		var submit = form.find(':submit').click();
		return;	
	}

	var self = this;
	this.dfd = $.Deferred();
	this.dfd.fail(function(msg) {
		self.choose.removeClass('ui-state-highlight');
		self.choose.addClass('ui-state-error');
		self.errorDiv.find('.error-msg').html(msg);
		self.choose.find('.choose-msg').hide();
		self.errorDiv.fadeIn();
	});
	this.dfd.done(function(data) {
		self.data = data;
		self.choose.removeClass(
			'ui-state-error ui-state-highlight');
		self.choose.find('.choose-msg').hide();
		self.okDiv.fadeIn();
		if (_.isFunction(self.onLoad)) {
			self.onLoad(self.data); }
	});

	var startRead;
	if (method === 'local') {
		this.filename = this.dlgLocal.find('input').
			first().val().replace(/.*[\\\/]/, '');
		startRead = _.bind(this.startReadLocal, this);
	}
	else {
		this.filename = this.dlgRemote.find('input').
			first().val();
		startRead = _.bind(this.startReadRemote, this);
	}
	_.delay(startRead, 0);
	this.choose.find('.filename').html(this.filename);
	this.dialog.dialog('close');
	this.choose.find('.choose-msg').hide();
	this.choose.removeClass('ui-state-error');
	this.choose.addClass('ui-state-highlight');
	this.loadDiv.fadeIn();
};

$FileReader.prototype.onFileReaderLoad = function() {
	this.dfd.resolve(this.fileReader.result);
};

$FileReader.prototype.onMethodChange = function() {
	this.dlgLocal.hide();
	this.dlgRemote.hide();
	var method = this.dialog.find(
		'input[name="method"]:checked');
	switch (method.val()) {
	case 'local':  this.dlgLocal.show(); break;
	case 'remote': this.dlgRemote.show(); break;
	}
};

$FileReader.prototype.
readArrayBuffer = function(buf, mime) {
	var view = new ($global.get('Uint8Array'))(buf);
	if ($FileReader.supportFileReader) {
		var Blob = $global.get('Blob');
		var blob = new Blob([ view ], { type: 'mime' });
		this.fileReader.readAsDataURL(blob);
		return;
	}

	var String = $global.get('String');
	var btoa   = $global.get('btoa');
	var str = '';
	var code, i, n = buf.length;
	for (i = 0; i < n; ++i) {
		code = buf[i];
		str += String.fromCharCode(code);
	}
	var dataURI = "data:" + mime + ";base64," + btoa(str);
	this.dfd.resolve(dataURI);
};

$FileReader.prototype.startReadLocal = function() {
	var fileInput = this.dlgLocal.find('input')[0];
	if (fileInput.files.length === 0) {
		this.dfd.reject('No file selected.');
		return;
	}
	this.fileReader.readAsDataURL(fileInput.files[0]);
};

$FileReader.prototype.startReadRemote = function() {
	var url = this.dlgRemote.find('input').val();
	var self = this;

	var xhr = new ($global.get('XMLHttpRequest'))();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function() {
		if (this.status !== 200) {
			self.dfd.reject('Received a status code: ' +
				this.status + '.');
			return;
		}
		var mime = this.getResponseHeader('Content-Type');
		self.readArrayBuffer(this.response, mime);
	};
	xhr.onerror = function() {
		self.dfd.reject('Unable to obtain file via GET.');
	};
	xhr.send();
};
