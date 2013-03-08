/**
 * A small on-screen representation of a group of keys being pressed
 */
var KeysIndicator = function(x, y, keys) {
	this.x = x;
	this.y = y;
	this.k = {};

	for (var i = 0; i < keys.length; ++i) {
		var key = keys[i];
		this.k[key[0]] = {
			str : key[1],
			row : key[2],
			col : key[3],
			on  : false
		};
	}
};

KeysIndicator.size   = $.ul * 3;
KeysIndicator.radius = $.ul * 0.5;
KeysIndicator.font   = createFont("sans-serif", 18);

KeysIndicator.prototype.drawKey = function(key) {
	stroke($.colors.blue[2]);
	strokeWeight(1.5);
	if (key.on) { fill($.colors.blue[2] & 0xccffffff); }
	else        { noFill(); }
	rect(0, 0, KeysIndicator.size, KeysIndicator.size, KeysIndicator.radius);
	if (key.on) { fill($.colors.white); }
	else        { fill($.colors.blue[2]); }
	textFont(KeysIndicator.font, 18);
	text(key.str, 0, 16);
};

KeysIndicator.prototype.draw = function() {
	for (var kc in this.k) {
		var key = this.k[kc];
		pushMatrix();
		translate(this.x + key.col * KeysIndicator.size,
		          this.y + key.row * KeysIndicator.size);
		this.drawKey(key);
		popMatrix();
	}
};

KeysIndicator.prototype.onKeyPressed = function(k, kc) {
	if (this.k.hasOwnProperty(kc)) { this.k[kc].on = true; }
};

KeysIndicator.prototype.onKeyReleased = function(k, kc) {
	if (this.k.hasOwnProperty(kc)) { this.k[kc].on = false; }
};
