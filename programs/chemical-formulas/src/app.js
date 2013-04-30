var App = {};

App.updateData = function() {
	var fStr = App.formula.toString();
	if (fStr === App.formulaStr) { return; }

	App.formulaStr  = fStr;
	App.formulaHtml = App.formula.toHtml();
	$('#Formula').html(App.formulaHtml);
	var comp = App.formula.getComposition();
	var table = '';
};

App.onInputChange = function() {
	var val = this.value;
	var f;
	try {
		f = App.parser.parse(val);
	}
	catch (msg) {
		$('#MessageReason').html(msg);
		$('#MessageDiv').fadeIn();
		return;
	}
	$('#MessageDiv').fadeOut();
	App.formula = f;
	App.updateData();
};

App.buildUI = function() {
	$('body').css({
		'font-size' : '11px'
	});
	$('input').addClass("ui-widget ui-corner-all");

	$('#Frame').css({
		'position' : 'absolute',
		'width'  : '400px',
		'height' : '400px'
	}).position({
		my : 'left top',
		at : 'left top',
		of : '#output'
	});

	$('#Help').button({
		icons: { primary: 'ui-icon-help' },
		text: false
	}).
	tooltip({
		position : {
			my : 'right top',
			at : 'right bottom+2'
		}
	}).css({
		'width'  : '24px',
		'height' : '24px'
	}).position({
		my : 'right top',
		at : 'right-8 top+8',
		of : '#Frame'
	});

	$('#Input').css({
		'font-size' : '16px',
		'height'    : '22px',
		'width'     : '172px'
	}).position({
		my : 'left top',
		at : 'left+8 top+8',
		of : '#Frame'
	}).keyup(App.onInputChange);

	$('#Formula').css({
		'padding-top' : '2px',
		'text-align' : 'center',
		'font-weight' : 'bold',
		'font-size' : '16px',
		'width'  : '168px',
		'height' : '24px'
	}).
	addClass('ui-widget ui-state-highlight ui-corner-all').
	position({
		my : 'left top',
		at : 'right+8 top',
		of : '#Input'
	});

	$('#HelpDialog').dialog({
		autoOpen : false,
		position : {
			my : 'center center',
			at : 'center center',
			of : '#Frame'
		}
	});

	$('#Help').click(function() {
		$('#HelpDialog').dialog('open');
	});

	$('#Tabs').tabs({
		disabled : [ 2 ]
	}).css({
		'position' : 'absolute',
		'width'  : '378px',
		'height' : '340px'
	}).position({
		my : 'left top',
		at : 'left+8 top+48',
		of : '#Frame'
	});

	$('#MessageDiv').css({
		height : '352px',
		width  : '400px'
	}).position({
		my : 'left bottom',
		at : 'left bottom',
		of : '#Frame'
	});

	$('#Overlay').css({
		'width'  : '400px',
		'height' : '352px'
	}).addClass('ui-widget-overlay').
	position({
		my : 'left top',
		at : 'left top',
		of : '#MessageDiv'
	});

	$('#Shadow').css({
		width  : '300px',
		height : '180px'
	}).addClass('ui-widget-shadow').
	position({
		my : 'center center',
		at : 'center+8 center+8',
		of : '#MessageDiv'
	});

	$('#Message').css({
		width  : '300px',
		height : '180px',
		'background-color' : '#ffffff',
		border  : 'solid 1px #babdb6',
		padding : '8px'
	}).addClass('ui-widget ui-corner-all').
	position({
		my : 'center center',
		at : 'center center',
		of : '#MessageDiv'
	});

	$('#MessageDiv').hide();
};

App.init = function() {
	App.formula     = null;
	App.formulaStr  = '';
	App.formulaHtml = '';
	App.parser      = new ChemParser();

	$G.insertHtml(htmlUI);
	$G.loadJQueryUI(App.buildUI, 'humanity');
};

App.init();
