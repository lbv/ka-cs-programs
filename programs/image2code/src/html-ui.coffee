htmlUI = """
<div id="Frame">

<div id="Intro">
  <h2>Image2Code</h2>
  <p>
    A simple utility that receives an image file, and turns it
    into JavaScript code that you can use directly in your
    Khan Academy programs.
  </p>
  <h3>A short message..</h3>
  <p>
    A bloo bloo.
  </p>
  <button id="Continue">Continue</button>
</div>

<div id="Main">
  <div id="MainDesc">
    <p>
      Choose an <em>Identifier</em>, and an image from your
      computer to convert into code.
    </p>
    <p>
      The identifier is a string that will be used
      in the generated code to refer to a function that
      will give you your image. For example, if you use
      <strong>MyImage</strong> as the identifier, then the
      generated code will include a function called
      <code>getMyImage</code> which will return your image.
      You should use only letters, numbers, or the underline
      symbol (<code>_</code>) in the identifier.
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
  <div id="DownloadDiv">
    <p>
      Your code for <span id="SpanId"></span> is ready.
    </p>
    <button id="Download">Download Code</button>
  </div>
</div>

</div><!-- Frame -->
"""
