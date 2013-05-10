var App = {};

App.init = function() {
	App.keyEv = new KeyEventHandler();
	App.ken   = new Player(kenAnimData, App.keyEv);
	App.ki    = new KeysIndicator(8, 8, [
		[ UP,    "\u2191", 0, 1 ],
		[ DOWN,  "\u2193", 1, 1 ],
		[ RIGHT, "\u2192", 1, 2 ],
		[ LEFT,  "\u2190", 1, 0 ]
	]);
};


var draw = function() {
	background(0xff2e3436);
	App.ken.draw();
	App.ki.draw();
};

var keyPressed = function() {
	App.keyEv.onKeyPressed(key, keyCode);
	App.ki.onKeyPressed(key, keyCode);
};

var keyReleased = function() {
	App.keyEv.onKeyReleased(key, keyCode);
	App.ki.onKeyReleased(key, keyCode);
};

App.init();
