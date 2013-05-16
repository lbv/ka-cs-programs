var Ken = function(imgData) {
	this.frames = new GIFReader(
		new Base64Reader(imgData)).getImages();

	var checkMovements = function() {
		var up = 1, dn = 2, lt = 4, rt = 8;
		var pressed = 0;
		if ($key.pressed[$key.codes.UP]) {
			pressed |= up; }
		if ($key.pressed[$key.codes.DOWN]) {
			pressed |= dn; }
		if ($key.pressed[$key.codes.LEFT]) {
			pressed |= lt; }
		if ($key.pressed[$key.codes.RIGHT]) {
			pressed |= rt; }

		if ((pressed & lt) && (pressed & rt)) {
			pressed &= ~(lt | rt); }
		if ((pressed & up) && (pressed & dn)) {
			pressed &= ~(up | dn); }

		if (pressed === up) { return 'jumpU1'; }
		if (pressed === rt) { return 'walkingR'; }
		if (pressed === lt) { return 'walkingL'; }
		if (pressed === dn) { return 'crouch1'; }
		return 'standing';
	};

	this.states = {
		standing : {
			frames : this.frames.slice(0, 4),
			next : 'standing',
			dx : 0,
			dy : 0,
			onKeyEvent : checkMovements,
			onStart    : checkMovements
		},

		walkingR : {
			frames   : this.frames.slice(4, 9),
			next     : 'walkingR',
			dx       : 4,
			dy       : 0,
			onKeyEvent : checkMovements,
			onStart    : checkMovements
		},

		walkingL : {
			frames : this.frames.slice(4, 9).reverse(),
			next : 'walkingL',
			dx : -3,
			dy : 0,
			onKeyEvent : checkMovements,
			onStart    : checkMovements
		},
		
		jumpU1 : {
			frames : this.frames.slice(8, 12),
			next : 'jumpU2',
			dx : 0,
			dy : -5
		},
		
		jumpU2 : {
			frames : this.frames.slice(8, 12).reverse(),
			next : 'standing',
			dx : 0,
			dy : 5
		},
		
		crouch1: {
			frames : [ this.frames[8], this.frames[12] ],
			next : 'crouch2',
			dx : 0,
			dy : 0
		},
		
		crouch2: {
			frames : this.frames.slice(12, 13),
			next : 'crouch2',
			dx : 0,
			dy : 0,
			onKeyEvent : function() {
				if (! $key.pressed[$key.codes.DOWN]) {
					return 'crouch3'; }
				return 'crouch2';
			}
		},
		
		crouch3: {
			frames : [ this.frames[12], this.frames[8] ],
			next : 'standing',
			dx : 0,
			dy : 0
		}
	};

	this.x = 160;
	this.y = 140;

	this.nextUpdate = millis();
	moveHandler.register(Ken.moves, this.onMove, this);
	$key.addListenerDown(this.onKeyEvent, this);
	$key.addListenerUp(this.onKeyEvent, this);

	this.setState('standing');
};


Ken.speed = 90;
Ken.minX  = 0;
Ken.maxX  = 320;
Ken.minY  = 0;
Ken.maxY  = 155;

Ken.moves = {
	fireball : [
		$key.codes.DOWN,
		$key.codes.RIGHT,
		$key.codes.A
	]
};


Ken.prototype.onKeyEvent = function() {
	$G.log('key event', typeof this.state.onKeyEvent);

	if (typeof this.state.onKeyEvent !== 'function') {
		return; }
	var curr = this.stateName;
	var next = this.state.onKeyEvent();
	if (curr !== next) {
		this.setState(next); }
};

Ken.prototype.onMove = function(move) {
	$G.log("Moved: " + move);
};

Ken.prototype.setState = function(stateName) {
	this.state = this.states[stateName];
	if (typeof this.state.onStart === 'function') {
		stateName = this.state.onStart();
		this.state = this.states[stateName];
	}
	this.frame = 0;
	this.stateName = stateName;
};

Ken.prototype.draw = function() {
	var st = this.state;
	var anim = st.frames;

	pushMatrix();
	translate(this.x, this.y);
	image(anim[this.frame], 0, 0);
	popMatrix();

	this.x = constrain(this.x + st.dx, Ken.minX, Ken.maxX);
	this.y = constrain(this.y + st.dy, Ken.minY, Ken.maxY);

	var ms = millis();
	if (ms >= this.nextUpdate) {
		this.nextUpdate = ms + Ken.speed;
		if (++this.frame >= anim.length) {
			this.setState(st.next); }
	}
};
