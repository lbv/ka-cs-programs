App.states.portia_1_1_main = {
	setup: function() {
		App.setupRoom('#-state-portia-1-1-main');
		$('#-state-portia-1-1-main .button-small-back').
		button().click(function() {
			App.setState('portia_1_1_story');
		});

		$('#-state-portia-1-1-main').hide();
	},

	draw: function() {
		App.drawMainRoom();
	},

	onEnter: function() {
		var v = App.booleanVars;
		var rules = [
			[
				[ v.GOLD_SAYS_TRUTH, false ],
				[ v.SILVER_SAYS_TRUTH, false ] ],
			[
				[ v.GOLD_SAYS_TRUTH, false ],
				[ v.LEAD_SAYS_TRUTH, false ] ],
			[
				[ v.SILVER_SAYS_TRUTH, false ],
				[ v.LEAD_SAYS_TRUTH, false ] ],
			[
				[ v.GOLD_SAYS_TRUTH, true ],
				[ v.SILVER_SAYS_TRUTH, true ],
				[ v.LEAD_SAYS_TRUTH, true ] ]
		].concat(
			App.doubleImplication(
				v.GOLD_SAYS_TRUTH, true,
				v.GOLD_HAS_IT, true),
			App.doubleImplication(
				v.SILVER_SAYS_TRUTH, true,
				v.SILVER_HAS_IT, false),
			App.doubleImplication(
				v.LEAD_SAYS_TRUTH, true,
				v.GOLD_HAS_IT, false) );

		App.stateSelector = '#-state-portia-1-1-main';
		App.portrait = new Portrait(
			App.media.images.frame,
			App.media.sprites.portias[0]);
		App.casket0 = new Casket(0,
			App.media.sprites.chests[0],
			App.media.sprites.chests[3]);
		App.casket1 = new Casket(1,
			App.media.sprites.chests[1],
			App.media.sprites.chests[4]);
		App.casket2 = new Casket(2,
			App.media.sprites.chests[2],
			App.media.sprites.chests[5]);

		App.setRules(6, rules);
		App.solvedCallback = function() {
			App.save('portia-1-1', 'done');
			App.unlock('portia-1-2');
			App.setState('menu_1');
		};
		$('#-state-portia-1-1-main').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-1-1-main').
			fadeOut().promise();
	}
};

App.states.portia_1_2_main = {
	setup: function() {
		App.setupRoom('#-state-portia-1-2-main');
		$('#-state-portia-1-2-main .button-small-back').
		button().click(function() {
			App.setState('portia_1_2_story');
		});

		$('#-state-portia-1-2-main').hide();
	},

	draw: function() {
		App.drawMainRoom();
	},

	onEnter: function() {
		var v = App.booleanVars;
		var rules = [
			[
				[ v.GOLD_SAYS_TRUTH, true ],
				[ v.SILVER_SAYS_TRUTH, true ],
				[ v.LEAD_SAYS_TRUTH, true ] ],
			[
				[ v.GOLD_SAYS_TRUTH, false ],
				[ v.SILVER_SAYS_TRUTH, false ],
				[ v.LEAD_SAYS_TRUTH, false ] ]

		].concat(
			App.doubleImplication(
				v.GOLD_SAYS_TRUTH, true,
				v.SILVER_HAS_IT, false),
			App.doubleImplication(
				v.SILVER_SAYS_TRUTH, true,
				v.SILVER_HAS_IT, false),
			App.doubleImplication(
				v.LEAD_SAYS_TRUTH, true,
				v.LEAD_HAS_IT, true) );

		App.stateSelector = '#-state-portia-1-2-main';
		App.portrait = new Portrait(
			App.media.images.frame,
			App.media.sprites.portias[0]);
		App.casket0 = new Casket(0,
			App.media.sprites.chests[0],
			App.media.sprites.chests[3]);
		App.casket1 = new Casket(1,
			App.media.sprites.chests[1],
			App.media.sprites.chests[4]);
		App.casket2 = new Casket(2,
			App.media.sprites.chests[2],
			App.media.sprites.chests[5]);

		App.setRules(6, rules);
		App.solvedCallback = function() {
			App.save('portia-1-2', 'done');
			App.save('portia-1', 'done');
			App.unlock('portia-2');
			App.setState('portia_1_epilogue');
		};
		$('#-state-portia-1-2-main').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-1-2-main').
			fadeOut().promise();
	}
};

App.states.portia_2_1_main = {
	setup: function() {
		App.setupRoom('#-state-portia-2-1-main');
		$('#-state-portia-2-1-main .button-small-back').
		button().click(function() {
			App.setState('portia_2_1_story');
		});

		$('#-state-portia-2-1-main').hide();
	},

	draw: function() {
		App.drawMainRoom();
	},

	onEnter: function() {
		var v = App.booleanVars;
		var rules = [
			[
				[ v.GOLD_ASSERT1, true ],
				[ v.GOLD_ASSERT2, true ] ],
			[
				[ v.SILVER_ASSERT1, true ],
				[ v.SILVER_ASSERT2, true ] ],
			[
				[ v.LEAD_ASSERT1, true ],
				[ v.LEAD_ASSERT2, true ] ]
		].concat(
			App.doubleImplication(
				v.GOLD_ASSERT1, true,
				v.GOLD_HAS_IT, false),
			App.doubleImplication(
				v.SILVER_ASSERT1, true,
				v.GOLD_HAS_IT, false),
			App.doubleImplication(
				v.SILVER_ASSERT2, true,
				v.LEAD_HAS_IT, true),
			App.doubleImplication(
				v.LEAD_ASSERT1, true,
				v.LEAD_HAS_IT, false),
			App.doubleImplication(
				v.LEAD_ASSERT2, true,
				v.GOLD_HAS_IT, true) );

		App.stateSelector = '#-state-portia-2-1-main';
		App.portrait = new Portrait(
			App.media.images.frame,
			App.media.sprites.portias[1]);
		App.casket0 = new Casket(0,
			App.media.sprites.chests[0],
			App.media.sprites.chests[3]);
		App.casket1 = new Casket(1,
			App.media.sprites.chests[1],
			App.media.sprites.chests[4]);
		App.casket2 = new Casket(2,
			App.media.sprites.chests[2],
			App.media.sprites.chests[5]);

		App.setRules(9, rules);
		App.solvedCallback = function() {
			App.save('portia-2-1', 'done');
			App.unlock('portia-2-2');
			App.setState('menu_2');
		};
		$('#-state-portia-2-1-main').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-2-1-main').
			fadeOut().promise();
	}
};

App.states.portia_2_2_main = {
	setup: function() {
		App.setupRoom('#-state-portia-2-2-main');
		$('#-state-portia-2-2-main .button-small-back').
		button().click(function() {
			App.setState('portia_2_2_story');
		});

		$('#-state-portia-2-2-main').hide();
	},

	draw: function() {
		App.drawMainRoom();
	},

	onEnter: function() {
		var v = App.booleanVars;
		var rules = [
			[
				[ v.GOLD_ASSERT1, false ],
				[ v.GOLD_ASSERT2, false ],
				[ v.SILVER_ASSERT1, false ],
				[ v.SILVER_ASSERT2, false ] ],
			[
				[ v.GOLD_ASSERT1, false ],
				[ v.GOLD_ASSERT2, false ],
				[ v.LEAD_ASSERT1, false ],
				[ v.LEAD_ASSERT2, false ] ],
			[
				[ v.LEAD_ASSERT1, false ],
				[ v.LEAD_ASSERT2, false ],
				[ v.SILVER_ASSERT1, false ],
				[ v.SILVER_ASSERT2, false ] ],
			[
				[ v.GOLD_ASSERT1, true ],
				[ v.GOLD_ASSERT2, true ],
				[ v.SILVER_ASSERT1, true ],
				[ v.SILVER_ASSERT2, true ] ],
			[
				[ v.GOLD_ASSERT1, true ],
				[ v.GOLD_ASSERT2, true ],
				[ v.LEAD_ASSERT1, true ],
				[ v.LEAD_ASSERT2, true ] ],
			[
				[ v.LEAD_ASSERT1, true ],
				[ v.LEAD_ASSERT2, true ],
				[ v.SILVER_ASSERT1, true ],
				[ v.SILVER_ASSERT2, true ] ],
			// ---
			[
				[ v.GOLD_ASSERT1, true ],
				[ v.SILVER_ASSERT1, true ],
				[ v.LEAD_ASSERT1, true ] ],
			[
				[ v.GOLD_ASSERT1, true ],
				[ v.SILVER_ASSERT1, true ],
				[ v.LEAD_ASSERT2, true ] ],
			[
				[ v.GOLD_ASSERT1, true ],
				[ v.SILVER_ASSERT2, true ],
				[ v.LEAD_ASSERT1, true ] ],
			[
				[ v.GOLD_ASSERT1, true ],
				[ v.SILVER_ASSERT2, true ],
				[ v.LEAD_ASSERT2, true ] ],
			[
				[ v.GOLD_ASSERT2, true ],
				[ v.SILVER_ASSERT1, true ],
				[ v.LEAD_ASSERT1, true ] ],
			[
				[ v.GOLD_ASSERT2, true ],
				[ v.SILVER_ASSERT1, true ],
				[ v.LEAD_ASSERT2, true ] ],
			[
				[ v.GOLD_ASSERT2, true ],
				[ v.SILVER_ASSERT2, true ],
				[ v.LEAD_ASSERT1, true ] ],
			[
				[ v.GOLD_ASSERT2, true ],
				[ v.SILVER_ASSERT2, true ],
				[ v.LEAD_ASSERT2, true ] ],
			// --
			[
				[ v.GOLD_ASSERT1, false ],
				[ v.SILVER_ASSERT1, false ],
				[ v.LEAD_ASSERT1, false ] ],
			[
				[ v.GOLD_ASSERT1, false ],
				[ v.SILVER_ASSERT1, false ],
				[ v.LEAD_ASSERT2, false ] ],
			[
				[ v.GOLD_ASSERT1, false ],
				[ v.SILVER_ASSERT2, false ],
				[ v.LEAD_ASSERT1, false ] ],
			[
				[ v.GOLD_ASSERT1, false ],
				[ v.SILVER_ASSERT2, false ],
				[ v.LEAD_ASSERT2, false ] ],
			[
				[ v.GOLD_ASSERT2, false ],
				[ v.SILVER_ASSERT1, false ],
				[ v.LEAD_ASSERT1, false ] ],
			[
				[ v.GOLD_ASSERT2, false ],
				[ v.SILVER_ASSERT1, false ],
				[ v.LEAD_ASSERT2, false ] ],
			[
				[ v.GOLD_ASSERT2, false ],
				[ v.SILVER_ASSERT2, false ],
				[ v.LEAD_ASSERT1, false ] ],
			[
				[ v.GOLD_ASSERT2, false ],
				[ v.SILVER_ASSERT2, false ],
				[ v.LEAD_ASSERT2, false ] ]
		].concat(
			App.doubleImplication(
				v.GOLD_ASSERT1, true,
				v.GOLD_HAS_IT, false),
			App.doubleImplication(
				v.GOLD_ASSERT2, true,
				v.SILVER_HAS_IT, true),
			App.doubleImplication(
				v.SILVER_ASSERT1, true,
				v.GOLD_HAS_IT, false),
			App.doubleImplication(
				v.SILVER_ASSERT2, true,
				v.LEAD_HAS_IT, true),
			App.doubleImplication(
				v.LEAD_ASSERT1, true,
				v.LEAD_HAS_IT, false),
			App.doubleImplication(
				v.LEAD_ASSERT2, true,
				v.GOLD_HAS_IT, true) );

		App.stateSelector = '#-state-portia-2-2-main';
		App.portrait = new Portrait(
			App.media.images.frame,
			App.media.sprites.portias[1]);
		App.casket0 = new Casket(0,
			App.media.sprites.chests[0],
			App.media.sprites.chests[3]);
		App.casket1 = new Casket(1,
			App.media.sprites.chests[1],
			App.media.sprites.chests[4]);
		App.casket2 = new Casket(2,
			App.media.sprites.chests[2],
			App.media.sprites.chests[5]);

		App.setRules(9, rules);
		App.solvedCallback = function() {
			App.save('portia-2-2', 'done');
			App.save('portia-2', 'done');
			App.unlock('portia-3');
			App.setState('menu');
		};
		$('#-state-portia-2-2-main').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-2-2-main').
			fadeOut().promise();
	}
};

App.states.portia_3_1_main = {
	setup: function() {
		App.setupRoom('#-state-portia-3-1-main');
		$('#-state-portia-3-1-main .button-small-back').
		button().click(function() {
			App.setState('portia_3_1_story');
		});

		$('#-state-portia-3-1-main').hide();
	},

	draw: function() {
		App.drawMainRoom();
	},

	onEnter: function() {
		var v = App.booleanVars;
		var rules = [].concat(
			App.doubleImplication(
				v.GOLD_SAYS_TRUTH, true,
				v.GOLD_HAS_IT, true),
			App.doubleImplication(
				v.SILVER_SAYS_TRUTH, true,
				v.SILVER_HAS_IT, false),
			App.doubleImplication(
				v.LEAD_SAYS_TRUTH, true,
				v.GOLD_SAYS_TRUTH, false),
			App.doubleImplication(
				v.LEAD_SAYS_TRUTH, true,
				v.SILVER_SAYS_TRUTH, false) );

		App.stateSelector = '#-state-portia-3-1-main';
		App.dagger = new Dagger(App.media.images.dagger);
		App.casket0 = new Casket(0,
			App.media.sprites.chests[0],
			App.media.sprites.chests[3]);
		App.casket1 = new Casket(1,
			App.media.sprites.chests[1],
			App.media.sprites.chests[4]);
		App.casket2 = new Casket(2,
			App.media.sprites.chests[2],
			App.media.sprites.chests[5]);

		App.setRules(6, rules, true);
		App.solvedCallback = function() {
			App.save('portia-3-1', 'done');
			App.unlock('portia-3-2');
			App.setState('menu_3');
		};
		$('#-state-portia-3-1-main').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-3-1-main').
			fadeOut().promise();
	}
};

App.states.portia_3_2_main = {
	setup: function() {
		App.setupRoom2('#-state-portia-3-2-main');
		$('#-state-portia-3-2-main .button-small-back').
		button().click(function() {
			App.setState('portia_3_2_story');
		});

		$('#-state-portia-3-2-main').hide();
	},

	draw: function() {
		App.drawMainRoom();
	},

	onEnter: function() {
		var v = App.booleanVars;
		var rules = [
			[ [ v.GOLD_SAYS_TRUTH, false ] ]
		].concat(
			App.doubleImplication(
				v.GOLD_SAYS_TRUTH, true,
				v.GOLD_HAS_IT, false) );

		App.stateSelector = '#-state-portia-3-2-main';
		App.portrait = new Portrait(
			App.media.images.frame,
			App.media.sprites.portias[2]);
		App.casket0 = new Casket(3,
			App.media.sprites.chests[0],
			App.media.sprites.chests[3]);
		App.casket1 = new Casket(4,
			App.media.sprites.chests[1],
			App.media.sprites.chests[4]);
		App.casket2 = {};

		App.setRules(6, rules);
		App.solvedCallback = function() {
			App.save('portia-3-2', 'done');
			App.unlock('portia-3-3');
			App.setState('menu_3');
		};
		$('#-state-portia-3-2-main').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-3-2-main').
			fadeOut().promise();
	}
};

App.states.portia_3_3_main = {
	setup: function() {
		App.setupRoomFinal('#-state-portia-3-3-main');
		$('#-state-portia-3-3-main .button-small-back').
		button().click(function() {
			App.setState('portia_3_3_story');
		});

		$('#-state-portia-3-3-main').hide();
	},

	draw: function() {
		App.drawMainRoom();
	},

	onEnter: function() {
		var v = App.booleanVars;
		var rules = [
			[
				[ v.LEAD_SAYS_TRUTH, false ],
				[ v.GOLD_SAYS_TRUTH, false ] ],
			[
				[ v.LEAD_SAYS_TRUTH, false ],
				[ v.SILVER_SAYS_TRUTH, false ] ],
			[
				[ v.LEAD_SAYS_TRUTH, true ],
				[ v.GOLD_SAYS_TRUTH, true ] ],
			[
				[ v.LEAD_SAYS_TRUTH, true ],
				[ v.SILVER_SAYS_TRUTH, true ] ]
		].concat(
			App.doubleImplication(
				v.GOLD_SAYS_TRUTH, true,
				v.GOLD_HAS_IT, true),
			App.doubleImplication(
				v.SILVER_SAYS_TRUTH, true,
				v.SILVER_HAS_IT, true) );

		App.stateSelector = '#-state-portia-3-3-main';
		App.portrait = new Portrait(
			App.media.images.frame,
			App.media.sprites.portias[2]);
		App.casket0 = new Casket(0,
			App.media.sprites.chests[0],
			App.media.sprites.chests[3]);
		App.casket1 = new Casket(1,
			App.media.sprites.chests[1],
			App.media.sprites.chests[4]);
		App.casket2 = new Casket(2,
			App.media.sprites.chests[2],
			App.media.sprites.chests[5]);

		App.setRules(6, rules);
		App.solvedCallback = function() {
			App.save('portia-3-3', 'done');
			App.save('portia-3', 'done');

			var completed = !!App.load('portia-all');
			if (! completed) {
				App.save('portia-all', true);
				var count = parseInt(
					App.load('wrongCount'), 10) || 0;
				App.save('portia-special-end', count === 0);
			}
			App.setState('portia_end');
		};
		$('#-state-portia-3-3-main').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-3-3-main').
			fadeOut().promise();
	}
};
