---
title: SVGLite Demo | KA CS
layout: default
nav:
  - name: Home
    url:  /
  - name: Programs
  - name: SVGLite Demo
---
section class: 'grid-container', ->
  div class: 'grid-100, program', ->
    img class: 'program-thumb', src: @getUrl '/img/programs/svglite-demo.png'
    h1 'SVGLite Demo'
    text """<p>A demonstration program for SVGLite, a JavaScript implementation for a small subset of SVG, a standard format for describing vector graphics.</p>
"""
    text @md '**Tags**: svg, demo, graphics, html, canvas'

    h2 'Summary'
    text """<p>Ideally, something like this should not be necessary at all,
because there are mechanisms that, at least in theory, are
meant to be straightforward ways of rendering SVG data on a
HTML canvas. These include the browser&#39;s own ability to
render SVG images and then draw them on a canvas using the
<code>drawImage</code> call, as well as some basic support for SVG
shapes in Processing.JS via the <code>PShape</code> type.</p>

<p>Unfortunately, both of these methods have their limitations.
The standard HTML approach doesn&#39;t work too well in Google
Chrome, for example, due to a strange bug that taints the
canvas when rendering data from a dynamically generated
<code>HTMLImage</code> element. On the other hand, using the <code>PShape</code>
type from P.JS is unreliable, as some basic things (like
e.g. the <code>fill-rule</code> attribute) are not supported; in
addition, PShapes can&#39;t be rendered to an off-screen canvas.</p>

<p>Because of this, I decided to simply implement the subset of
the SVG standard that I was interested in, supporting the
few things that I wanted in order to properly render some
simple SVG files. Hence, SVGLite was created.</p>

<p>It&#39;s very limited, as you&#39;d imagine, but at least it helped
me scratch my own itch :).</p>
"""

    h2 'Links'
    text """<ul>
<li><a href="http://www.khanacademy.org/cs/svglite-demo/1507692267">This program on Khan Academy</a></li>
<li><a href="https://github.com/lbv/ka-cs-programs/tree/master/svglite-demo">This program on GitHub</a></li>
<li><a href="http://openclipart.org/detail/100699/dark-blue-snowflakes-by-gem">Snowflake art</a></li>
<li><a href="http://openclipart.org/detail/176312/peace-dove-by-worker-176312">White dove art</a></li>
<li><a href="http://openclipart.org/detail/174372/jimi-by-caw-174372">Jimi Hendrix art</a></li>
</ul>
"""

    h2 'ChangeLog'
    text @md '**Current revision**: rev1'
    pre """

2013-03-31

    * First version of this program. Includes three
      graphics, testing different aspects of the SVG
      rendering: a snowflake, with transparency and
      'evenodd' fill-rule, a white dove over a blue circle,
      and the portrait of a famous musical genius.
"""

    h2 'To Do'
    text """<ul>
<li>Implement gradients, to be able to render some SVG icons.</li>
<li>Add widgets to control the demo.</li>
<li>Implement XML parsing.</li>
</ul>
"""