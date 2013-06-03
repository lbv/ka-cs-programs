$global.loadMAM = (function(pjs) { return function(config) {
	var promise = $global.get('_mam');
	if (! _.isObject(promise)) {
		var dfd = $.Deferred();
		(function() {
			promise = this._mam = dfd.promise();
		})();

		$global.ajax('MAM', URL_MAM, 'script').
		done(function() {
			var MAM = $global.get('MAM');
			var mam = new MAM(config, pjs);
			mam.run();
			mam.promise.done(function() {
				dfd.resolveWith(this, arguments);
			});
		});
	}

	return promise;
}; })(this);
