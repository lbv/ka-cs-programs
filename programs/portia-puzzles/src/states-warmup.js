App.states.warmup = {
	setup: function() {
		$('#-state-warmup .button-back').button().
		click(function() {
			App.setState('intro');
		});

		$('#-button-warmup-1').button().click(function() {
			App.setState('warmup_1_story');
		});
		$('#-button-warmup-2').button().click(function() {
			App.setState('warmup_2_story');
		});
		$('#-button-warmup-3').button().click(function() {
			App.setState('warmup_3_story');
		});

		App.styleStateScreen('#-state-warmup');
		$('#-state-warmup').hide();
	},

	draw: function() {
		image(App.media.sprites.abstract[0], 200, 200);
	},

	onEnter: function() {
		App.styleButton(
			'#-button-warmup-1', 'warmup-1', true);
		App.styleButton('#-button-warmup-2', 'warmup-2');
		App.styleButton('#-button-warmup-3', 'warmup-3');

		$('#-state-warmup').fadeIn();
	},

	onLeave: function() {
		return $('#-state-warmup').fadeOut().promise();
	}
};

var warmUpScaffold = function(id, bg, prev, next, extra) {
	extra = extra || {};
	return  {
		setup: function() {
			if (extra.setup) { extra.setup(); }
			$(id + ' .button-back').button().
			click(function() {
				App.setState(prev);
			});
			$(id + ' .button-continue').
			button().click(function() {
				App.setState(next);
			});

			App.styleStateScreen(id);
			$(id).hide();
		},

		draw: function() {
			image(App.media.sprites.abstract[bg], 200, 200);
		},

		onEnter: function() {
			$(id).fadeIn();
		},

		onLeave: function() {
			return $(id).fadeOut().promise();
		}
	};
};


App.states.warmup_1_story = warmUpScaffold(
	'#-state-warmup-1-story', 1, 'warmup', 'warmup_1a');

App.states.warmup_1a = warmUpScaffold(
	'#-state-warmup-1a', 2, 'warmup_1_story', 'warmup_1b');
App.states.warmup_1b = warmUpScaffold(
	'#-state-warmup-1b', 2, 'warmup_1a', 'warmup_1c');
App.states.warmup_1c = warmUpScaffold(
	'#-state-warmup-1c', 2, 'warmup_1b', 'warmup_1d');
App.states.warmup_1d = warmUpScaffold(
	'#-state-warmup-1d', 2, 'warmup_1c', 'warmup', {
		setup: function() {
			$('#-state-warmup-1d .button-continue').
			button().click(function() {
				App.save('warmup-1', 'done');
				App.unlock('warmup-2');
			});
		}
	});

App.states.warmup_2_story = warmUpScaffold(
	'#-state-warmup-2-story', 1, 'warmup', 'warmup_2a');

App.states.warmup_2a = warmUpScaffold(
	'#-state-warmup-2a', 2, 'warmup_2_story', 'warmup_2b');
App.states.warmup_2b = warmUpScaffold(
	'#-state-warmup-2b', 2, 'warmup_2a', 'warmup_2c');
App.states.warmup_2c = warmUpScaffold(
	'#-state-warmup-2c', 2, 'warmup_2b', 'warmup', {
		setup: function() {
			$('#-state-warmup-2c .button-continue').
			button().click(function() {
				App.save('warmup-2', 'done');
				App.unlock('warmup-3');
			});
		}
	});

App.states.warmup_3_story = warmUpScaffold(
	'#-state-warmup-3-story', 1, 'warmup', 'warmup_3a');

App.states.warmup_3a = warmUpScaffold(
	'#-state-warmup-3a', 2, 'warmup_3_story', 'warmup_3b');
App.states.warmup_3b = warmUpScaffold(
	'#-state-warmup-3b', 2, 'warmup_3a', 'warmup_3c');
App.states.warmup_3c = warmUpScaffold(
	'#-state-warmup-3c', 2, 'warmup_3b', 'warmup_end', {
		setup: function() {
			$('#-state-warmup-3c .button-continue').
			button().click(function() {
				App.save('warmup-3', 'done');
			});
		}
	});

App.states.warmup_end = warmUpScaffold(
	'#-state-warmup-end', 3, 'intro', 'intro');
