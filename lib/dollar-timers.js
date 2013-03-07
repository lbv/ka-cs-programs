// Time in seconds from the last frame
$.timeStep = 0;

// Extra data to handle timers
$.timers = new Heap(function(a, b) { return a.t - b.t; });
$.timePrev = 0;

// Calls function "f" after "ms" milliseconds
$.addTimer = function(ms, f) {
	$.timers.push({ t: millis() + ms, cb : f });
};

// Function that should be hooked into the main program loop
$.loopStep = function() {
	var ms = millis();
	$.timeStep = (ms - $.timePrev) / 1000;
	$.timePrev = ms;
	while ($.timers.size() > 0 && $.timers.peek().t <= ms) {
		$.timers.pop().cb.call();
	}
};
