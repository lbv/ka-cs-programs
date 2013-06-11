ka = require '../../lib/ka-cs'
(require 'phi-teacup').dsl()

meta =
  title: 'Using Web Storage'
  description: '''
    How to store persistent data in JavaScript programs using HTML5's Web Storage.
  '''
  nav: [
    { name: 'Home', url: '' }
    { name: 'Tutorials', url: '#tutorials' }
    { name: 'Web Storage' }
  ]

template = ->
  markdown """
# Using Web Storage

I've recently created a program called [The Portia Puzzles][portia], which
includes a feature that some people have found interesting: it stores the
progress made by the user so that, even if the browser gets closed, the next
time the program is visited it remembers the puzzles you have already
solved.

This functionality is based on a technology known as [Web
Storage](http://en.wikipedia.org/wiki/Web_storage), and even though it's
pretty straightforward to use, incorporating it in programs for the Khan
Academy platform requires a bit of extra effort. Nothing difficult, though.

For the benefit of the people who have taken the effort to ask me about
this, and of everyone else who might find this interesting in the future,
I'm writing this short guide about using _Web Storage_ in JavaScript programs.
And more specifically, in K.A. programs.

[portia]: programs/portia-puzzles.html

<div class="notice">
<p>
**Notice**
</p>
<p>
This guide is about elements that are part of the HTML5+JavaScript stack of
technologies. However, they are undocumented in the Khan Academy's Computer
Science section. The examples here, and the general approach used in them,
may stop working in the future, inside the K.A.. Nonetheless, this can still
be useful if you decide to create your own stand--alone HTML5 applications.
</p>
<p>
Beyond the technical factors involved in using HTML5 technologies like Web
Storage inside the K.A., there are also social aspects that are worth
considering when using undocumented features such as these. You may find the
rationale behind my decision to write this guide in this document: [The Khan
Academy C.S. Sandbox](other/sandbox.html).
</p>
<p>
I encourage you to use technologies like this responsibly, and to consider
this as an opportunity to share your wonderful creativity and inspiration
with the world, in ways that are both gratifying for you and uplifting to
everyone around you.
</p>
</div>

## Persistent Storage for the Web

Let us begin. What is persistent storage? Well, it refers to any mechanism
that allows you to store data, making it _persist_ through time.

Imagine, for example, that we write a simple program that draws a tiny dot
on the canvas, and that makes it possible to move the dot using the
keyboard. To do this, we could try storing the dot's position (its _X_ and
_Y_ coordinates) in variables, and then, when the relevant keys are pressed,
we modify those variables.

However, as you may have noticed, variables are ---by its very nature---
volatile. What I mean is, if we restart our program, or leave the program
and launch it again, the variables will not "remember" the last state they
were in. It will be as if we're running the program for the first time,
every time. Is it possible to improve our dot program, to make it remember
its position even after the program is closed? It turns out it is!

A common mechanism to store data persistently in web applications is to use
*Cookies*; small pieces of data that are interchanged between the
application and the user's browser, and stored by the latter. Cookies got
popularized many years ago, practically from the beginning of the Web as we
know it, and are a good alternative. However, there are some downsides to
them. For instance, they have a relatively small size limit (cookies are
usually rectricted to about 4kb), they have to be transmitted back and forth
for every request from the client to the server, and they require doing
things like negotiating their "expiration times", which in many situations
feels like an unnecessary hassle.

Along with cookies, there are many other alternatives to store data
persistently from web documents, including solutions designed for specific
browsers or media containers (like Flash, or Silverlight), and other
solutions similar to cookies, but (ab)using HTTP headers not originally
intended for cookies.

HTML5 ---the latest, shiniest, most charming standard to create web
applications--- introduced a new mechanism called *Web Storage*, which comes
in two "flavours": local storage and session storage. It comes with a few
important differences in comparison to other mechanisms like cookies: data
is kept on the client side at all times, web storage has a more reasonable
size limit by default ---most browsers allow the use of about 5MB for
storage, per "origin" (we'll see what this means later on)---, and also
their "programming interface" is dead simple. It would be really difficult
to think of an *easier* way to use Web Storage.

We'll explore the *local* storage in this guide, but adjusting things to use
*session* storage instead is easy--peasy. The difference between them is in
the lifetime given to the persistent data.  Things stored in "session" mode
are generally deleted when the browser is closed.  Things stored in "local"
mode are kept there even after the browser is closed; until your application
decides to delete them (or the user, who is always in control of his/her
browser).

## Basic Usage

So you've heard me saying that Web Storage is simple, but how simple? Well,
consider the following snippet of code, which chooses a "lucky"
number ---just a random integer between 1 and 100---, and stores it so it's
remembered every time the program is run again:

```javascript
var lucky = localStorage.getItem('luckyNumber');

if (! lucky) {
	// there is no lucky number stored, so choose one..
	lucky = floor(random(100)) + 1;

	// ..and store it
	localStorage.setItem('luckyNumber', lucky);
}

// Now `lucky` has the lucky number, which is also stored in
// the user's browser as `luckyNumber` in its local storage
```

Hopefully you can follow what this code does without much effort.
`localStorage` is the "channel" you use to interact with the browser's local
storage. It provides the methods `setItem` and `getItem`, which are pretty
self--explanatory. The expression `floor(random(n))+1` simply calculates a
pseudo--random integer between 1 and _n_.

You may feel tempted to try this right now; to copy and paste this code into
a [new program](https://www.khanacademy.org/cs/new) in the K.A.. That's a
great idea! I like your enthusiasm and curiosity! Please, go right ahead and
try it.

Okay, have you tried it yet? What did you see?

Hmm.. what is going on here? Is this web storage business just a bunch of
lies? Is the Khan Academy forbidding us to use it? Does the green "oh noes"
fellow rejoice in our misery? Why did the chicken cross the road? Why do I
keep thinking of lame jokes?

Well, I'm not sure I have the answer to all these questions, but I can share
with you a few things about the Khan Academy's programming environment. It
is a very nice environment which has been diligently created by very smart,
generous and handsome people who want only the best for you and me.

The environment is based on a few technologies that are very flexible and
powerful, including *HTML*, *JavaScript* and *Processing.js*. However, the
environment seems to be overly focused, by design, on simple tasks that make
it easy to create visual programs using a few drawing primitives and not
much more than that. Many *symbols* (like `rect`, `line`, `stroke`, `image`,
and so on) can be used directly in your programs, without any special
boilerplate code, or the need to access
`deep.attributes.inside.javascript.code`. At the same time, many symbols
that are the bread and butter of many JavaScript programs (like `String`,
`RegExp`, `Error`, etc.) are *not* available in the K.A.  environment's main
scope, so we can't access them *directly*.

This does not necessarily mean, however, that the K.A. team in charge of the
C.S. section has deliberately "removed" or forbade the use of certain
basic elements from the JavaScript language. There certainly is a lot of
speculation around this issue, and all I have to say in this respect is that
I've never seen a single "official" statement from someone in the K.A.
development team regarding "bans" or "restrictions" on the JavaScript
environment. It would be quite nice to have an upfront conversation about
this with someone in the know, but so far all we can do is use the
environment we have. An environment that, I think, would be vastly different
from what we can see today if the people in charge were truly pushing for
harder restrictions on the use of certain fundamental pieces of its
stack of technologies.

But enough jibber--jabber. You might be thinking to yourself, "show me how
to use this, then!". Okay, here's a small variation of the previous example,
ready to run on the K.A. environment:

```javascript
var storage;

(function() {
	storage = this.localStorage;
})();

var lucky = storage.getItem('luckyNumber');

if (! lucky) {
	// there is no lucky number stored, so choose one..
	lucky = floor(random(100)) + 1;

	// ..and store it
	storage.setItem('luckyNumber', lucky);

	println("I can see that your lucky number is " + lucky);
}
else {
	println("Hi! I remember your lucky number: " + lucky);
}
```

Try it... try also closing your browser, opening it and running this program
once again. How did it go? How do you feel about the green fellow *now*?
What do you think goes through the mind of a chicken standing in front of a
road?

Okay, back to our example. As you can see, this new version is very similar
to the previous one. The main difference is that we're now declaring a
`storage` variable, which, through some weird looking ---at least at first
glance--- lines of code, is initialized with a reference to the real
`localStorage` object from the browser.

In reality there is nothing mysterious or esoteric about those lines of
code. One of the implementation details from the K.A. environment, currently
affecting every program in there, is that the default [scope][scope] in
which your program runs is not JavaScript's real [global scope][js-global].
Instead, it runs in a special scope, chained to lookup symbols from a
[Processing.js instance][pjs-instance] by default. (By the way, have you
noticed how much I seem to like the word "scope"? What's the deal with
that?)

Objects like `localStorage` live in the global scope, so how to reach that
place? Well the `(function() { /* code here */ })();` pattern is an
effective way to do it. It works because, in JavaScript, an [anonymous
function][lambda] always runs in the global scope by default.

If you feel like I'm going crazy, and the last couple of paragraphs look
like gibberish to you, don't worry. I feel the same way. Anyhow, what we may
take out of this is that you don't really need to understand how stuff like
this works, but being informed doesn't hurt either, don't you think?


[scope]: http://en.wikipedia.org/wiki/Scope_%28computer_science%29
[js-global]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
[pjs-instance]: http://processingjs.org/articles/jsQuickStart.html#javascriptonlyprocessingcode
[lambda]: http://en.wikipedia.org/wiki/Anonymous_function

## Serializing and Deserializing Data

Okay, so we've had our first bites of this new dish called *Web Storage*.
Let's try something else. Let's try storing a counter, indicating how many
times a program has been run.

After taking a few moments to ponder the problem, our first draft of a
solution for this could look something like:

```javascript
var storage;

(function() {
	storage = this.localStorage;
})();

var counter = storage.getItem('counter');

if (! counter) { counter = 0; }
counter = counter + 1;

storage.setItem('counter', counter);

println("Current counter: " + counter);
```

Give it a try. How did it go? The first run showed a counter of 1... so far
so good. The second run, it showed... wait a minute... 11? And then 111?
What's happening here?

Well, if you've encountered this type of problem before, or if you're
familiar with how variables work in JS, the problem should be clear:
all we are storing inside `localStorage` are *strings*, and *strings* only.
We may try storing a number, but the browser will implicitly convert it into
a string before actually placing it inside the local storage.

So, what happens is that in JS, `1 + 1` (both numbers) is equal to 2, but
`"1" + 1` is equal to `"11"`, because the second term is converted into a
string and appended to the first term (which is a string).

Okay, no biggie. We could try using something like [`parseInt`][parseInt] to
convert the string into an integer, but let's explore a more general
solution.

Remember our original project? The one we wanted to do, drawing a tiny dot
which could be moved with the keyboard? The one we planned to sell for
millions of dollars and become rich? Oh, yeah... that last part was *my*
secret plan... I shouldn't have mentioned it... forget I said anything.

Anyway, let's say that we wanted to store three things in that program: a
counter, and the location of the dot (as two coordinates, named _X_ and
_Y_). This means that our basic persistent data structure may look like this:

```javascript
var data = {
	counter: 0,
	X: 200,
	Y: 200
};
```

It would be nice to store and load this object using the local storage.
However, we can only store strings there, and an object like our `data`
above is converted into a string by default in a way that is kind of
useless ---it becomes something like `"[object Object]"`.

What to do? Well, no need to fret, my friend. There is a fairly simple
mechanism that works well in JS, which is called
[JSON](http://www.json.org/). Technically, it is a data--interchange format,
or ---in other words---  a set of strict rules that specify how to arrange
data so that it can be moved around and understood by different parties
(people or machines). Sounds like something useful for our situation, right?

Something nice is that, "JavaScript" accounting for the first two letters in
the JSON acronym, it's no surprise that the JavaScript language has good
built--in support for JSON. There is a [`JSON`][moz-json] object that
provides two useful methods: `stringify`, to convert a JS object into a JSON
string, and `parse`, to convert a JSON string into an object.  These two
processes ---converting an object into a string, and vice--versa--- are
usually called "serializing" and "deserializing" data.

It's worth noting that the `JSON` object lives in the global scope inside a
browser. Luckily, we already know how to deal with that...

```javascript
var json, storage;

(function() {
	json    = this.JSON;
	storage = this.localStorage;
})();

var data;

var dataJSON = storage.getItem('dot-program-data');

if (dataJSON) {
	data = json.parse(dataJSON);
	println("The data was successfully loaded");
}
else {
	println("No data found in storage, using the default");
	data = {
		counter: 0,
		X: 200,
		Y: 200
	};
}

data.counter = data.counter + 1;

println("The counter is: " + data.counter);

storage.setItem('dot-program-data', json.stringify(data));

println("The data has been stored");
```

[parseInt]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
[moz-json]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON

## Full Example

We're now ready to release our soon--to--be--famous *Dot* program:

```javascript
var json, storage;

(function() {
	json    = this.JSON;
	storage = this.localStorage;
})();

var data;
var dotRadius = 2;
var dotStep   = 3;
var pressedKeys = {};

var dataJSON = storage.getItem('dot-program-data');

if (dataJSON) {
	data = json.parse(dataJSON);
}
else {
	data = {
		counter: 0,
		X: 200,
		Y: 200
	};
}

data.counter = data.counter + 1;

var msg = "Welcome, you have run this program " +
	data.counter + " times";

var saveData = function() {
	var jsonData = json.stringify(data);
	storage.setItem('dot-program-data', jsonData);
};

saveData();

var keyPressed = function() {
	pressedKeys[keyCode] = true;
};

var keyReleased = function() {
	pressedKeys[keyCode] = false;
};

var draw = function() {
	background(255, 255, 255);

	// the dot
	noStroke();
	fill(255, 0, 0);
	ellipse(data.X, data.Y, dotRadius * 2, dotRadius * 2);

	// the message
	fill(0, 0, 255);
	textAlign(CENTER, TOP);
	text(msg, 200, 8);

	// control movement
	var moved = false;

	if (pressedKeys[UP]) {
		data.Y = max(0, data.Y - dotStep);
		moved = true;
	}
	if (pressedKeys[DOWN]) {
		data.Y = min(400, data.Y + dotStep);
		moved = true;
	}
	if (pressedKeys[LEFT]) {
		data.X = max(0, data.X - dotStep);
		moved = true;
	}
	if (pressedKeys[RIGHT]) {
		data.X = min(400, data.X + dotStep);
		moved = true;
	}

	if (moved) {
		saveData();
	}
};
```

## Final Recommendations

Remember when I mentioned that we were going to talk more about how web
storage has a size limit of about 5 MB *per origin*? Me neither. But let's
talk about it anyway.

Here's the thing: computers store persistent data using devices such as hard
disks, that have a fixed capacity. In other words, you can't put an infinite
amount of data inside them (imagine the kind of world we would be living in,
if it *were* possible). So, how does this size limit restriction work in
practice for *Web Storage*?  Well, as I mentioned a moment ago (I know you
can remember *that*), browsers usually allot about 5MB to each *origin*.
There's that word again... what is an [origin][origin]?

Well, it's basically the combination of three things, in relation to a web
document: the protocol under which it's served (like HTTP, or HTTPS), a
domain name (like *www.example.com*), and a port (a number like 80, normally
used by web servers). In the case of the K.A. environment, all programs in
the C.S. section run from a server with the following origin:
`https://kasandbox.org` (the port 80 is implied).

Why should we care? Well, because when you think about what I have told you,
you can see that, since all programs have the same origin, *all programs in
the K.A. share the same storage space, with its size limit*.  Can you see
why this is important now?

Anyway, I know you're a pretty nice programmer. I know you will write
programs that make conscious use of technologies like Web Storage. I know
this. But we have to be aware that perhaps not *everyone* is as nice as you.

For this reason, here's a few recommendations I want to give you:

* Try to avoid polluting the `localStorage` space with too many "keys". For
  example, in our Dot program, we use only one key to store our data, which
  is `dot-program-data`. Since we serialize our data, there's no need for
  more than one key per program. Let us be polite and not hog more keys than
  we need.

* Be aware that any other program *can* read the data you store from your
  own programs, and even overwrite it. There's no way around this, unless a
  big change in the K.A.'s setup happens, providing an unique *origin* for
  each program, but I wouldn't hold my breath waiting for it. Because of
  this, try to avoid storing persistently anything you'd call "important".
  Use web storage for data that you would not miss if it dissapears or gets
  corrupted for some reason.

* Adjust your code, given the possibility that the stored data may get
  modified by external forces. Some programmers refer to this as [defensive
  programming][defensive]. For example, if your program stores something as
  `data.score`, which is expected to be an integer, be prepared for the case
  where `data.score` may be stored as a string, or an array, or some other
  thing.

* Having said that, don't get too caught up in trying to account for
  *everything*. If the data you persist is in fact nothing too serious, then
  there's no reason to get all serious yourself or get stressed about it...
  Have fun!


[origin]: http://www.whatwg.org/specs/web-apps/current-work/multipage/origin-0.html
[defensive]: http://en.wikipedia.org/wiki/Defensive_programming

## More Information

* [Web Storage][spec]. The official specification, by the W3C.
* [DOM Storage guide][mozilla-guide]. A terse, yet informative guide about
  Web Storage, on the the Mozilla Developer Network.
* [Local Storage][dive-guide]. A nice and friendly tutorial, from the Dive
  Into HTML5 website.

[spec]: http://www.w3.org/TR/2013/PR-webstorage-20130409/
[mozilla-guide]: https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Storage
[dive-guide]: http://diveintohtml5.info/storage.html

"""

module.exports =
    template: useLayout('default', template, doc: meta)
    meta: meta
