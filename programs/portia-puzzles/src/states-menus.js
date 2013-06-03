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
		image(App.media.sprites.menu, 200, 200);
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
		image(App.media.sprites.menu, 200, 200);
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
		image(App.media.sprites.menu, 200, 200);
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
		image(App.media.sprites.menu, 200, 200);
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
