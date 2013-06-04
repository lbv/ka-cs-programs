App.states.extras = stateScaffold(
	'#-state-extras', 0, 'intro', 'intro', {
		setup: function() {
			$('#-extras-info').dialog({
				buttons: [ {
					text: 'Close',
					click: function() {
						$(this).dialog('close'); }
				} ]
			}).dialog('close');

			$('#-state-extras .button-info').button({
				text: false,
				icons: { primary: 'ui-icon-info' }
			}).click(function() {
				$('#-extras-info').dialog('open');
			});

			$('#-state-extras .button-info').position({
				my: 'right top',
				at: 'right-8 top+8',
				of: '#-state-extras',
				collision: 'none'
			});

			$('#-button-extras-1').button().click(function() {
				App.setState('extras_1');
			});
			$('#-button-extras-2').button().click(function() {
				App.setState('extras_2');
			});
		}
	});

App.states.extras_1 = stateScaffold(
	'#-state-extras-1', 2, 'extras', '');
App.states.extras_2 = stateScaffold(
	'#-state-extras-2', 2, 'extras', '');
