htmlUI = """
<div id="Frame">

<div id="Intro">
  <h2>Image2Code</h2>
  <p>
    A simple utility that receives an image file, and turns it
    into JavaScript code that you can use directly in your
    Khan Academy programs.
  </p>
  <h3>But before you continue &hellip;</h3>
  <p>
    &hellip; I'd like to invite you to take a few moments to
    reflect upon the decisions you take every day, including
    the decision of whether to use this program or not, and
    how to use it.
  </p>
  <p>
    A wise man once said, <q>A man is but the product of his
    thoughts. What he thinks, he becomes.</q>
  </p>
  <p>
    May you act based on the voice from within your heart,
    and seek to rise up, bringing the world around you
    upwards with you.
  </p>
  <button id="Continue">Continue</button>
</div>

<div id="Main">
  <div id="MainDesc">
    <h2>Image2Code</h2>
    <p>
      Choose an <em>Identifier</em>, and an image from your
      computer to convert into code.
    </p>
    <p>
      The identifier is a string that will be used in the
      generated code, as part of the name of a function that
      will load your image. For example, if you use
      <strong>MyImage</strong> as the identifier, then the
      generated code will include a function called
      <code>loadMyImage</code>.
    </p>
    <p>
      It is recommended that you use an image in JPG, PNG or
      GIF format, with a size of at most 40KB (the smaller,
      the better).
    </p>
  </div>
  <table>
    <tr>
      <th>Identifier</th>
      <td><input type="text" id="ImgId" /></td>
    </tr>
    <tr>
      <th>Image File</th>
      <td><input type="file" id="FileInput" /></td>
    </tr>
  </table>
  <div id="IdError">
    You must use only letters, numbers, or the underline
    symbol (<code>_</code>) in the identifier.
  </div>

  <div id="FileReady">
    <p>
      Your code for <span id="SpanId"></span> is ready.
    </p>

    <div id="DownloadDiv">
      <p>
        You may press the button below to download it, and
        then open it with a text editor.
      </p>
      <button id="Download">Download Code</button>
      <p>
        Or&hellip;
      </p>
    </div>

    <div>
      <p>
        You may press the button below, and the code should
        show up in a <span>n</span>ew window or tab in your
        browser. You can then select it and copy it.
      </p>
      <button id="Open">Open Code</button>
    </div>

    <p>
      You'll find the generated function and a short
      explanation on how to use it towards the end.
    </p>
  </div>
</div>

</div><!-- Frame -->
"""
