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
		image(App.media.sprites.abstract[1], 200, 200);
		image(App.media.images.frame, 50, 96, 84, 99);
		image(App.media.sprites.portias[0],
			50, 96, 62, 76);
		image(App.media.sprites.chests[0], 50, 190, 48, 48);
		image(App.media.sprites.chests[1], 50, 256, 48, 48);
		image(App.media.sprites.chests[2], 50, 322, 48, 48);
	},

	onEnter: function() {
		$('#-state-portia-1-1-story').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-1-1-story').
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
		image(App.media.sprites.abstract[1], 200, 200);
		image(App.media.images.frame, 50, 180, 84, 99);
		image(App.media.sprites.portias[0],
			50, 180, 62, 76);
	},

	onEnter: function() {
		$('#-state-portia-1-2-story').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-1-2-story').
			fadeOut().promise();
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
		image(App.media.sprites.abstract[1], 200, 200);
		image(App.media.images.frame, 50, 160, 84, 99);
		image(App.media.sprites.portias[1],
			50, 160, 62, 76);
	},

	onEnter: function() {
		$('#-state-portia-2-1-story').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-2-1-story').
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
		image(App.media.sprites.abstract[1], 200, 200);
		image(App.media.images.frame, 50, 160, 84, 99);
		image(App.media.sprites.portias[1],
			50, 160, 62, 76);
	},

	onEnter: function() {
		$('#-state-portia-2-2-story').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-2-2-story').
			fadeOut().promise();
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
		image(App.media.sprites.abstract[1], 200, 200);
		image(App.media.images.frame, 50, 116, 84, 99);
		image(App.media.sprites.portias[2],
			50, 116, 62, 76);
		image(App.media.images.dagger, 50, 250, 80, 56);
	},

	onEnter: function() {
		$('#-state-portia-3-1-story').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-3-1-story').
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
		image(App.media.sprites.abstract[1], 200, 200);
		image(App.media.images.frame, 50, 96, 84, 99);
		image(App.media.sprites.portias[2],
			50, 96, 62, 76);
		image(App.media.sprites.chests[0], 50, 190, 48, 48);
		image(App.media.sprites.chests[1], 50, 256, 48, 48);
	},

	onEnter: function() {
		$('#-state-portia-3-2-story').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-3-2-story').
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
		image(App.media.sprites.abstract[1], 200, 200);
		image(App.media.images.frame, 50, 96, 84, 99);
		image(App.media.sprites.portias[2],
			50, 96, 62, 76);
	},

	onEnter: function() {
		$('#-state-portia-3-3-story').fadeIn(1600);
	},

	onLeave: function() {
		return $('#-state-portia-3-3-story').
			fadeOut().promise();
	}
};

