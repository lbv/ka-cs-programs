---
title: Snowman II
layout: default
nav:
  - name: Home
    url:  /
  - name: Programs
  - name: Snowman II
---
section class: 'grid-100, program', ->
  img class: 'program-thumb', src: @getUrl '/img/programs/snowman-ii.png'
  h1 'Snowman II'
  text """<p>Spin-off of the official &ldquo;Snowman&rdquo; program. It adds falling snowflakes, and control of the snowman with the keyboard.</p>
"""
  text @md '**Tags**: snowman, drawing, keyboard'

  h2 'Summary'
  text """<p>This program was originally created to test a few things
from the programming platform, and has been adapted to reuse
some JavaScript components in the process. Because of this,
it includes a few features that may not be very
beginner-friendly.</p>

<p>Still, I hope you have fun looking at the code, and by
taking your time with it, I&#39;m sure you could find
interesting ways to tweak it :).</p>
"""

  h2 'Links'
  text """<ul>
<li><a href="http://www.khanacademy.org/cs/snowman-ii/1444744956">This program on Khan Academy</a></li>
<li><a href="https://github.com/lbv/ka-cs-programs/tree/master/snowman-ii">This program on GitHub</a></li>
<li><a href="http://openclipart.org/detail/100699/dark-blue-snowflakes-by-gem">Snowflake art</a></li>
<li><a href="http://www.khanacademy.org/cs/snowman/823735629">Original Snowman program</a></li>
</ul>
"""

  h2 'ChangeLog'
  text @md """
**Current revision**: rev2

```no-highlight
2013-04-07

    * Improved many of the components that this program
      depends on. Fixed movement of snowman, so that all
      of his jumps are consistent. Changed the appearance
      of snowflakes to SVG images.

2013-03-08

    * First version of this program.

```
"""

  h2 'To Do'
  text """<ul>
<li>Add better motion effects to the snowman pieces, based on the ParticleSystem.</li>
</ul>
"""