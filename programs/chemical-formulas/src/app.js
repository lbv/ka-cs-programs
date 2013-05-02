var App = {};

App.Templates = {
	elements : _.template(
		'<% _.each(elements, function(e) { %><tr>' +
		'<td class="ele"><%- e.name %></td>' +
		'<td class="sym"><%- e.symbol %></td>' +
		'<td class="num"><%- e.molar %></td>' +
		'<td class="num"><%- e.atoms %></td>' +
		'<td class="num"><%- e.total %></td>' +
		'</tr><% }); %>')
};

App.updateElementsHtml = function(comp) {
	var sortElementsBy = function(symbol) {
		return Elements[symbol][2];
	};
	var sorted = _.sortBy(_.keys(comp), sortElementsBy);
	var i, len = sorted.length;
	var totalMolar = 0;
	var elements = [];
	for (i = 0; i < len; ++i) {
		var symbol = sorted[i];
		var info   = Elements[symbol];
		elements.push({
			name   : info[0],
			symbol : symbol,
			molar  : info[1].toFixed(2),
			atoms  : comp[symbol],
			total  : (comp[symbol] * info[1]).toFixed(2)
		});
		totalMolar += comp[symbol] * info[1];
	}
	var html = App.Templates.elements(
		{ elements: elements });
	$('#ElementTableBody').html(html);
	App.updateStyles();
	$('#TotalMolar').html(totalMolar.toFixed(2));
};

App.updateData = function() {
	var fStr = App.formula.toString();
	if (fStr === App.formulaStr) { return; }

	App.formulaStr  = fStr;
	App.formulaHtml = App.formula.toHtml();
	$('#Formula').html(App.formulaHtml);

	var comp = App.formula.getComposition();
	App.updateElementsHtml(comp);
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

App.updateStyles = function() {
	$('#ElementTable th, #ElementTable td').css({
		padding: '4px'
	});
	$('#ElementTable td.ele').css({ textAlign : 'left' });
	$('#ElementTable .ele').css({ width : '32%' });
	$('#ElementTable .sym').css({
		textAlign : 'center',
		width     : '17%'
	});
	$('#ElementTable td.num').css({ textAlign: 'right' });
	$('#ElementTable num').css({ width: '17%' });
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

	$('#Tabs').tabs().css({
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

	$('#ElementTable').css({
		borderCollapse : 'collapse',
		border         : '1px solid #babdb6'
	});
	$('#ElementTable th').css({
		border         : '1px solid #babdb6',
		textAlign      : 'center',
		padding        : '4px'
	});
	$('#TotalMolarDiv').position({
		my : 'left bottom',
		at : 'left+16 bottom',
		of : '#Elements'
	});

	App.updateStyles();
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
