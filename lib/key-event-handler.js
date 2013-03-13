/**
 * KeyEventHandler
 *
 * A simple wrapper for creating keyboard "events", and
 * registering listeners that can respond to those events.
 */
var KeyEventHandler = function() {
	this.eventsPress     = [];
	this.eventsRelease   = [];
	this.listeners       = {};
	this.globalListeners = [];
};

KeyEventHandler.prototype.registerEvent = function(
	name, trigger, keyVal, func) {
	if (trigger === 'keyPress') {
		this.eventsPress.push([ name, keyVal, func ]); }
	else if (trigger === 'keyRelease') {
		this.eventsRelease.push([ name, keyVal, func ]); }
	else { throw 'Invalid trigger'; }
};

KeyEventHandler.prototype.addListener = function(
	event, func, obj) {
	if (! this.listeners.hasOwnProperty(event)) {
		this.listeners[event] = []; }
	this.listeners[event].push([ func, obj ]);
};

KeyEventHandler.prototype.addGlobalListener = function(
	func, obj) {
	this.globalListeners.push([ func, obj ]);
};

KeyEventHandler.prototype.process = function(evs, k, kc) {
	var k0 = kc, k1 = k << 16, k2 = k0|k1;
	for (var i = 0; i < evs.length; ++i) {
		var ev = evs[i];
		if (ev[1] !== k0 && ev[1] !== k1 && ev[1] !== k2) {
			continue; }
		if (typeof(ev[2]) === 'function' &&
		    ! ev[2].call(this)) { continue; }

		var listeners, lis, j;

		listeners = this.globalListeners;
		for (j = 0; j < listeners.length; ++j) {
			lis = listeners[j];
			lis[0].call(lis[1], ev[0]);
		}

		if (! this.listeners.hasOwnProperty(ev[0])) {
			continue; }

		listeners = this.listeners[ev[0]];
		for (j = 0; j < listeners.length; ++j) {
			lis = listeners[j];
			lis[0].call(lis[1]);
		}
	}
};

KeyEventHandler.prototype.onKeyPressed = function(k, kc) {
	this.process(this.eventsPress, k, kc);
};

KeyEventHandler.prototype.onKeyReleased = function(k, kc) {
	this.process(this.eventsRelease, k, kc);
};
