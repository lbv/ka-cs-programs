var App = {};

App.init = function() {
	App.ken = new Ken(kenAnimData);
	App.ki  = new KeysIndicator(8, 8, [
		[ $key.codes.UP,    "\u2191", 0, 1 ],
		[ $key.codes.DOWN,  "\u2193", 1, 1 ],
		[ $key.codes.RIGHT, "\u2192", 1, 2 ],
		[ $key.codes.LEFT,  "\u2190", 1, 0 ]
	]);
};


var draw = function() {
	background(0xff2e3436);
	App.ken.draw();
	App.ki.draw();
};

App.init();
