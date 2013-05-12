htmlUI = """
<div id="Frame">

<button id="Help" title="Display Help"></button>
<input id="Input" type="text"></input>
<div id="Formula"></div>
<div id="HelpDialog" title="Help">
  <p>
    Type in the chemical formula of an element or compound
    in the text field at the top-left. For example, try
    typing <em>H2O</em>, and the program will report back
    some useful information about it.
  </p>
  <p>
    You may use parentheses to group compounds. Whitespaces
	are ignored. Notice that formulas are case-sensitive, so
	make sure to use uppercase/lowercase letters
	accordingly.
  </p>
</div>
<div id="Tabs">
  <ul>
    <li><a href="#Elements"><span>Elements</span></a></li>
    <li><a href="#PubChem"><span>PubChem Query</span></a></li>
  </ul>
  <div id="Elements">
    <div id="ElementsContent">
      <table id="ElementTable">
        <thead>
          <tr>
            <th class="ele">Element</th>
            <th class="sym">Symbol</th>
            <th class="num">Molar mass</th>
            <th class="num">Atoms</th>
            <th class="num">Total molar mass</th>
          </tr>
        </thead>
        <tbody id="ElementTableBody">
        </tbody>
      </table>
      <div id="TotalMolarDiv">
        Total Molar Mass: <span id="TotalMolar"></span>
      </div>
    </div>
  </div>
  <div id="PubChem">
    <div id="PubChemActivateDiv">
      <div id="PubChemActivateText">
        To know a few more details about the formula
        <span id="PubChemFormula"></span>, press the button
        below, which will run a query against the
        <a href="http://pubchem.ncbi.nlm.nih.gov" target="_blank">PubChem</a> database.
      </div>
      <div>
        <button id="PubChemActivate">Run Query</button>
      </div>
    </div>
    <div id="PubChemRunning">
      <p>
        Running
        <img id="SpinnerImg"
         src="//googledrive.com/host/0BzcEQMWUa0znRE1wQU9KUGR2R2s/img/util/spinner.gif" />
      </p>
    </div>
    <div id="PubChemResults">
    </div>
  </div>
</div>

<div id="MessageDiv">
  <div id="Overlay"></div>
  <div id="Shadow"></div>
  <div id="Message">
    <p><strong>Formula not recognized</strong></p>
	<p><span id="MessageReason"></span></p>
  </div>
</div>

<div id="AudioElements"></div>

</div><!-- Frame -->
"""
