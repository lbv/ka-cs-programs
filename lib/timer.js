/**
 * Timer
 *
 * Helps you schedule tasks that will be called at a certain
 * point in time in the future.
 *
 * Methods:
 *
 *   add(milliseconds, function, object)
 *     Adds a timer, meaning that it will call "function"
 *     after "milliseconds" have passed, using the optional
 *     "object" as the context.
 *
 *   step()
 *     Checks if there are any timers pending and runs them
 *     if necessary. This should normally be calles from
 *     the main "draw" function.
 */
var Timer = function() {
	var cmp = function(a, b) { return a.t - b.t; };
	this.timers = new Heap(cmp);
};

Timer.prototype.add = function(ms, f, obj) {
	var timer = {
		t  : millis() + ms,
		cb : f,
		o  : obj
	};
	this.timers.push(timer);
};

Timer.prototype.step = function() {
	var ms = millis();
	while (! this.timers.isEmpty() &&
	       this.timers.peek().t <= ms) {
		var timer = this.timers.pop();
		timer.cb.call(timer.o);
	}
};
