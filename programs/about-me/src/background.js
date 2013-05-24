var loadBackground = function(callback) {
	loadBackground.flag = true;
	var $ = (function() { return this.$; })();
	var img = $('#-img-Background');
	if (img.length === 0) {
		var dataUri = "data:image/png;base64,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";
		img = $('<img id="-img-Background" src="' + dataUri + '"/>');
	}
	if (! img.data('loaded')) {
		var dfd = new $.Deferred();
		img.on('load', function() {
			if (! loadBackground.flag) { return; }
			$('canvas').first().parent().append(img);
			img.data('loaded', true);
			var pimg = createImage(img.width(), img.height(), ARGB);
			pimg.sourceImg.getContext('2d').drawImage(img[0], 0, 0);
			dfd.resolve(pimg);
		});
		img.data('promise', dfd.promise());
	}
	img.data('promise').then(callback);
};