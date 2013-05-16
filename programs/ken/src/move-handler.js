var moveHandler = {
	// maximum accepted interval between keypresses in
	// combos (in milliseconds)
	defaultInterval : 150,

	defaultPriority : 0,
	startingEvents  : {},
	waitingEvents   : {}
};

moveHandler.sortMoves = function(a, b) {
	return b.priority - a.priority;
};

moveHandler.getStarting = function(code) {
	if (moveHandler.startingEvents[code] === undefined) {
		moveHandler.startingEvents[code] = []; }
	return moveHandler.startingEvents[code];
};

moveHandler.getWaiting = function(code) {
	if (moveHandler.waitingEvents[code] === undefined) {
		moveHandler.waitingEvents[code] = []; }
	return moveHandler.waitingEvents[code];
};

moveHandler.onKeyDown = function(code) {
	var ts = millis();
	var moves = [];
	var starters = moveHandler.getStarting(code);
	var waiting  = moveHandler.getWaiting(code);

	var pushWaiting = function(ev) {
		var next = ev.next;
		var wEvent = {
			expires : ts + next.interval,
			event   : next
		};
		var wEvents = moveHandler.getWaiting(ev.nextKey);
		wEvents.push(wEvent);
	};

	var ev;
	var i, I;
	for (i = 0, I = starters.length; i < I; ++i) {
		ev = starters[i];
		if (ev.isLast) { moves.push(ev.move); }
		else { pushWaiting(ev); }
	}

	var updatedEvents = [];
	var wev;
	// let's start by getting rid of expired events
	for (i = 0, I = waiting.length; i < I; ++i) {
		wev = waiting[i];
		if (wev.expires > ts) { updatedEvents.push(wev); }
	}
	moveHandler.waitingEvents[code] = updatedEvents;
	for (i = 0, I = updatedEvents.length; i < I; ++i) {
		wev = updatedEvents[i];
		ev = wev.event;
		if (ev.isLast) { moves.push(ev.move); }
		else { pushWaiting(ev); }
	}
	
	if (moves.length === 0) { return; }
	moves.sort(moveHandler.sortMoves);
	var move = moves[0];
	move.cb.call(move.ctx, move.name);
};

moveHandler.register = function(moves, cb, ctx) {
	var name;
	for (name in moves) {
		var move = { name:name, cb:cb, ctx:ctx };
		moveHandler.registerMove(move, moves[name]);
	}
};

moveHandler.registerMove = function(move, data) {
	move.priority = data.priority ?
		data.priority : moveHandler.defaultPriority;
	var events = data.events ? data.events : data;
	var saneEvents = [];
	var i, I;
	for (i = 0, I = events.length; i < I; ++i) {
		var ev = events[i];
		var key      = ev.key ? ev.key : ev;
		var interval = ev.interval ?
			ev.interval : moveHandler.defaultInterval;

		var event = {
			key      : key,
			next     : null,
			isLast   : i === I - 1,
			interval : interval,
			move     : move
		};
		saneEvents.push(event);
		if (i > 0) {
			saneEvents[i - 1].next = event;
			saneEvents[i - 1].nextKey = event.key;
		}
	}
	var starter = saneEvents[0];
	var sEvents = moveHandler.getStarting(starter.key);
	sEvents.push(starter);
};

$key.addListenerDown(moveHandler.onKeyDown);
