var App = {
	booleanVars: {
		GOLD_HAS_IT:       0,
		SILVER_HAS_IT:     1,
		LEAD_HAS_IT:       2,

		GOLD_SAYS_TRUTH:   3,
		SILVER_SAYS_TRUTH: 4,
		LEAD_SAYS_TRUTH:   5,

		GOLD_ASSERT1:   3,
		GOLD_ASSERT2:   4,
		SILVER_ASSERT1: 5,
		SILVER_ASSERT2: 6,
		LEAD_ASSERT1:   7,
		LEAD_ASSERT2:   8
	},


	casket0:  {},
	casket1:  {},
	casket2:  {},
	dagger:   {},
	portrait: {},

	state:     null,
	stateName: 'none',
	states:    {}
};

App.states.intro = {
	setup: function() {
		var introDialog = $('#-intro').dialog({
			maxHeight: 360,
			buttons: [ {
				text: 'Close',
				click: function() {$(this).dialog('close');}
			} ]
		});
		introDialog.dialog('close');

		$('#-button-intro').button().click(function() {
			introDialog.dialog('open');
		});

		$('#-button-go-warmup').button().click(function() {
			App.setState('warmup');
		});
		$('#-button-go-portia').button().click(function() {
			App.setState('menu');
		});
		$('#-button-go-extras').button().click(function() {
			App.setState('extras');
		});

		$('#-intro-buttons').position({
			my: 'center center',
			at: 'center center+92',
			of: '#-state-intro'
		});

		$('#-state-intro').hide();
	},

	draw: function() {
		image(App.media.sprites.intro, 200, 200);
	},

	onEnter: function() {
		var donePortia = !! App.load('portia-all');
		if (donePortia) {
			$('#-button-go-extras').show(); }
		else {
			$('#-button-go-extras').hide(); }
		$('#-state-intro').fadeIn();
	},

	onLeave: function() {
		return $('#-state-intro').fadeOut().promise();
	}
};

App.states.portia_1_epilogue = {
	setup: function() {
		$('#-state-portia-1-epilogue .button-continue').
		button().click(function() {
			App.setState('menu');
		});

		App.styleStateScreen('#-state-portia-1-epilogue');
		$('#-state-portia-1-epilogue').hide();
	},

	draw: function() {
		image(App.media.sprites.abstract[3], 200, 200);
		image(App.media.images.frame, 50, 100, 84, 99);
		image(App.media.sprites.portias[0],
			50, 100, 62, 76);
	},

	onEnter: function() {
		$('#-state-portia-1-epilogue').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-1-epilogue').
			fadeOut().promise();
	}
};

App.states.portia_end = {
	setup: function() {
		$('#-state-portia-end .button-continue').button().
		click(function() {
			var special = !!App.load('portia-special-end');
			if (special) {
				App.setState('portia_end_special'); }
			else {
				App.setState('intro'); }
		});

		App.styleStateScreen('#-state-portia-end');
		$('#-state-portia-end').hide();
	},

	draw: function() {
		image(App.media.sprites.abstract[3], 200, 200);
		image(App.media.images.frame, 50, 96, 84, 99);
		image(App.media.sprites.portias[0],
			50, 96, 62, 76);

		image(App.media.images.frame, 50, 206, 84, 99);
		image(App.media.sprites.portias[1],
			50, 206, 62, 76);

		image(App.media.images.frame, 50, 316, 84, 99);
		image(App.media.sprites.portias[2],
			50, 316, 62, 76);
	},

	onEnter: function() {
		$('#-state-portia-end').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-end').
			fadeOut().promise();
	}
};

App.states.portia_end_special = {
	setup: function() {
		$('#-state-portia-end-special .button-continue').
		button().click(function() {
			App.setState('intro');
		});

		App.styleStateScreen('#-state-portia-end-special');
		$('#-state-portia-end-special').hide();
	},

	draw: function() {
		image(App.media.sprites.special, 200, 200);
	},

	onEnter: function() {
		$('#-state-portia-end-special').fadeIn().promise().
		done(function() {
			$('#-special-ending').dialog('open');
		});
	},

	onLeave: function() {
		return $('#-state-portia-end-special').
			fadeOut().promise();
	}
};


App.doubleImplication = function(b1, v1, b2, v2) {
	return [
		[
			[ b1, !v1 ], [ b2, v2 ] ],
		[
			[ b2, !v2 ], [ b1, v1 ] ]
	];
};

App.draw = function() {
	if (App.state && _.isFunction(App.state.draw)) {
		App.state.draw(); }
};

App.drawMainRoom = function(hasDagger) {
	image(App.media.sprites.room, 200, 200);
	App.casket0.draw();
	App.casket1.draw();
	if (_.isFunction(App.casket2.draw)) {
		App.casket2.draw(); }
	if (_.isFunction(App.portrait.draw)) {
		App.portrait.draw(); }
	if (_.isFunction(App.dagger.draw)) {
		App.dagger.draw(); }
};

App.evaluateGuess = function(bitmask, val) {
	var numberVars = App.logic.numberVars;
	var all = 1 << numberVars;
	var i, n;
	for (n = 0; n < all; ++n) {
		if ((n & bitmask) !== val) { continue; }

		var booleans = [];
		for (i = 0; i < numberVars; ++i) {
			booleans.push(!! (n & (1 << i)));
		}
		if (App.evaluateGuessCheck(booleans)) {
			return true; }
	}
	return false;
};

App.evaluateGuessCheck = function(booleans) {
	var rules = App.logic.rules;
	var i, I, j, J;
	for (i = 0, I = rules.length; i < I; ++i) {
		var rule = rules[i];

		var sat = false;
		for (j = 0, J = rule.length; j < J; ++j) {
			var orClause = rule[j];
			var b = orClause[0], v = orClause[1];

			if (booleans[b] === v) {
				sat = true;
				break;
			}
		}

		if (! sat) { return false; }
	}
	return true;
};

App.load = function(key) {
	return App.saveData[key];
};

App.mainSetup = function() {
	$('#-frame').position({
		my: 'left top',
		at: 'left top',
		of: '#output',
		collision: 'none'
	});

	$('button').button();

	$('.backstory, .caskets, .room-info, label, select').
		addClass('ui-widget');

	$('.button-intro').button({
		icons: { secondary: 'ui-icon-info' }
	});

	$('.button-go').button({
		icons: { secondary: 'ui-icon-circle-arrow-e' }
	});

	$('.button-back').button({
		icons: { secondary: 'ui-icon-arrowreturnthick-1-w' }
	});

	$('.button-small-back').button({
		text: false,
		icons: { primary: 'ui-icon-arrowreturnthick-1-w' }
	}).tooltip({
		position: {
			my: 'left top',
			at: 'right top'
		}
	});

	$('.button-continue').button({
		icons: { secondary: 'ui-icon-arrowthick-1-e' }
	});

	$('.button-hint').button({
		text: false,
		icons: { primary: 'ui-icon-help' }
	}).click(function() {
		var id = '#' + $(this).val();
		$(id).dialog('open');
	});

	$('.warmup-hint').dialog({
		buttons: [ {
			text: 'Close',
			click: function() { $(this).dialog('close'); }
		} ]
	}).dialog('close');

	$('.guess-bad').dialog({
		close: function() {
			if (App.stateSelector) {
				$(App.stateSelector).show(); }

			App.dagger.state = '';
			App.casket0.state = '';
			App.casket1.state = '';
			App.casket2.state = '';
		},
		buttons: [ {
			text: 'Back',
			click: function() { $(this).dialog('close'); }
		} ]
	}).dialog('close');

	$('.guess-good').dialog({
		close: function() {
			if (App.stateSelector) {
				$(App.stateSelector).show(); }
			if (_.isFunction(App.solvedCallback)) {
				App.solvedCallback(); }
			App.portrait.state = '';
			
		},
		buttons: [ {
			text: 'Continue',
			click: function() { $(this).dialog('close'); }
		} ]
	}).dialog('close');
	$('#-special-ending').dialog().dialog('close');

	var name;
	for (name in App.states) {
		var state = App.states[name];
		if (_.isFunction(state.setup)) {
			state.setup();
		}
	}

	textAlign(CENTER, BASELINE);
	App.setState('intro');
};

App.onCasketChosen = function() {
	var boolVar = parseInt(this.value, 10);
	var result = App.evaluateGuess(
		1 << boolVar, 1 << boolVar);

	var dialogYes = '#-guess-correct';
	var dialogNo  = '#-guess-wrong';
	var dialog;

	if (App.logic.dagger) {
		result = !result;
		dialogYes = '#-guess-dagger-correct';
		dialogNo  = '#-guess-dagger-wrong';
	}

	if (result) {
		dialog = dialogYes;
	}
	else {
		dialog = dialogNo;
		var count = parseInt(
			App.load('wrongCount'), 10) || 0;
		App.save('wrongCount', count + 1);
	}

	var casket;
	if (boolVar === 0)      { casket = App.casket0; }
	else if (boolVar === 1) { casket = App.casket1; }
	else if (boolVar === 2) { casket = App.casket2; }

	var moveInfo = function() {
		return $(App.stateSelector).hide('drop').promise();
	};
	var animateCasketClosed = function() {
		return casket.animate('fadeOut');
	};
	var animateCasketOpen = function() {
		return casket.animate('fadeIn');
	};
	var showPortrait = function() {
		if (App.logic.dagger && ! result) {
			return App.dagger.animate(); }
		else if (! App.logic.dagger && result) {
			return App.portrait.animate(); }
	};
	var openDialog = function() {
		return $(dialog).dialog('open').promise();
	};

	moveInfo().
		then(animateCasketClosed).
		then(animateCasketOpen).
		then(showPortrait).
		then(openDialog);
};

App.onFinalSubmit = function() {
	var id = App.stateSelector;
	var casket = $(id +
		' input:radio[name=casket]:checked').val();
	var maker0 = $(id +
		' select.select-gold option:selected').val();
	var maker1 = $(id +
		' select.select-silver option:selected').val();
	var maker2 = $(id +
		' select.select-lead option:selected').val();

	casket = parseInt(casket, 10);
	var bitmask = 1 << casket;
	var val     = 1 << casket;
	bitmask |= 1 << 3;
	bitmask |= 1 << 4;
	bitmask |= 1 << 5;
	if (maker0 === 'true') { val |= 1 << 3; }
	if (maker1 === 'true') { val |= 1 << 4; }
	if (maker2 === 'true') { val |= 1 << 5; }

	var result = App.evaluateGuess(bitmask, val);
	var dialog;

	if (casket === 0)      { casket = App.casket0; }
	else if (casket === 1) { casket = App.casket1; }
	else if (casket === 2) { casket = App.casket2; }

	if (result) {
		dialog = '#-guess-final-correct';
	}
	else {
		dialog = '#-guess-final-wrong';
		var count = parseInt(
			App.load('wrongCount'), 10) || 0;
		App.save('wrongCount', count + 1);
	}

	var moveInfo = function() {
		return $(App.stateSelector).hide('drop').promise();
	};
	var animateCasketClosed = function() {
		return casket.animate('fadeOut');
	};
	var animateCasketOpen = function() {
		return casket.animate('fadeIn');
	};
	var showPortrait = function() {
		if (result) { return App.portrait.animate(); }
	};
	var openDialog = function() {
		return $(dialog).dialog('open').promise();
	};

	moveInfo().
		then(animateCasketClosed).
		then(animateCasketOpen).
		then(showPortrait).
		then(openDialog);
};

App.onInputChange = function(id) {
	return function() {
		var casket = $(id +
			' input:radio[name=casket]:checked').val();
		var maker0 = $(id +
			' select.select-gold option:selected').val();
		var maker1 = $(id +
			' select.select-silver option:selected').val();
		var maker2 = $(id +
			' select.select-lead option:selected').val();
		var submit = $(id + ' .button-submit');
		if (casket && maker0 !== 'none' &&
		    maker1 !== 'none' && maker2 !== 'none') {
			submit.button('enable'); }
		else {
			submit.button('disable'); }
	};
};

App.setRules = function(nVars, rules, useDagger) {
	useDagger = useDagger || false;
	var v = App.booleanVars;

	// The portrait is in one, and only one casket
	var defaultRules = [
		[
			[ v.GOLD_HAS_IT, false ],
			[ v.SILVER_HAS_IT, false ] ],
		[
			[ v.GOLD_HAS_IT, false ],
			[ v.LEAD_HAS_IT, false ] ],
		[
			[ v.SILVER_HAS_IT, false ],
			[ v.LEAD_HAS_IT, false ] ],
		[
			[ v.GOLD_HAS_IT, true ],
			[ v.SILVER_HAS_IT, true ],
			[ v.LEAD_HAS_IT, true ] ]
	];

	App.logic = {
		numberVars: nVars,
		rules: rules.concat(defaultRules),
		dagger: useDagger
	};
};

App.setupRoom = function(divID) {
	$(divID + ' .silver').position({
		my: 'center top',
		at: 'center bottom+8',
		of: divID + ' .room-info',
		collision: 'none'
	});
	$(divID + ' .gold').position({
		my: 'right top',
		at: 'left-12 top',
		of: divID + ' .silver',
		collision: 'none'
	});
	$(divID + ' .lead').position({
		my: 'left top',
		at: 'right+12 top',
		of: divID + ' .silver',
		collision: 'none'
	});

	$(divID + ' .question').position({
		my: 'center center',
		at: 'center bottom-100',
		of: divID
	});

	$(divID + ' .button-gold').show().position({
		my: 'center bottom',
		at: 'left+88 bottom-25',
		of: divID,
		collision: 'none'
	});
	$(divID + ' .button-silver').show().position({
		my: 'center bottom',
		at: 'left+200 bottom-25',
		of: divID,
		collision: 'none'
	});
	$(divID + ' .button-lead').show().position({
		my: 'center bottom',
		at: 'right-88 bottom-25',
		of: divID,
		collision: 'none'
	});

	$(divID + ' .casket-buttons button').button().
		click(App.onCasketChosen);

	$(divID + ' .button-small-back').position({
		my: 'left top',
		at: 'left+4 top+4',
		of: divID,
		collision: 'none'
	});
};

App.setupRoom2 = function(divID) {
	$(divID + ' .silver').position({
		my: 'left top',
		at: 'center+32 bottom+8',
		of: divID + ' .room-info',
		collision: 'none'
	});
	$(divID + ' .gold').position({
		my: 'right top',
		at: 'center-32 bottom+8',
		of: divID + ' .room-info',
		collision: 'none'
	});

	$(divID + ' .question').position({
		my: 'center center',
		at: 'center bottom-100',
		of: divID
	});

	$(divID + ' .button-gold').position({
		my: 'center bottom',
		at: 'left+133 bottom-25',
		of: divID
	});
	$(divID + ' .button-silver').position({
		my: 'center bottom',
		at: 'left+266 bottom-25',
		of: divID
	});

	$(divID + ' .casket-buttons button').button().
		click(App.onCasketChosen);

	$(divID + ' .button-small-back').position({
		my: 'left top',
		at: 'left+4 top+4',
		of: divID,
		collision: 'none'
	});
};

App.setupRoomFinal = function(divID) {
	$(divID + ' .silver').position({
		my: 'center top',
		at: 'center bottom+8',
		of: divID + ' .room-info',
		collision: 'none'
	});
	$(divID + ' .gold').position({
		my: 'right top',
		at: 'left-16 top',
		of: divID + ' .silver',
		collision: 'none'
	});
	$(divID + ' .lead').position({
		my: 'left top',
		at: 'right+16 top',
		of: divID + ' .silver',
		collision: 'none'
	});

	$(divID + ' .question-long').position({
		my: 'center center',
		at: 'center bottom-98',
		of: divID
	});

	$(divID + ' .radio-gold').position({
		my: 'center bottom',
		at: 'left+88 bottom-48',
		of: divID,
		collision: 'none'
	});
	$(divID + ' .radio-silver').position({
		my: 'center bottom',
		at: 'left+200 bottom-48',
		of: divID,
		collision: 'none'
	});
	$(divID + ' .radio-lead').position({
		my: 'center bottom',
		at: 'right-88 bottom-48',
		of: divID,
		collision: 'none'
	});

	$(divID + ' .select-gold').position({
		my: 'center bottom',
		at: 'left+80 bottom-192',
		of: divID,
		collision: 'none'
	});
	$(divID + ' .select-silver').position({
		my: 'center bottom',
		at: 'center bottom-192',
		of: divID,
		collision: 'none'
	});
	$(divID + ' .select-lead').position({
		my: 'center bottom',
		at: 'right-80 bottom-192',
		of: divID,
		collision: 'none'
	});

	$(divID + ' .button-submit').position({
		my: 'right bottom',
		at: 'right-8 bottom-8',
		of: divID,
		collision: 'none'
	}).button({ disabled: true }).click(App.onFinalSubmit);

	$(divID + ' .button-small-back').position({
		my: 'left top',
		at: 'left+4 top+4',
		of: divID,
		collision: 'none'
	});

	$(divID + ' select,' + divID + ' input').
		on('change', App.onInputChange(divID));
};

App.save = function(key, val) {
	App.saveData[key] = val;
	var data = App.json.stringify(App.saveData);
	App.storage.setItem('-portia-puzzles', data);
};

App.setState = function(next) {
	if (next === App.stateName) { return; }

	var gotoNext = function() {
		App.stateName = next;
		App.state = App.states[next];
		if (_.isFunction(App.state.onEnter)) {
			App.state.onEnter(); }
	};

	if (App.state && _.isFunction(App.state.onLeave)) {
		var ret = App.state.onLeave();
		if (_.isObject(ret)) {
			ret.done(gotoNext); }
		else { gotoNext(); }
	}
	else { gotoNext(); }
};

App.styleButton = function(selector, key, isDefault) {
	var button = $(selector);
	var state = App.load(key);
	var icon, enable;
	if (state === 'done') {
		icon = 'ui-icon-check';
		enable = true;
	}
	else if (state === 'unlocked' || isDefault) {
		icon = 'ui-icon-unlocked';
		enable = true;
	}
	else {
		icon = 'ui-icon-locked';
		enable = false;
	}

	button.button('option', {
		icons: { secondary: icon },
		disabled: !enable
	});
};

App.styleNavButtons = function(divID) {
	$(divID + ' .button-back').position({
		my: 'left bottom',
		at: 'left+8 bottom-8',
		of: divID,
		collision: 'none'
	});

	$(divID + ' .button-continue').position({
		my: 'right bottom',
		at: 'right-8 bottom-8',
		of: divID,
		collision: 'none'
	});
};

App.styleStateScreen = function(divID) {
	$(divID + ' .menu-button-div').position({
		my: 'center center',
		at: 'center center',
		of: divID,
		collision: 'none'
	});

	App.styleNavButtons(divID);
};

App.styleWarmupScreen = function(divID) {
	App.styleNavButtons(divID);
};

App.unlock = function(puzzle) {
	var state = App.load(puzzle);
	if (state !== 'done') {
		App.save(puzzle, 'unlocked'); }
};

App.init = function() {
	var baseURL = '//dl.dropboxusercontent.com/u/17178990' +
		'/assets/portia-puzzles';

	imageMode(CENTER);
	$global.addCSS(
		'portia-styles', baseURL + '/css/portia.css');

	App.json    = $global.get('JSON');
	App.storage = $global.get('localStorage');
	try {
		var data = App.storage.getItem('-portia-puzzles');
		App.saveData = $.parseJSON(data);
	}
	catch(e) {
		App.saveData = null;
	}
	if (! _.isObject(App.saveData)) {
		App.saveData = { active: true }; }

	var mamConfig = {
		images: {
			backgrounds: baseURL + '/img/backgrounds.jpg',
			chests: baseURL + '/img/chests.png',
			dagger: baseURL + '/img/dagger.png',
			frame: baseURL + '/img/frame.png',
			portraits: baseURL + '/img/portraits.jpg'
		},

		sprites: {
			abstract: {
				sheet: 'backgrounds',
				width: 400, height: 400,
				x: 0, y: 400,
				frames: 4
			},
			intro: {
				sheet: 'backgrounds',
				width: 400, height: 400,
				x: 400, y: 0
			},
			menu: {
				sheet: 'backgrounds',
				width: 400, height: 400,
				x: 800, y: 0
			},
			room: {
				sheet: 'backgrounds',
				width: 400, height: 400,
				x: 0, y: 0
			},
			special: {
				sheet: 'backgrounds',
				width: 400, height: 400,
				x: 1200, y: 0
			},
			chests: {
				sheet: 'chests',
				width: 64, height: 64,
				x: 0, y: 0,
				frames: 6
			},
			portias: {
				sheet: 'portraits',
				width: 112, height: 138,
				x: 0, y: 0,
				frames: 3
			}
		},

		fonts: [ 'PT Serif', 'Dancing Script', 'Smythe' ],

		onReady: function(media) { App.media = media; },
		draw: App.draw
	};

	var htmlPromise = $global.ajax(
		'UI', baseURL + '/htm/ui.htm', 'html');
	htmlPromise.done(function(data) {
		$global.insertHTML(data);
	});
	$.when(
		htmlPromise,
		$global.loadJQueryUI('excite-bike'),
		$global.loadMAM(mamConfig)).done(App.mainSetup);
};


var draw = function() {
	background(255, 255, 255);
	fill(0, 0, 0);
	textAlign(CENTER, CENTER);
	text("loading", 200, 200);
};


App.init();
