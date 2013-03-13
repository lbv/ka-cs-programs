/**
 * Player
 *
 * Encapsulates most of the logic for controlling a "player"
 */
var Player = function(imgData, keyHandler) {
	this.frames = new GIFReader(
		new Base64Reader(imgData)).getImages();
		
	this.keyHandler = keyHandler;

	this.states = {
		standing : {
			frames   : this.frames.slice(0, 4),
			next     : 'standing',
			dx       : 0,
			dy       : 0,
			triggers : {
				'pressLeft'  : 'walkingL',
				'pressRight' : 'walkingR',
				'pressUp'    : 'jumpU1',
				'pressDown'  : 'crouch1'
			}
		},

		walkingR : {
			frames   : this.frames.slice(4, 9),
			next     : 'walkingR',
			dx       : 4,
			dy       : 0,
			triggers : {
				'releaseRight' : 'standing',
				'pressLeft'    : 'standing',
				'pressDown'    : 'crouch1'
			}
		},

		walkingL : {
			frames   : this.frames.slice(4, 9).reverse(),
			next     : 'walkingL',
			dx       : -3,
			dy       : 0,
			triggers : {
				'releaseLeft' : 'standing',
				'pressRight'  : 'standing',
				'pressDown'   : 'crouch1'
			}
		},
		
		jumpU1 : {
			frames   : this.frames.slice(8, 12),
			next     : 'jumpU2',
			dx       : 0,
			dy       : -5,
			triggers : {}
		},
		
		jumpU2 : {
			frames   : this.frames.slice(8, 12).reverse(),
			next     : 'standing',
			dx       : 0,
			dy       : 5,
			triggers : {}
		},
		
		crouch1: {
			frames   : [ this.frames[8], this.frames[12] ],
			next     : 'crouch2',
			dx       : 0,
			dy       : 0,
			triggers : {}
		},
		
		crouch2: {
			frames   : this.frames.slice(12, 13),
			next     : 'crouch2',
			dx       : 0,
			dy       : 0,
			triggers : {
				'releaseDown' : 'crouch3'
			}
		},
		
		crouch3: {
			frames   : [ this.frames[12], this.frames[8] ],
			next     : 'standing',
			dx       : 0,
			dy       : 0,
			triggers : {}
		}
	};

	this.state = 'standing';
	this.frame = 0;

	this.x = 160;
	this.y = 140;

	this.nextUpdate = millis();
	
	this.registerKeyEvents();
};

Player.speed = 90;
Player.minX  = 0;
Player.maxX  = 320;
Player.minY  = 0;
Player.maxY  = 155;

Player.prototype.registerKeyEvents = function() {
	this.keyHandler.registerEvent(
		'pressDown', 'keyPress', DOWN);
	this.keyHandler.registerEvent(
		'pressLeft', 'keyPress', LEFT);
	this.keyHandler.registerEvent(
		'pressRight', 'keyPress', RIGHT);
	this.keyHandler.registerEvent(
		'pressUp', 'keyPress', UP);
	
	this.keyHandler.registerEvent(
		'releaseUp', 'keyRelease', UP);
	this.keyHandler.registerEvent(
		'releaseDown', 'keyRelease', DOWN);
	this.keyHandler.registerEvent(
		'releaseLeft', 'keyRelease', LEFT);
	this.keyHandler.registerEvent(
		'releaseRight', 'keyRelease', RIGHT);

	this.keyHandler.addGlobalListener(
		this.onKeyEvent, this);
};

Player.prototype.onKeyEvent = function(event) {
	var st = this.states[this.state];
	if (st.triggers.hasOwnProperty(event)) {
		this.changeState(st.triggers[event]); }
};

Player.prototype.changeState = function(state) {
	this.state = state;
	this.frame = 0;
};

Player.prototype.draw = function() {
	var st = this.states[this.state];
	var anim = st.frames;

	pushMatrix();
	translate(this.x, this.y);
	image(anim[this.frame], 0, 0);
	popMatrix();

	this.x = constrain(this.x + st.dx, Player.minX,
	                   Player.maxX);
	this.y = constrain(this.y + st.dy, Player.minY,
	                   Player.maxY);

	var ms = millis();
	if (ms >= this.nextUpdate) {
		this.nextUpdate = ms + Player.speed;
		if (++this.frame >= anim.length) {
			this.state = st.next;
			this.frame = 0;
		}
	}
};
