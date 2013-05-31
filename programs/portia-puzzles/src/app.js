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

	state:     null,
	stateName: 'none',
	states:    {}
};

App.states.intro = {
	setup: function() {
		$('#-state-intro').css({
			fontSize: '16px'
		});
		var introDialog = $('#-intro').dialog({
			modal: true,
			buttons: [
				{
					text: 'Close',
					click: function() {
						$(this).dialog('close');
					}
				}
			]
		});
		introDialog.dialog('close');

		$('.main-button').css({
			display: 'block',
			margin: '16px auto',
			padding: '8px 0',
			width: '120px'
		});

		$('#-button-intro').button({
			icons: { secondary: 'ui-icon-info' }
		}).click(function() {
			introDialog.dialog('open');
		});

		$('#-button-begin').button({
			icons: { secondary: 'ui-icon-circle-arrow-e' }
		}).click(function() {
			App.setState('menu');
		});

		$('#-intro-buttons').position({
			my: 'center bottom',
			at: 'center bottom-56',
			of: '#-frame'
		});

		$('#-state-intro').hide();
	},

	draw: function() {
		image(App.media.images.intro, 0, 0);
	},

	onEnter: function() {
		$('#-state-intro').fadeIn();
	},

	onLeave: function() {
		return $('#-state-intro').fadeOut().promise();
	}
};

App.states.menu = {
	setup: function() {
		$('#-button-back-menu').button().click(function() {
			App.setState('intro');
		});
	
		$('#-button-portia-1').button().click(function() {
			App.setState('menu_1');
		});
		$('#-button-portia-2').button().click(function() {
			App.setState('menu_2');
		});
		$('#-button-portia-3').button().click(function() {
			App.setState('menu_3');
		});

		App.styleStateScreen('#-state-menu');
		$('#-state-menu').hide();
	},

	draw: function() {
		image(App.media.images.menu, 0, 0);
	},

	onEnter: function() {
		App.styleButton(
			'#-button-portia-1', 'portia-1', true);
		App.styleButton('#-button-portia-2', 'portia-2');
		App.styleButton('#-button-portia-3', 'portia-3');

		$('#-state-menu').fadeIn();
	},

	onLeave: function() {
		return $('#-state-menu').fadeOut().promise();
	}
};

App.states.menu_1 = {
	setup: function() {
		$('#-state-menu-1 .button-back').button().
		click(function() {
			App.setState('menu');
		});

		$('#-button-portia-1-1').button().click(function() {
			App.setState('portia_1_1_story');
		});
		$('#-button-portia-1-2').button().click(function() {
			App.setState('portia_1_2_story');
		});

		App.styleStateScreen('#-state-menu-1');
		$('#-state-menu-1').hide();
	},

	draw: function() {
		image(App.media.images.menu, 0, 0);
	},

	onEnter: function() {
		App.styleButton(
			'#-button-portia-1-1', 'portia-1-1', true);
		App.styleButton(
			'#-button-portia-1-2', 'portia-1-2');

		$('#-state-menu-1').fadeIn();
	},

	onLeave: function() {
		return $('#-state-menu-1').fadeOut().promise();
	}
};

App.states.portia_1_1_story = {
	setup: function() {
		$('#-state-portia-1-1-story .button-back').button().
		click(function() {
			App.setState('menu_1');
		});
		$('#-state-portia-1-1-story .button-continue').
		button().click(function() {
			App.setState('portia_1_1_main');
		});

		App.styleStateScreen('#-state-portia-1-1-story');
		$('#-state-portia-1-1-story').hide();
	},

	draw: function() {
		image(App.media.sprites.bgs[0], 0, 0);
		image(App.media.sprites.portias[0],
			300, 50, 80, 80);
	},

	onEnter: function() {
		$('#-state-portia-1-1-story').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-1-1-story').
			fadeOut().promise();
	}
};

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

		App.setRules(6, rules);
		App.solvedCallback = function() {
			App.save('portia-1-1', 'done');
			App.unlock('portia-1-2');
			App.setState('menu_1');
		};
		$('#-state-portia-1-1-main').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-1-1-main').
			fadeOut().promise();
	}
};

App.states.portia_1_2_story = {
	setup: function() {
		$('#-state-portia-1-2-story .button-back').button().
		click(function() {
			App.setState('menu_1');
		});
		$('#-state-portia-1-2-story .button-continue').
		button().click(function() {
			App.setState('portia_1_2_main');
		});

		App.styleStateScreen('#-state-portia-1-2-story');
		$('#-state-portia-1-2-story').hide();
	},

	draw: function() {
		image(App.media.sprites.bgs[0], 0, 0);
		image(App.media.sprites.portias[0],
			300, 50, 80, 80);
	},

	onEnter: function() {
		$('#-state-portia-1-2-story').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-1-2-story').
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

		App.setRules(6, rules);
		App.solvedCallback = function() {
			App.save('portia-1-2', 'done');
			App.save('portia-1', 'done');
			App.unlock('portia-2');
			App.setState('portia_1_epilogue');
		};
		$('#-state-portia-1-2-main').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-1-2-main').
			fadeOut().promise();
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
		image(App.media.sprites.bgs[0], 0, 0);
		image(App.media.sprites.portias[0],
			300, 50, 80, 80);
	},

	onEnter: function() {
		$('#-state-portia-1-epilogue').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-1-epilogue').
			fadeOut().promise();
	}
};

App.states.menu_2 = {
	setup: function() {
		$('#-state-menu-2 .button-back').button().
		click(function() {
			App.setState('menu');
		});

		$('#-button-portia-2-1').button().click(function() {
			App.setState('portia_2_1_story');
		});
		$('#-button-portia-2-2').button().click(function() {
			App.setState('portia_2_2_story');
		});

		App.styleStateScreen('#-state-menu-2');
		$('#-state-menu-2').hide();
	},

	draw: function() {
		image(App.media.images.menu, 0, 0);
	},

	onEnter: function() {
		App.styleButton(
			'#-button-portia-2-1', 'portia-2-1', true);
		App.styleButton(
			'#-button-portia-2-2', 'portia-2-2');

		$('#-state-menu-2').fadeIn();
	},

	onLeave: function() {
		return $('#-state-menu-2').fadeOut().promise();
	}
};

App.states.portia_2_1_story = {
	setup: function() {
		$('#-state-portia-2-1-story .button-back').button().
		click(function() {
			App.setState('menu_2');
		});
		$('#-state-portia-2-1-story .button-continue').
		button().click(function() {
			App.setState('portia_2_1_main');
		});

		App.styleStateScreen('#-state-portia-2-1-story');
		$('#-state-portia-2-1-story').hide();
	},

	draw: function() {
		image(App.media.sprites.bgs[1], 0, 0);
		image(App.media.sprites.portias[1],
			300, 50, 80, 80);
	},

	onEnter: function() {
		$('#-state-portia-2-1-story').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-2-1-story').
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

		App.setRules(9, rules);
		App.solvedCallback = function() {
			App.save('portia-2-1', 'done');
			App.unlock('portia-2-2');
			App.setState('menu_2');
		};
		$('#-state-portia-2-1-main').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-2-1-main').
			fadeOut().promise();
	}
};

App.states.portia_2_2_story = {
	setup: function() {
		$('#-state-portia-2-2-story .button-back').button().
		click(function() {
			App.setState('menu_2');
		});
		$('#-state-portia-2-2-story .button-continue').
		button().click(function() {
			App.setState('portia_2_2_main');
		});

		App.styleStateScreen('#-state-portia-2-2-story');
		$('#-state-portia-2-2-story').hide();
	},

	draw: function() {
		image(App.media.sprites.bgs[1], 0, 0);
		image(App.media.sprites.portias[1],
			300, 50, 80, 80);
	},

	onEnter: function() {
		$('#-state-portia-2-2-story').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-2-2-story').
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

		App.setRules(9, rules);
		App.solvedCallback = function() {
			App.save('portia-2-2', 'done');
			App.save('portia-2', 'done');
			App.unlock('portia-3');
			App.setState('menu');
		};
		$('#-state-portia-2-2-main').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-2-2-main').
			fadeOut().promise();
	}
};

App.states.menu_3 = {
	setup: function() {
		$('#-state-menu-3 .button-back').button().
		click(function() {
			App.setState('menu');
		});

		$('#-button-portia-3-1').button().click(function() {
			App.setState('portia_3_1_story');
		});
		$('#-button-portia-3-2').button().click(function() {
			App.setState('portia_3_2_story');
		});
		$('#-button-portia-3-3').button().click(function() {
			App.setState('portia_3_3_story');
		});

		App.styleStateScreen('#-state-menu-3');
		$('#-state-menu-3').hide();
	},

	draw: function() {
		image(App.media.images.menu, 0, 0);
	},

	onEnter: function() {
		App.styleButton(
			'#-button-portia-3-1', 'portia-3-1', true);
		App.styleButton(
			'#-button-portia-3-2', 'portia-3-2');
		App.styleButton(
			'#-button-portia-3-3', 'portia-3-3');

		$('#-state-menu-3').fadeIn();
	},

	onLeave: function() {
		return $('#-state-menu-3').fadeOut().promise();
	}
};

App.states.portia_3_1_story = {
	setup: function() {
		$('#-state-portia-3-1-story .button-back').button().
		click(function() {
			App.setState('menu_3');
		});
		$('#-state-portia-3-1-story .button-continue').
		button().click(function() {
			App.setState('portia_3_1_main');
		});

		App.styleStateScreen('#-state-portia-3-1-story');
		$('#-state-portia-3-1-story').hide();
	},

	draw: function() {
		image(App.media.sprites.bgs[2], 0, 0);
		image(App.media.sprites.portias[2],
			300, 50, 80, 80);
	},

	onEnter: function() {
		$('#-state-portia-3-1-story').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-3-1-story').
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
		App.drawMainRoom(true);
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

		App.setRules(6, rules, true);
		App.solvedCallback = function() {
			App.save('portia-3-1', 'done');
			App.unlock('portia-3-2');
			App.setState('menu_3');
		};
		$('#-state-portia-3-1-main').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-3-1-main').
			fadeOut().promise();
	}
};

App.states.portia_3_2_story = {
	setup: function() {
		$('#-state-portia-3-2-story .button-back').button().
		click(function() {
			App.setState('menu_3');
		});
		$('#-state-portia-3-2-story .button-continue').
		button().click(function() {
			App.setState('portia_3_2_main');
		});

		App.styleStateScreen('#-state-portia-3-2-story');
		$('#-state-portia-3-2-story').hide();
	},

	draw: function() {
		image(App.media.sprites.bgs[2], 0, 0);
		image(App.media.sprites.portias[2],
			300, 50, 80, 80);
	},

	onEnter: function() {
		$('#-state-portia-3-2-story').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-3-2-story').
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
		App.drawMainRoom2();
	},

	onEnter: function() {
		var v = App.booleanVars;
		var rules = [
			[ [ v.GOLD_SAYS_TRUTH, false ] ]
		].concat(
			App.doubleImplication(
				v.GOLD_SAYS_TRUTH, true,
				v.GOLD_HAS_IT, false) );

		App.setRules(6, rules);
		App.solvedCallback = function() {
			App.save('portia-3-2', 'done');
			App.unlock('portia-3-3');
			App.setState('menu_3');
		};
		$('#-state-portia-3-2-main').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-3-2-main').
			fadeOut().promise();
	}
};

App.states.portia_3_3_story = {
	setup: function() {
		$('#-state-portia-3-3-story .button-back').button().
		click(function() {
			App.setState('menu_3');
		});
		$('#-state-portia-3-3-story .button-continue').
		button().click(function() {
			App.setState('portia_3_3_main');
		});

		App.styleStateScreen('#-state-portia-3-3-story');
		$('#-state-portia-3-3-story').hide();
	},

	draw: function() {
		image(App.media.sprites.bgs[2], 0, 0);
		image(App.media.sprites.portias[2],
			300, 50, 80, 80);
	},

	onEnter: function() {
		$('#-state-portia-3-3-story').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-3-3-story').
			fadeOut().promise();
	}
};

App.states.portia_3_3_main = {
	setup: function() {
		App.setupRoom3('#-state-portia-3-3-main');
		$('#-state-portia-3-3-main .button-small-back').
		button().click(function() {
			App.setState('portia_3_3_story');
		});

		$('#-state-portia-3-3-main').hide();
	},

	draw: function() {
		App.drawMainRoom3();
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

		App.setRules(6, rules);
		App.solvedCallback = function() {
			App.save('portia-3-3', 'done');
			App.save('portia-3', 'done');

			var completed = App.load('portia-all');
			if (! completed) {
				App.save('portia-all', true);
				var count = parseInt(
					App.load('wrongCount'), 10);
				App.save('portia-special-end', count === 0);
			}
			App.setState('portia_end');
		};
		$('#-state-portia-3-3-main').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-3-3-main').
			fadeOut().promise();
	}
};

App.states.portia_end = {
	setup: function() {
		$('#-state-portia-end .button-back').button().
		click(function() {
			App.setState('intro');
		});
		$('#-state-portia-end .button-continue').
		button().click(function() {
			App.setState('portia_end_special');
		});

		App.styleStateScreen('#-state-portia-end');
		$('#-state-portia-end').hide();
	},

	draw: function() {
		image(App.media.sprites.bgs[0], 0, 0);
		image(App.media.sprites.portias[0],
			300, 50, 80, 80);
	},

	onEnter: function() {
		var special = App.load('portia-special-end');
		if (special) {
			$('#-state-portia-end .button-back').hide();
			$('#-state-portia-end .button-continue').show();
		}
		else {
			$('#-state-portia-end .button-back').show();
			$('#-state-portia-end .button-continue').hide();
		}

		$('#-state-portia-end').fadeIn();
	},

	onLeave: function() {
		return $('#-state-portia-end').
			fadeOut().promise();
	}
};

App.states.portia_end_special = {
	setup: function() {
		$('#-state-portia-end-special .button-back').
		button().click(function() {
			App.setState('intro');
		});

		App.styleStateScreen('#-state-portia-end-special');
		$('#-state-portia-end-special').hide();
	},

	draw: function() {
		image(App.media.sprites.bgs[1], 0, 0);
	},

	onEnter: function() {
		$('#-state-portia-end-special').fadeIn();
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
	hasDagger = hasDagger || false;
	image(App.media.sprites.room, 0, 0);
	image(App.media.sprites.chests[0], 64, 230);
	image(App.media.sprites.chests[2], 176, 230);
	image(App.media.sprites.chests[4], 288, 230);
	fill(255, 255, 255);
	if (hasDagger) {
		text("Choose a casket\n" +
			"but not the one with the dagger!", 200, 300); }
	else {
		text("Where is the portrait?", 200, 300); }
};

App.drawMainRoom2 = function() {
	image(App.media.sprites.room, 0, 0);
	image(App.media.sprites.chests[0], 101, 230);
	image(App.media.sprites.chests[2], 250, 230);
	fill(255, 255, 255);
	text("Where is the portrait?", 200, 300);
};

App.drawMainRoom3 = function() {
	image(App.media.sprites.room, 0, 0);
	image(App.media.sprites.chests[0], 64, 230);
	image(App.media.sprites.chests[2], 176, 230);
	image(App.media.sprites.chests[4], 288, 230);
	fill(255, 255, 255);
	text("Where is the portrait?", 200, 292);
	text("Who made each of the caskets?", 200, 332);
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

	$('.casket-buttons button').button();
	$('.menu-button').button();

	$('.backstory, .caskets, .room-info, input, select').
		addClass('ui-widget');

	$('.button-back').button({
		icons: { secondary: 'ui-icon-arrowreturnthick-1-w' }
	});

	$('.button-small-back').button({
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

	$('.guess-bad').dialog({
		modal: true,
		buttons: [
			{
				text: 'Back',
				click: function() {
					$(this).dialog('close');
				}
			}
		]
	});
	$('.guess-bad').dialog('close');

	$('.guess-good').dialog({
		modal: true,
		buttons: [
			{
				text: 'Continue',
				click: function() {
					$(this).dialog('close');
					App.solvedCallback();
				}
			}
		]
	});
	$('.guess-good').dialog('close');

	var name;
	for (name in App.states) {
		var state = App.states[name];
		if (_.isFunction(state.setup)) {
			state.setup();
		}
	}

	App.setState('portia_3_3_story');
	textAlign(CENTER, BASELINE);
};

App.onCasketChosen = function() {
	var boolVar = parseInt(this.value, 10);
	var result = App.evaluateGuess(
		1 << boolVar, 1 << boolVar);

	var dialogYes = '#-guess-correct';
	var dialogNo  = '#-guess-wrong';

	if (App.logic.dagger) {
		result = !result;
		dialogYes = '#-guess-dagger-correct';
		dialogNo  = '#-guess-dagger-wrong';
	}

	if (result) {
		$(dialogYes).dialog('open');
	}
	else {
		var count = parseInt(App.load('wrongCount'), 10);
		App.save('wrongCount', count + 1);
		$(dialogNo).dialog('open');
	}
};

App.onFinalSubmit = function() {
	var id = '#-state-portia-3-3-main';
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

	if (result) {
		$('#-guess-final-correct').dialog('open');
	}
	else {
		var count = parseInt(App.load('wrongCount'), 10);
		App.save('wrongCount', count + 1);
		$('#-guess-final-wrong').dialog('open');
	}
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
	$(divID + ' h1,' + divID + ' h2').css({
		textAlign: 'center'
	});
	$(divID + ' .button-gold').position({
		my: 'center bottom',
		at: 'left+88 bottom-25',
		of: divID
	});
	$(divID + ' .button-silver').position({
		my: 'center bottom',
		at: 'left+200 bottom-25',
		of: divID
	});
	$(divID + ' .button-lead').position({
		my: 'center bottom',
		at: 'right-88 bottom-25',
		of: divID
	});
	$(divID + ' .gold').position({
		my: 'left top',
		at: 'left+16 top+128',
		of: divID,
		collision: 'none'
	});
	$(divID + ' .silver').position({
		my: 'left top',
		at: 'left+144 top+128',
		of: divID,
		collision: 'none'
	});
	$(divID + ' .lead').position({
		my: 'left top',
		at: 'left+272 top+128',
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
	$(divID + ' h1,' + divID + ' h2').css({
		textAlign: 'center'
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
	$(divID + ' .gold').position({
		my: 'left top',
		at: 'left+58 top+128',
		of: divID,
		collision: 'none'
	});
	$(divID + ' .silver').position({
		my: 'left top',
		at: 'left+228 top+128',
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

App.setupRoom3 = function(divID) {
	$(divID + ' h1,' + divID + ' h2').css({
		textAlign: 'center'
	});
	$(divID + ' .radio-gold').position({
		my: 'center bottom',
		at: 'left+88 bottom-80',
		of: divID
	});
	$(divID + ' .radio-silver').position({
		my: 'center bottom',
		at: 'left+200 bottom-80',
		of: divID
	});
	$(divID + ' .radio-lead').position({
		my: 'center bottom',
		at: 'right-88 bottom-80',
		of: divID
	});
	$(divID + ' .select-gold').position({
		my: 'center bottom',
		at: 'left+88 bottom-36',
		of: divID
	});
	$(divID + ' .select-silver').position({
		my: 'center bottom',
		at: 'left+200 bottom-36',
		of: divID
	});
	$(divID + ' .select-lead').position({
		my: 'center bottom',
		at: 'right-88 bottom-36',
		of: divID
	});
	$(divID + ' .gold').position({
		my: 'left top',
		at: 'left+16 top+128',
		of: divID,
		collision: 'none'
	});
	$(divID + ' .silver').position({
		my: 'left top',
		at: 'left+144 top+128',
		of: divID,
		collision: 'none'
	});
	$(divID + ' .lead').position({
		my: 'left top',
		at: 'left+272 top+128',
		of: divID,
		collision: 'none'
	});

	$(divID + ' .button-submit').position({
		my: 'right bottom',
		at: 'right-8 bottom-8',
		of: divID
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

App.styleStateScreen = function(divID) {
	$(divID + ' .menu-button-div').position({
		my: 'center center',
		at: 'center center',
		of: divID,
		collision: 'none'
	});

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

App.unlock = function(puzzle) {
	var state = App.load(puzzle);
	if (state !== 'done') {
		App.save(puzzle, 'unlocked'); }
};

App.init = function() {
	var baseURL = 'http://localhost:3333/assets';

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
	$global.log('saveData');
	$global.cons.dir(App.saveData);

	var mamConfig = {
		images: {
			backgrounds: baseURL + '/img/backgrounds.jpg',
			chests: baseURL + '/img/chests.png',
			intro: baseURL + '/img/intro.jpg',
			menu: baseURL + '/img/menu.jpg',
			portraits: baseURL + '/img/portraits.jpg'
		},

		sprites: {
			bgs: {
				sheet: 'backgrounds',
				width: 400, height: 400,
				x: 0, y: 0,
				frames: 3
			},
			chests: {
				sheet: 'chests',
				width: 48, height: 48,
				x: 0, y: 0,
				frames: 6
			},
			room: {
				sheet: 'backgrounds',
				width: 400, height: 400,
				x: 0, y: 400
			},
			portias: {
				sheet: 'portraits',
				width: 160, height: 160,
				x: 0, y: 0,
				frames: 3
			}
		},

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
	textAlign(CENTER, CENTER);
	text("loading", 200, 200);
};


App.init();
