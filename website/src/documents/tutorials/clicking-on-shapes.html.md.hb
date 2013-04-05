---
title: Clicking on Shapes
layout: default
description: >
  How to detect shapes through mouse clicks.
nav:
  - name: Home
    url:  /
  - name: Tutorials
  - name: Clicking on Shapes
---
# Clicking on Shapes #

## Summary ##

Making interactive programs involves a number of challenges. One of them is
this: when someone clicks on a shape from my program, how do I detect it?

As is usual in programming, there is more than one way to do it, and what is
most appropriate on any given situation depends a lot on the specific
circumstances. Nevertheless, we'll explore a couple of approaches to this
problem: detection based on the coordinates of the mouse alone, and
detection based on the color of the pixel pointed at by the mouse.

## Method 1: Detection based on mouse coordinates ##

The idea behind this is to simply use the exact coordinates of the mouse at
the time of the click to determine if they lie inside a certain figure. This
method is probably the most intuitive one, yet it can be tricky because it
depends on the location, dimensions and general shape of the figure you're
trying to recognize as a "clickable" object.

The two shapes most commonly used for this method are the rectangle and the
circle, simply because they're the easiest to detect through simple
mathematical expressions.

For example, for a rectangle, you can confidently determine if a given point
is inside of it if its _X_ coordinate is between the *left* and *right*
sides of the rectangle, and its _Y_ coordinate is between the *top* and
*bottom* of the rectangle. Don't forget that the coordinate system used in
computer graphics makes the _Y_ axis point downwards, so higher _Y_
coordinates means lower locations on the screen.

For the case of a circle, there is a simple method based on the
[pythagorean
theorem](https://www.khanacademy.org/math/geometry/right_triangles_topic/pyth_theor/v/the-pythagorean-theorem)
and some basic geometry. Knowing the exact location of the mouse, and the
center of the circle, you can easily determine the distance between those
two points. And if that distance is less than or equal to the circle's
radius, then the mouse is inside the circle.

Let's see how all of this would look in an example:

{{{kaExample 'Identifying figures based on their location and shape'
'http://www.khanacademy.org/cs/example-detection-of-clicks-based-on-mouse-coordinates/1520783583'}}}

``` javascript
strokeWeight(2);

//
// Drawing a red rectangle
//
var rectX = 75;
var rectY = 175;

var rectWidth  = 50;
var rectHeight = 50;


stroke(164, 0, 0);
fill(239, 41, 41);
rect(rectX, rectY, rectWidth, rectHeight);

//
// Drawing a blue circle
//
var circX = 300;
var circY = 200;

var circDiameter  = 50;

stroke(32, 74, 135);
fill(114, 159, 207);

ellipse(circX, circY, circDiameter, circDiameter);


//
// Returns true if the user clicked on the rectangle
//
var detectRectangle = function() {
	if (mouseX >= rectX && mouseX <= rectX + rectWidth &&
	    mouseY >= rectY && mouseY <= rectY + rectHeight) {

	    return true;

	}
	else {
		return false;
	}
};


//
// Returns true if the user clicked on the circle
//
var detectCircle = function() {
    var dx = mouseX - circX;
    var dy = mouseY - circY;

    // Square of the distance between the mouse, and the
    // center of the circle
    var sqDist = dx*dx + dy*dy;

    // Square of the circle's radius
    var radius   = circDiameter / 2;
    var sqRadius = radius * radius;

	if (sqDist <= sqRadius) {
		return true;
	}
	else {
		return false;
	}
};

var mouseClicked = function() {
	if (detectRectangle()) {
		println("You clicked on the rectangle.. yay!");
	}
	else if (detectCircle()) {
		println("You clicked on the circle... wooo!");
	}
	else {
		println("You clicked on empty space...");
	}
};
```


## Method 2: Detection based on pixel color ##

The previous method, as simple as it is, has its limitations. For example,
what if you want to detect shapes that are _not_ rectangles and circles,
like stars or ellipses? Perhaps you could try approximating the general
shape of your figure by combining different rectangles and circles, but
sooner or later this could turn into a big problem that is not easy to
maintain.

Fortunately, there is another simple method, which is using the color of the
pixel that the mouse is pointing at when the user clicked on the screen.
This tends to work really well in practice because usually shapes in a
graphical environment are colourful and as long as you can easily and
efficiently recognize something by its color alone, you're all set!

For this we'll be using {{{pjsRef 'get_'}}}. Let's see an example...

{{{kaExample 'Identifying shapes by their color'
'http://www.khanacademy.org/cs/example-detecting-clicks-using-pixel-color/1520899184'}}}

``` javascript
// Use an "alias" for Processing.JS 'get'
var getColor = this.get;

noStroke();

//
// Drawing a star
//
var starColor = color(252, 233, 79);

fill(starColor);

beginShape();
vertex(100, 10);
vertex(40, 180);
vertex(190, 60);
vertex(10, 60);
vertex(160, 180);
endShape();

//
// Drawing an ellipse
//
var ellipColor = color(115, 210, 22);

fill(ellipColor);

ellipse(300, 300, 50, 180);


var mouseClicked = function() {
	var pixelColor = getColor(mouseX, mouseY);

	if (pixelColor === starColor) {
		println("You clicked on the star... good job!");
	}
	else if (pixelColor === ellipColor) {
		println("You clicked on the ellipse... nice!");
	}
	else {
		println("You clicked on empty space...");
	}
};
```
