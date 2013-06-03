var Graphics = $class(function() {
	this.alpha = 0;
	this.state = '';
});

Graphics.prototype.make = function(width, height) {
	var gfx = createGraphics(width, height, P2D);
	gfx.imageMode(CENTER);
	return gfx;
};

Graphics.prototype.draw = function() {};
Graphics.prototype.animate = function() {
	this.dfd = $.Deferred();
};

var Portrait = $class(Graphics, function(frame, portia) {
	Portrait._super.init.call(this);

	var w = frame.width, h = frame.height;
	this.img = this.make(w, h);
	this.img.image(portia, w/2, h/2);
	this.img.image(frame, w/2, h/2);
});

Portrait.prototype.animate = function() {
	Portrait._super.animate.apply(this);
	this.state = 'fadeIn';
	this.alpha = 0;

	return this.dfd.promise();
};

Portrait.prototype.draw = function() {
	switch(this.state) {
	case 'fadeIn':
		tint(255, 255, 255, this.alpha);
		image(this.img, 200, 200);
		noTint();
		this.alpha += 10;
		if (this.alpha > 255) {
			this.state = 'display';
			this.timeout = millis() + 1500;
		}
		break;

	case 'display':
		image(this.img, 200, 200);
		if (this.timeout > 0 && millis() >= this.timeout) {
			this.timeout = 0;
			this.dfd.resolve();
		}
		break;
	}
};


var Casket = $class(Graphics, function(idx, closed, open) {
	Casket._super.init.call(this);

	var w = closed.width, h = closed.height;
	this.imgClosed = this.make(w, h);
	this.imgClosed.image(closed, w/2, h/2);
	this.imgOpen = this.make(w, h);
	this.imgOpen.image(open, w/2, h/2);

	this.x = ([ 84, 200, 316, 122, 276 ])[idx];
});

Casket.prototype.animate = function(state) {
	Casket._super.animate.call(this);
	this.state = state;
	if (state === 'fadeOut') { this.alpha = 255; }
	else if (state === 'fadeIn') { this.alpha = 0; }
	return this.dfd.promise();
};

Casket.prototype.draw = function() {
	switch(this.state) {
	case 'fadeIn':
		tint(255, 255, 255, this.alpha);
		image(this.imgOpen, this.x, 250);
		noTint();
		this.alpha += 10;
		if (this.alpha > 255) {
			this.state = 'open';
			this.dfd.resolve();
		}
		break;

	case 'fadeOut':
		tint(255, 255, 255, this.alpha);
		image(this.imgClosed, this.x, 250);
		noTint();
		this.alpha -= 10;
		if (this.alpha < 0) {
			this.state = 'none';
			this.dfd.resolve();
		}
		break;

	case 'open':
		image(this.imgOpen, this.x, 250);
		break;

	default:
		image(this.imgClosed, this.x, 250);
	}
};


var Dagger = $class(Graphics, function(dagger) {
	Dagger._super.init.call(this);

	var w = dagger.width, h = dagger.height;
	this.img = this.make(w, h);
	this.img.image(dagger, w/2, h/2);
});

Dagger.prototype.animate = function() {
	Dagger._super.animate.apply(this);
	this.state = 'fadeIn';
	this.alpha = 0;

	return this.dfd.promise();
};

Dagger.prototype.draw = function() {
	switch(this.state) {
	case 'fadeIn':
		tint(255, 255, 255, this.alpha);
		image(this.img, 200, 200);
		noTint();
		this.alpha += 10;
		if (this.alpha > 255) {
			this.state = 'display';
			this.timeout = millis() + 1500;
		}
		break;

	case 'display':
		image(this.img, 200, 200);
		if (this.timeout > 0 && millis() >= this.timeout) {
			this.timeout = 0;
			this.dfd.resolve();
		}
		break;
	}
};
