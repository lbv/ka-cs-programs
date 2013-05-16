var $key = {
	codes : {},
	keys  : {},
	listenersUp   : {},
	listenersDown : {},
	pressed : {},
	serial : 0
};

$key.addListener = function(hash, cb, ctx) {
	var id = 'listener' + (++$key.serial);
	hash[id] = { cb: cb, ctx: ctx };
	return id;
};

$key.addListenerDown = function(cb, ctx) {
	return $key.addListener($key.listenersDown, cb, ctx);
};

$key.addListenerUp = function(cb, ctx) {
	return $key.addListener($key.listenersUp, cb, ctx);
};

$key.handleListeners = function(listenerObj) {
	var id;
	for (id in listenerObj) {
		var listener = listenerObj[id];
		listener.cb.call(listener.ctx, keyCode);
	}
};

$key.registerKey = function(code, name) {
	var id = name.toUpperCase();
	$key.keys[code] = { name:name, id:id };
	$key.codes[id]  = code;
};

$key.registerKeys = function() {
	var i, I;
	for (i = 65; i <= 90; ++i) {  // letters
		$key.registerKey(i, parseChar(i).toString()); }
	for (i = 48; i <= 57; ++i) {  // digits
		$key.registerKey(i, parseChar(i).toString()); }
	for (i = 112; i <= 121; ++i) {  // F-keys
		$key.registerKey(i, "F" + (i-111)); }
	var keys = [
		[ 16, 'Shift' ],    [ 17, 'Control' ],
		[ 18, 'Alt' ],      [ 20, 'CapsLock' ],
		[ 32, 'Space' ],    [ 33, 'PageUp' ],
		[ 34, 'PageDown' ], [ 37, 'Left' ],
		[ 38, 'Up' ],       [ 39, 'Right' ],
		[ 40, 'Down' ]
	];
	for (i = 0, I = keys.length; i < I; ++i) {
		$key.registerKey(keys[i][0], keys[i][1]); }
};

var keyPressed = function() {
	$key.pressed[keyCode] = true;
	$key.handleListeners($key.listenersDown);
};
var keyReleased = function() {
	$key.pressed[keyCode] = false;
	$key.handleListeners($key.listenersUp);
};
$key.registerKeys();
