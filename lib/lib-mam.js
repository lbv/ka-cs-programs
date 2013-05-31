$global.loadMAM = (function(pjs) { return function(config) {
	var promise = $global.get('_mam');
	if (! promise) {
		var dfd = $.Deferred();
		(function() {
			promise = this._mam = dfd.promise();
		})();

		$global.ajax('MAM', URL_MAM, 'script').
		done(function() {
			var MAM = $global.get('MAM');
			dfd.resolve(new MAM(config, pjs));
		});
	}

	promise.done(function(mam) {
		mam.run();
	});
	return promise;
}; })(this);
