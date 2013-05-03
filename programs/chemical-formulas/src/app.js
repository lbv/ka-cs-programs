var App = {};

App.Templates = {
	elements : _.template(
		'<% _.each(elements, function(e) { %><tr>' +
		'<td class="ele"><%= e.name %></td>' +
		'<td class="sym"><%- e.symbol %></td>' +
		'<td class="num"><%- e.molar %></td>' +
		'<td class="num"><%- e.atoms %></td>' +
		'<td class="num"><%- e.total %></td>' +
		'</tr><% }); %>'),

	audioSpan : _.template(
		'<%- str %><span id="<%= id %>"></span>'),

	audioElement : _.template(
		'<audio id="<%= id %>" src="<%= src %>" />'),

	ttsUrl : _.template(
		'http://tts-api.com/tts.mp3?q=<%= q %>'),

	pubChemUrl : _.template(
		'http://pubchem.ncbi.nlm.nih.gov/rest/pug/' +
		'compound/formula/<%= formula %>/JSON'),

	pubChemUrl2 : _.template(
		'http://pubchem.ncbi.nlm.nih.gov/rest/pug/' +
		'compound/listkey/<%= key %>/cids/JSON'),

	pubChemSynUrl : _.template(
		'http://pubchem.ncbi.nlm.nih.gov/rest/pug/' +
		'compound/cid/<%= cid %>/synonyms/JSON'),

	pubChemPropUrl : _.template(
		'http://pubchem.ncbi.nlm.nih.gov/rest/pug/' +
		'compound/cid/<%= cid %>/property/' +
		'MolecularFormula,MolecularWeight,' +
		'ExactMass,Charge/JSON'),

	pubChemPngUrl : _.template(
		'http://pubchem.ncbi.nlm.nih.gov/rest/pug/' +
		'compound/cid/<%= cid %>/PNG'),

	pubChemNoResults : _.template(
		'<p>No results found for the chemical formula ' +
		'<%= formula %></p>'),

	pubChemResults : _.template(
		'<h3>Basic Information</h3>' +
		'<table><tr><th>Molecular Formula</th>' +
		'<td><%- prop.MolecularFormula %></td></tr>' +
		'<tr><th>Molecular Weight</th>' +
		'<td><%- prop.MolecularWeight %></td></tr>' +
		'<tr><th>Exact Mass</th>' +
		'<td><%- prop.ExactMass %></td></tr>' +
		'<tr><th>Charge</th>' +
		'<td><%- prop.Charge %></td></tr></table>' +
		'<h3>Synonyms</h3>' +
		'<ul><% _.each(synonyms, function(s) { %>' +
		'<li><%- s %></li>' +
		'<% }); %></ul>' +
		'<h3>Image of Molecule</h3>' +
		'<img src="http://pubchem.ncbi.nlm.nih.gov/rest/' +
		'pug/compound/cid/<%= cid %>/PNG" />')
};

App.PubChemCache = {};
App.AudioCache   = {};

App.AudioCount     = 0;
App.AudioSpanCount = 0;


App.audioString = function(str) {
	var spanId = 'AudioSpan' +
		App.AudioSpanCount.toString();
	++App.AudioSpanCount;

	var html = App.Templates.audioSpan({
		str : str,
		id  : spanId
	});

	if (App.AudioCache[str] === undefined) {
		var audioId = 'Audio' + App.AudioCount.toString();
		++App.AudioCount;

		var encoded = $G.get('encodeURIComponent')(str);
		var url = App.Templates.ttsUrl({ q: encoded });
		var audioHtml = App.Templates.audioElement({
			id  : audioId,
			src : url
		});

		var dfd   = new $.Deferred();
		var audio = $(audioHtml);

		audio.on('canplay', function() {
			dfd.resolve(audio);
		});
		$('#AudioElements').append(audio);
		App.AudioCache[str] = dfd.promise();
	}

	var audioDfd = App.AudioCache[str];
	var attachAudio = function() {
		audioDfd.then(function(data) {
			$('#' + spanId).button({
				icons: { primary: 'ui-icon-volume-on' },
				text: false
			}).css({
				height : '16px'
			}).click(function() { data[0].play(); });
		});
	};

	var retObj = {
		html: html,
		func: attachAudio
	};
	return retObj;
};

App.updateElementsHtml = function(comp) {
	var sortElementsBy = function(symbol) {
		return Elements[symbol][2];
	};
	var sorted = _.sortBy(_.keys(comp), sortElementsBy);
	var i, len = sorted.length;
	var totalMolar = 0;
	var elements = [];
	var cbs      = [];
	for (i = 0; i < len; ++i) {
		var symbol = sorted[i];
		var info   = Elements[symbol];
		var audio  = App.audioString(info[0]);
		cbs.push(audio.func);
		elements.push({
			name   : audio.html,
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
	$('#TotalMolar').html(totalMolar.toFixed(2));
	App.updateStyles();

	len = cbs.length;
	for (i = 0; i < len; ++i) {
		cbs[i].call(); }
};

App.updateData = function() {
	var fStr = App.formula.toString();
	if (fStr === App.formulaStr) { return; }

	App.formulaStr  = fStr;
	App.formulaHtml = App.formula.toHtml();
	$('#Formula').html(App.formulaHtml);

	var comp = App.formula.getComposition();
	App.updateElementsHtml(comp);

	if (fStr !== "") {
		$('#PubChemFormula').html(App.formulaHtml);

		if (App.PubChemCache[App.formulaStr]) {
			$('#PubChemActivateDiv').fadeOut();
			$('#PubChemResults').fadeIn().html(
				App.PubChemCache[App.formulaStr]);
		}
		else {
			$('#PubChemResults').fadeOut();
			$('#PubChemActivateDiv').fadeIn();
		}
	}

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

App.onPubChemQuery3 = function(synData, propData) {
	var prop = propData[0].PropertyTable.Properties[0];
	var syn = [];
	var synList = synData[0].InformationList.Information[0]
		.Synonym;
	var i, len = min(3, synList.length);
	for (i = 0; i < len; ++i) {
		syn.push(synList[i]); }

	var html = App.Templates.pubChemResults({
		prop     : prop,
		cid      : prop.CID,
		synonyms : syn
	});
	App.PubChemCache[App.formulaStr] = html;
	$('#PubChemRunning').fadeOut();
	$('#PubChemResults').fadeIn().html(html);
};

App.onPubChemQuery2 = function(data) {
	if (data.IdentifierList === undefined) {
		$G.get('setTimeout')(App.runPubChemQ2, 3000);
		return;
	}

	if (data.IdentifierList.CID.length === 0) {
		var html = App.Templates.pubChemNoResults({
			formula : App.formulaHtml });
		App.PubChemCache[App.formulaStr] = html;
		$('#PubChemRunning').fadeOut();
		$('#PubChemResults').fadeIn().html(html);
		return;
	}

	var cid = data.IdentifierList.CID[0];
	var urlSyn = App.Templates.pubChemSynUrl(
		{ cid : cid });
	var urlProp = App.Templates.pubChemPropUrl(
		{ cid : cid });
	$.when($.getJSON(urlSyn), $.getJSON(urlProp)).
		done(App.onPubChemQuery3);
};

App.runPubChemQ2 = function() {
	var url = App.Templates.pubChemUrl2(
		{ key : App.PubChemKey });
	$.getJSON(url, App.onPubChemQuery2);
};

App.onPubChemQuery = function(data) {
	App.PubChemKey = data.Waiting.ListKey;
	$G.get('setTimeout')(App.runPubChemQ2, 3000);
};

App.runPubChemQuery = function() {
	$('#PubChemActivateDiv').hide();
	$('#PubChemRunning').fadeIn();

	var url = App.Templates.pubChemUrl(
		{ formula: App.formulaStr });
	$.getJSON(url, App.onPubChemQuery);
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

	if (App.formulaStr !== '') {
		$('#ElementsContent').fadeIn(); }
};

App.buildUI = function() {
	$('body').css({
		fontSize : '11px'
	});
	$('input').addClass("ui-widget ui-corner-all");

	$('#Frame').css({
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
		fontSize : '16px',
		height   : '22px',
		width    : '172px'
	}).position({
		my : 'left top',
		at : 'left+8 top+8',
		of : '#Frame'
	}).keyup(App.onInputChange);

	$('#Formula').css({
		paddingTop : '2px',
		textAlign  : 'center',
		fontWeight : 'bold',
		fontSize   : '16px',
		width      : '168px',
		height     : '24px'
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

	$('#Tabs').css({
		width    : '378px',
		height   : '340px'
	}).position({
		my : 'left top',
		at : 'left bottom+16',
		of : '#Input'
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
		backgroundColor : '#ffffff',
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
	$('#TotalMolarDiv').css({
		marginTop : '16px'
	}).position({
		my : 'left bottom',
		at : 'left bottom',
		of : '#Elements'
	});

	$('#PubChem').css({
		height    : '270px',
		overflowY : 'auto'
	});

	$('#PubChemActivateDiv').css({
		width  : '200px',
		height : '200px'
	}).position({
		my : 'center center',
		at : 'center center',
		of : '#PubChem'
	});

	$('#PubChemActivate').button().position({
		my : 'center top',
		at : 'center bottom+32',
		of : '#PubChemActivateText'
	}).click(App.runPubChemQuery);
	
	$('#PubChemRunning').css({
		textAlign  : 'center',
		fontWeight : 'bold',
		width      : '120px',
		padding    : '16px'
	}).
	addClass('ui-widget ui-state-highlight ui-corner-all');

	$('#ElementsContent').hide();
	$('#PubChemActivateDiv').hide();
	$('#PubChemRunning').hide();
	$('#Tabs').tabs();

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
