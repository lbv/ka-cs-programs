var keyEv = new KeyEventHandler();
var ken   = new Player(kenData, keyEv);
var ki    = new KeysIndicator(8, 8, 0xff729fcf, 0xffffffff,
[
	[ UP,    " \u2191", 0, 1 ],
	[ DOWN,  " \u2193", 1, 1 ],
	[ RIGHT, "\u2192",  1, 2 ],
	[ LEFT,  "\u2190",  1, 0 ]
]);

var draw = function() {
	background(0xff2e3436);
	ken.draw();
	ki.draw();
};

var keyPressed = function() {
	keyEv.onKeyPressed(key, keyCode);
	ki.onKeyPressed(key, keyCode);
};

var keyReleased = function() {
	keyEv.onKeyReleased(key, keyCode);
	ki.onKeyReleased(key, keyCode);
};
