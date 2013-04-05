---
title: Grabbing Pieces of the Canvas
layout: default
description: >
  How to capture sections of the canvas as separate images.
nav:
  - name: Home
    url:  /
  - name: Tutorials
  - name: Grabbing pieces of the canvas
---
# Grabbing Pieces of the Canvas #

## Summary ##

Describes a simple technique to *capture* rectangular portions of the
_canvas_ (the region where your program gets drawn), and then reuse them
anytime you want, improving the overall efficiency of your program in the
process.

## The problem ##

Processing.JS, used in all Khan Academy programs, is a graphical
environment, which means that whatever is being displayed on the canvas is
quite important for a lot of programs.

Imagine that you render a pretty drawing over some region of the canvas, and
you'd like to reuse it, drawing it one or more times all over the canvas.
You could try replicating the sequence of instructions that created the
original image, only changing the coordinates of your commands so the image
is recreated in another location. Or you could use the *transformation*
operations (like {{{pjsRef 'translate_'}}}) to help you with this. However,
as you can imagine, this can quickly get out of hand, not to mention that
your code is executing the same individual drawing operations over and over.

This means that if you use a lot of basic shapes to compose you images, your
program could start to feel sluggish, especially when you animate things,
typically from the {{{pjsRef 'draw_'}}} function. Wouldn't it be nicer if
you could draw something once, and then *store* it somehow, and reuse it
without having to render every component individually again? Well, it
shouldn't be much of a surprise that this is indeed possible. But let's talk
about a couple of important concepts first.

## Processing.JS and the HTML canvas ##

As you may already know, [Processing.JS](http://processingjs.org/) is a
*spin-off* (so to speak), of a project called (unsurprisingly)
[Processing](http://processing.org/). The original Processing environment
was developed in Java, and runs on top of whatever graphics capabilities are
available on a somewhat low--level of the system. That is, it provides a lot
of power through its interaction with elements like accelerated 3D,
different 2D renderers and more. Processing.JS, on the other hand, is an
adaptation of the same environment, but specifically designed to run on top
of web browsers. This is the reason, by the way, why P.JS has many
limitations that are not present on the original Processing environment, and
sometimes you find things in its documentation page that don't seem to work
as described.

Anyway, if P.JS isn't communicating directly with the components of the
system that provide most of the graphical capabilities, then how does it
work? The answer is that it does most of its work through a very powerful,
and relatively recent element that is now part of modern web browsers: the
[HTML canvas](http://en.wikipedia.org/wiki/Canvas_element).

This canvas is at the core of Processing.JS, and on top of that other
components are built. This includes abstractions from the original
Processing environment. As part of these abstractions, P.JS includes "data
types" such as {{{pjsRef 'PShape'}}}, {{{pjsRef 'PImage'}}} and {{{pjsRef
'PGraphics'}}}.

Each of these data types has its purpose and uses, so it doesn't hurt to get
familiar with them, although many of their internal details are not very
important. What is important is to have some intuition about what they
provide, so let's go briefly over them:

* Let's start with `PGraphics`; this is simply an area where you can draw.
  The main Processing.JS canvas (not to be confused with the HTML canvas)
  provides the interface of a `PGraphics`, for example. You can do things
  like draw lines, ellipses, rectangles, etc. on a `PGraphics`. However,
  you're not limited to only one `PGraphics`, you can create your own (with
  {{{pjsRef 'createGraphics_'}}}) and then draw stuff over it, without
  showing it on the real canvas until the moment you choose to display it.
  This would be an example of what is called as an "off--screen" canvas.

* A `PImage` is much simpler. It just represents an area of pixels. You can
  interact with the individual pixels, put you can't directly "draw" on top
  of them, as you can with a `PGraphics` object. Its main advantage is that,
  done correctly, operating on the raw pixels can be quite fast, and
  rendering a `PImage` is much more efficient that drawing basic shapes on
  top of a `PGraphics`.  If you have used the
  [`getImage`](http://www.khanacademy.org/cs/imageimage-x-y/937672662)
  function (only available as a Khan Academy--specific extension), then you
  have used a `PImage`.

* A `PShape` is basically a mechanism provided by Processing.JS to render
  [SVG](http://en.wikipedia.org/wiki/Scalable_Vector_Graphics) images. It
  has its own set of quirks and limitations, though, so it doesn't get much
  use in practice.

Anyway, something very useful to keep in mind, is that all of these things
are really built on top of a HTML Canvas in P.JS. The main reason why this
is useful is because once you get to that lower--level, you can use all the
[API](http://www.w3schools.com/tags/ref_canvas.asp) from the HTML Canvas,
which is really useful. Hopefully this will be clearer soon.

## Putting it together ##

Getting back to our original problem (how to capture pieces of the canvas),
here's one way in which we can do this:

* Start by creating a `PImage`, with {{{pjsRef 'createImage_'}}}.
* Obtain the internal HTML canvas from the `PImage`. This can be done
  through a property called `sourceImg` in the `PImage` object.
* Grab the pixel information from a rectangular region of the real canvas.
  This can be done with a function called `toImageData` (not documented,
  apparently).
* Put that pixel data in our `PImage`, which will act as an off--screen
  buffer.
* That's it. Now we can draw the `PImage` any time we want with the `image`
  function.

Let's see how it works on a real example:

{{{kaExample 'How to grab pieces of the canvas'
'http://www.khanacademy.org/cs/example-how-to-grab-pieces-of-the-canvas/1480182631'}}}

``` javascript
//
// We'll create a matrix of 4x4 squares, and grab each
// little square as a single image
//

// length of one side from a little square
var side = 30;

// location of the matrix of squares
var top  = 20;
var left = 140;

var pieces  = [];
var nPieces = 0;

// variables to control animation
var radius = 70;
var angle  = 0;

// Draws the main matrix
var drawMainPicture = function() {
	stroke(173, 127, 168);
	strokeWeight(2);

	var number = 1;

	textAlign(CENTER, CENTER);
	for (var i = 0; i < 4; ++i) {
		for (var j = 0; j < 4; ++j) {
			var x = left + j * side;
			var y = top + i * side;
			fill(92, 53, 102);
			rect(x, y, side, side);

			var nText = number.toString();

			x = x + (side / 2);
			y = y + (side / 2);
			fill(255, 255, 255);
			text(nText, x, y);

			++number;
		}
	}
};

// Grabs a rectangle from the canvas, and returns it as
// a `PImage`
var grabImage = function(x, y, imgWidth, imgHeight) {
	var img = createImage(imgWidth, imgHeight, ARGB);
	var ctx = img.sourceImg.getContext("2d");
	var data = toImageData(x, y, imgWidth, imgHeight);
	ctx.putImageData(data, 0, 0);
	return img;
};

// Grabs the 16 small squares, storing them on `pieces`
var cutIntoPieces = function() {
	for (var i = 0; i < 4; ++i) {
		for (var j = 0; j < 4; ++j) {
			var x = left + j * side;
			var y = top + i * side;

			pieces[nPieces++] = grabImage(x, y, side, side);
		}
	}
};

// Draws the animated portion
var drawPieces = function() {
	var angleDelta = 360 / nPieces;

	pushMatrix();
	translate(200, 260);

	for (var i = 0; i < nPieces; ++i) {
		pushMatrix();
		rotate(angle + angleDelta * i);
		translate(radius, 0);
		image(pieces[i], 0, 0);

		popMatrix();
	}

	popMatrix();
	angle -= 0.5;
};

var draw = function() {
	background(255, 255, 255);
	drawMainPicture();
	drawPieces();
};

drawMainPicture();
cutIntoPieces();
```
