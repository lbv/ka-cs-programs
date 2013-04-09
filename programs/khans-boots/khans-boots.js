/**
 * Khan's Boots
 * ============
 * A simple game based on the classic "Rocky's Boots", created for the Khan
 * Academy Computer Science platform.
 *
 * Program:
 *   http://www.khanacademy.org/cs/testing-ideas/1422956783
 * Creator's profile:
 *   https://www.khanacademy.org/profile/lbv0112358/
 *
 * Currently a work in progress.
 *
 * This is released into the public domain. Feel free to use it as you please.
 */


/*************
 ** Objects **
 *************/

//
// $
//
// Global object, used to store all sort of things for the game
//
var $ = {};

//
// Configuration
//
$.cfg = {
	accel    : 1,          // acceleration, in pixels/frame^2
	speedMax : 15,         // maximum speed, in pixels/frame
	u        : width / 32  // basic "length" unit in pixels
};

//
// Colors, based on the Tango Icon Theme Guidelines
//
$.colors = {
	yellow : [ 0xfce94f, 0xedd400, 0xc4a000 ],
	orange : [ 0xfcaf3e, 0xf57900, 0xce5c00 ],
	brown  : [ 0xe9b96e, 0xc17d11, 0x8f5902 ],
	green  : [ 0x8ae234, 0x73d216, 0x4e9a06 ],
	blue   : [ 0x729fcf, 0x3465a4, 0x204a87 ],
	purple : [ 0xad7fa8, 0x75507b, 0x5c3566 ],
	red    : [ 0xef2929, 0xcc0000, 0xa40000 ]
};

//
// Objects that are able to listen to different events
//
$.callbacks = {
	frame       : [],
	draw        : [],
	keyPressed  : [],
	keyReleased : []
};

//
// A room
//
$.room = [];

//
// Queue of objects in the room that have changed, so they need to be checked
//
$.changeQueue = [];

//
// Enumerations
//
$.e = {
	zoneType : {
		// A zone that grabs objects (i.e. the "Hand")
		GRABBER   : 'grabber',
		// A zone at which an object can be grabbed
		GRABBABLE : 'grabbable',

		// Has the ability to receive flow
		INPUT  : 'input',
		// Has to ability to produce flow
		OUTPUT : 'output',

		// A zone that can connect to a socket
		PLUG   : 'plug',
		// A zone that can receive a plug
		SOCKET : 'socket'
	},

	// Possible statuses for interaction zones
	status : {
		// a zone that is doing nothing, ready to interact
		IDLE   : 'idle',
		// a zone that is interacting with some other zone
		ACTIVE : 'active',
		// a zone that is "taken" and ignores others
		BUSY   : 'busy'
	}
};


/*************
 ** Classes **
 *************/

//
// Utility function to implement inheritance
//
$.extend = function(obj, from) {
	for (var p in from) { obj[p] = from[p]; }
};

//
// Zone
//
// Defines an "interaction zone" for an object, intended to do interesting
// stuff when it comes into contact with relevant zones from other objects
//
var Zone = function() {};
$.extend(Zone.prototype, {
	obj        : null,
	type       : 'none',
	wants      : 'none',
	
	state      : $.e.states.IDLE,
	nBoxes     : 0,
	boxDataSrc : []
});

Zone.prototype.init = function(zoneType, wantsType, nBoxes, dataSrcs) {
	this.type       = zoneType;
	this.wants      = wantsType;
	this.nBoxes     = nBoxes;
	this.boxDataSrc = dataSrcs;
};

//
// KhanObject
//
// The basic class from which most other objects inherit.
//
var KhanObject = function() {};
$.extend(KhanObject.prototype, {
	x       : 0,
	y       : 0,
	idx     : -1,
	changed : false,
	zones   : []
});

KhanObject.prototype.signalChange = function() {
	if (this.changed) { return; }
	this.changed = true;
	$.changeQueue.push(this);
};

//
// Hand
//
// The "cursor" with which you interact in the world
//
var Hand = function() {};
Hand.prototype = new KhanObject();
Hand.prototype.constructor = Hand;

$.extend(Hand.prototype, {
	vx : 0, vy : 0,
	ax : 0, ay : 0,

	w : 0, h : 0
});

Hand.prototype.onInit = function() {
	this.w = this.h = $.cfg.u * 2;
	this.x = (width - this.w) / 2;
	this.y = (height - this.h) / 2;
	this.kol = $.colors.red[0] | 0xaa000000;

//	var z = new Zone();
//	z.init($.e.zones.GRABBER, $.e.zones.GRABBABLE, 1, [ boxFunc ]);
};

Hand.prototype.move = function() {
	this.x += this.vx;
	this.y += this.vy;

	this.x = constrain(this.x, 0, width - this.w);
	this.y = constrain(this.y, 0, height - this.h);
	this.signalChange();
};

Hand.prototype.onFrame = function() {
	if (this.ax !== 0) { this.vx += this.ax; }
	if (this.ay !== 0) { this.vy += this.ay; }

	this.vx = constrain(this.vx, -$.cfg.speedMax, $.cfg.speedMax);
	this.vy = constrain(this.vy, -$.cfg.speedMax, $.cfg.speedMax);

	if (this.vx !== 0 || this.vy !== 0) { this.move(); }
};

Hand.prototype.onDraw = function() {
	noStroke();
	fill(this.kol);
	rect(this.x, this.y, this.w, this.h);
};

Hand.prototype.onKeyPressed = function(k, kc) {
	if (kc === RIGHT) { this.ax = $.cfg.accel; }
	else if (kc === LEFT) { this.ax = -$.cfg.accel; }
	else if (kc === UP) { this.ay = -$.cfg.accel; }
	else if (kc === DOWN) { this.ay = $.cfg.accel; }
};

Hand.prototype.onKeyReleased = function(k, kc) {
	if (kc === RIGHT || kc === LEFT) {
		this.ax = 0; this.vx = 0;
	}
	else if (kc === UP || kc === DOWN) {
		this.ay = 0; this.vy = 0;
	}
};

//
// Boot
//
// A boot. It kicks things.
//
var Boot = function() {};
Boot.prototype = new KhanObject();
Boot.prototype.constructor = Boot;

Boot.prototype.onInit = function() {
	this.x = width / 3;
	this.y = height / 2;

	this.kol = $.colors.brown[0] | 0xff000000;
};

Boot.prototype.onDraw = function() {
	noStroke();
	fill(this.kol);
	rect(this.x, this.y, $.cfg.u * 2, $.cfg.u * 3);
	arc(this.x + $.cfg.u * 2.5, this.y + $.cfg.u * 3,
	    $.cfg.u * 3, $.cfg.u * 3, 180, 360);
};


/***************
 ** Functions **
 ***************/

//
// Entry point for the program
//
$.kickIt = function() {
	$.room.push(new Boot(), new Hand());

	$.room.forEach(function(obj, i) {
		obj.idx = i;

		if (typeof(obj.onInit) === 'function') { obj.onInit(); }
		if (typeof(obj.onFrame) === 'function') {
			$.callbacks.frame.push(obj);
		}
		if (typeof(obj.onDraw) === 'function') {
			$.callbacks.draw.push(obj);
		}
		if (typeof(obj.onKeyPressed) === 'function') {
			$.callbacks.keyPressed.push(obj);
		}
		if (typeof(obj.onKeyReleased) === 'function') {
			$.callbacks.keyReleased.push(obj);
		}
	});
};

$.handleZoneIdle = function() {

};

$.handleZoneActive = function() {

};

//
// Processing.JS callback for "draw" event
//
var draw = function() {
	$.callbacks.frame.forEach(function(obj) { obj.onFrame(); });

	for (var i = 0; i < $.changeQueue.length; ++i) {
		var obj = $.changeQueue[i];
		for (var j = 0, J = obj.zones.length; j < J; ++i) {
			var zn = obj.zones[j];
			if (zn.state === $.e.states.IDLE) { $.handleZoneIdle(zn); }
			else if (zn.state === $.e.states.ACTIVE) { $.handleZoneActive(zn); }
		}
		obj.changed = false;
	}
	$.changeQueue = [];

	background(255, 255, 255);
	$.callbacks.draw.forEach(function(obj) { obj.onDraw(); });
};

//
// Processing.JS callback for "keyPressed" event
//
var keyPressed = function() {
	$.callbacks.keyPressed.forEach(function(obj) {
		obj.onKeyPressed(key, keyCode);
	});
};

//
// Processing.JS callback for "keyReleased" event
//
var keyReleased = function() {
	$.callbacks.keyReleased.forEach(function(obj) {
		obj.onKeyReleased(key, keyCode);
	});
};

//
// Let's get this party started...
//
$.kickIt();
