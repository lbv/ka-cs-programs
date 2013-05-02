htmlUI = """
<div id="Frame">

<button id="Help" title="Display Help"></button>
<input id="Input" type="text"></input>
<div id="Formula"></div>
<div id="HelpDialog" title="Help">
  <p>
    Type in the chemical formula of an element or compound
    in the text field at the top. For example, try typing
    <em>H20</em>, and the program will report back some
    useful information about it.
  </p>
  <p>
    You may use parentheses to group compounds. Whitespaces
	are ignored.
  </p>
</div>
<div id="Tabs">
  <ul>
    <li><a href="#Elements"><span>Elements</span></a></li>
    <li><a href="#PubChem"><span>PubChem Query</span></a></li>
  </ul>
  <div id="Elements">
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
      Total Molar Mass:
      <span id="TotalMolar"></span>
    </div>
  </div>
  <div id="PubChem">
    Nom!
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

</div><!-- Frame -->
"""
