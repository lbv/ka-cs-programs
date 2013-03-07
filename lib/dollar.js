/**
 * Global object, filled with general goodies to use in different programs
 */
var $ = {};

// Basic unit of length (approx 6 pixels in a 400x400 canvas)
$.ul = width / 64;

// Palette of colors, based on the Tango Icon Theme Guidelines
$.colors = {
	yellow : [ 0xfffce94f, 0xffedd400, 0xffc4a000 ],
	orange : [ 0xfffcaf3e, 0xfff57900, 0xffce5c00 ],
	brown  : [ 0xffe9b96e, 0xffc17d11, 0xff8f5902 ],
	green  : [ 0xff8ae234, 0xff73d216, 0xff4e9a06 ],
	blue   : [ 0xff729fcf, 0xff3465a4, 0xff204a87 ],
	purple : [ 0xffad7fa8, 0xff75507b, 0xff5c3566 ],
	red    : [ 0xffef2929, 0xffcc0000, 0xffa40000 ],
	gray1  : [ 0xffeeeeec, 0xffd3d7cf, 0xffbabdb6 ],
	gray2  : [ 0xff888a85, 0xff555753, 0xff2e3436 ],
	white  : 0xffffffff,
	black  : 0xff000000
};

// Time in seconds from the last frame
$.timeStep = 0;

// Extra data to handle timers
$.timers = [];
$.timePrev = 0;

// Calls function "f" after "ms" milliseconds
$.addTimer = function(ms, f) {
	var t = millis() + ms;
	var lo = 0;
	var hi = $.timers.length;
	while (lo < hi) {
		var mid = floor((lo + hi) / 2);
		if ($.timers[mid].t < t) { lo = mid + 1; }
		else { hi = mid; }
	}
	$.timers.splice(lo, 0, { t: t, cb : f });
};

// Function that should be hooked into the main program loop
$.loopStep = function() {
	var ms = millis();
	$.timeStep = (ms - $.timePrev) / 1000;
	$.timePrev = ms;
	while ($.timers.length > 0 && $.timers[0].t <= ms) {
		$.timers[0].cb();
		$.timers.shift();
	}
};
