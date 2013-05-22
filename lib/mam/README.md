% Media Assets Manager

# Introduction

The *Media Assets Manager* (**MAM** from now on), is a JavaScript library
created to assist programmers with the inclusion of publicly hosted media
assets in their programs for the [Khan Academy C.S.
environment](https://www.khanacademy.org/cs). It currently supports images
(and sprite extraction from images), audio elements and fonts.

MAM is currently under development and it is likely that its internal
details and programming interface changes in the near future. If you would
like to help by testing it, please check this page regularly for changes.

This documentation assumes some knowledge of the JavaScript language and the
Khan Academy programming environment ---specifically, the
[Processing.js](processingjs.org/) model, and things like what the `draw`
function does, what a `PImage` is, and so on. If you're a beginner without
too much experience with the K.A. environment, it's recommended that you
spend some time exploring it and creating at least a few simple programs
before trying to use MAM.


## Change Log

*   *2013-05-21*

    First release.


## Important Notice

Before using MAM, you should be aware of your responsibilities regarding the
use of creative works publicly available on the Internet, or through other
mediums.

At the very least, you should inform yourself about the basic meaning of
terms like *copyright*, *trademark* and *publishing license*. These are
broad topics that go beyond the scope of this document, and it's highly
recommended that you invest a little time learning about them in case you
need to.

Here are some basic guidelines (please don't consider them exhaustive or a
substitute for valid legal advice):

*   Do not use any digital content (including pictures, images and audio
    files) for which you have not received an explicit permission to use and
    share. Content creators who want to publicly share their work usually do
    so by releasing their assets under a specific license which grants
    certain rights. Look for assets released under licenses such as those
    promoted by the [Creative Commons](http://creativecommons.org/)
    initiative.

*   The fact that you can find a file in a public website *does not* mean
    that you can use it freely, unless it comes with a license that grants
    you the appropriate rights. If you're unsure about the terms of use for
    a certain piece of content, it's better not to make any assumptions.

*   Do not directly link to content hosted on websites maintained by others,
    unless you have received permission to do so. Store your media files in
    your own hosting servers whenever possible.

*   Do not use the names and identities of popular video game characters or
    celebrities in your programs. They are typically covered by trademarks,
    and many video game companies and famous "celebrities" (such as singers,
    actors, and so on) work with law firms who actively look for breaches of
    said trademarks on the Internet. Try inventing your own characters for
    your own video--games and programs. Be creative!

Basically, try to always apply some common sense, and be respectful of other
people's rights. Fortunately, the Internet is a big place, and many people
do share their works with permisive licenses. You may want to spend some
time doing a little research with your favourite web search tool. A good
place to start is this: [Art asset
resources](http://freegamedev.net/wiki/Free_3D_and_2D_art_and_audio_resources)
from FreeGameDevWiki.


# Library Documentation

## Overview

A program that uses MAM would normally include the following elements:

*   The glue code. A short segment of code that imports the MAM library
    itself.

*   The definition of a *configuration object*. This specifies all the media
    assets that you want to use in your program.

*   At least one of the following:
    -   A "callback". This is a function that will be called right after the
        assets have been loaded. It receives an object with all your assets
        as its only parameter. This function allows you to do some set--up
        work, or you can use it to simply assign the media object to a
        global variable that you could use anywhere else in your program.
    -   A replacement for the `draw` function. That is, a function that you
        define, and that will be used as the new `draw` after all the assets
        have been loaded. This allows you to create a dynamic program with
        animations or anything else you want. You may also define the regular
        `draw` function, which will work as usual while the assets are being
        loaded, so you can use it to create a "Loading..." message or
        something to that effect.

*   Finally, a call to the MAM loading function. This initiates the loading
    of assets.


Don't worry if all of this sounds a little confusing right now. Hopefully
this will get clear with the explanations and examples below. Also, try
playing with the examples listed in [*Appendix
A*](#appendix-a-full-examples).


## The Glue Code

The first thing you need to do is placing the "glue" code in your program.
As mentioned above, this is just a short snippet of Javascript code that
will provide a bridge between your program and the MAM library. This code
simply defines a short function called `mamLoad`, which will be described in
more detail later on.

This glue code is presented here:

<script src="https://gist.github.com/lbv/5621048.js"></script>

Just copy and paste it in your own code. It's probably a good idea to put it
right at the top of your program.


## The Configuration Object

In order to import a group of assets, you have to define what those assets
are. This is done through a plain JavaScript object, which can look like
this:

```javascript
var config = {
    images: {
        // images definitions go here..
    },

    sprites: {
        // sprites definitions go here..
    },

    audio: {
        // audio elements definitions go here..
    },

    fonts: [
        // font definitions go here..
    ]
};
```

The following sections will go into detail on how to specify each of these
types of assets.

### Defining Images

You can define a group of images to be imported, by defining them in an
object under the `images` key of the main configuration object.

Each key of this object will be used as the identifier of an image, and its
value should be a string that specifies the URL where that image is being
hosted.

The following example defines two images, called `drawing` and `myPicture`
(you would have to make sure that the URLs are valid for your own images, of
course):

```javascript
var config = {
	images: {
		drawing: 'https://example.com/images/drawing.png',
		myPicture: 'http://www.example.com/myPicture.jpg'
	}
};
```

These images will be loaded and given back to you as objects of type
[`PImage`](http://processingjs.org/reference/PImage/) in the [main
callback](#the-main-callback).

### Defining Sprites

For the purposes of this document, the term "sprite" will mean an image that
is "extracted" from another (probably larger) image.

For example, let's say that you have an image with a size of *300x200*
pixels, such that it's divided into four "panels" ---each panel covering a
corner of the main image, with a size of *150x100* pixels. In order to
extract the four sprites from this larger image (we could call it
*spritesheet*), first we need to define the sheet as a regular image:

```javascript
var config = {
	images: {
		panels: 'https://example.com/four_panels.png'
	}
};
```

With this in place, we can now specify sprites through the `sprites` key of
the main configuration object. The keys of this object will be used as
identifiers for the sprites, and the values must be objects that must
include the following keys:

*   `sheet` --- The name of the image (from the `images` key) from which the
    sprite(s) will be extracted.
*   `x` --- The *X* coordinate for the sprite inside the sheet.
*   `y` --- The *Y* coordinate.
*   `width` --- The width (in pixels) of the sprite.
*   `height` --- The height (in pixels) of the sprite.
*   `frames` --- *Optional*. An integer that indicates the number of sprites in
     succession that should be extracted from the sheet. The sprites must be
     arranged horizontally, one after the other, and all must have the same
     size. If this property is used, then the corresponding object returned
     to you in the main callback will be an array of `PImage` objects,
     otherwise it will be a single `PImage`.

The following code specifies sprites for the four panels in our example. The
first two panels (from the top row) will be extracted as individual sprites,
while the two bottom panels will be extracted in an array of two elements:

```javascript
var config = {
	images: {
		panels: 'https://example.com/four_panels.png'
	},

	sprites: {
		topLeft: {
			sheet: 'panels',
			x: 0,
			y: 0,
			width: 150,
			height: 150
		},
		topRight: {
			sheet: 'panels',
			x: 150,
			y: 0,
			width: 150,
			height: 150
		},
		bottom: {
			sheet: 'panels',
			x: 0,
			y: 150,
			width: 150,
			height: 150,
			frames: 2
		}
	}
};
```

### Defining Audio Elements

Recent browsers have fairly good support for [HTML5
Audio](http://en.wikipedia.org/wiki/HTML5_Audio), a relatively recent
mechanism designed to manipulate audio content inside web documents.

With it, it's pretty straightforward to play sounds and music from your
programs. The main challenge at the moment is providing the audio in a
format that is supported by as many browsers as possible. It is recommended
that you choose files of type *audio/ogg* (typically with the file extension
`.ogg`), since that will probably work without too much trouble for all
major browsers supported by the Khan Academy environment.

MAM supports loading audio elements, and provides them as objects of type
[`HTMLAudioElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
in the main callback. Just specify the `audio` key in the main configuration
object, with an object where each key will be used as the audio identifier,
and its value is a string specifying the URL where the audio file is hosted.
You may also specify an array with one or more URLs, in case you want to
provide alternative formats for the same audio element. Browsers will use
the first audio file that it has support for.

An example:

```javascript
var config = {
	audio: {
		song: 'https://www.example.com/cool_song.ogg',
		boom: [
			'http://example.com/sounds/boom.mp3',
			'http://example.com/sounds/boom.wav'
		]
	}
};
```


### Defining Fonts

To be added.

## The Main Callback

To be added.


## The `draw` Replacement

To be added.

## Calling `mamLoad`

To be added.


# Extra Information

## This Tool and the K.A.

As a user of the Khan Academy for some time, I'm aware of a number things
pertaining its community and the behaviour of active users of the Computer
Science section, including the potential for misuse that a tool like MAM
could represent in this context.

I've repeatedly considered this situation from many different angles, and my
conclusion (at least for the time being) is that I do think that exploring
previously untapped aspects of the programming environment is useful in
itself and, although it could be subject to some degree of misuse (like any
other type of technology), I lean towards trusting the current mechanisms in
place to moderate the content generated by Khan Academy users.

I realize that when a new tool comes along that provides a greater degree of
flexibility for the creation of public creative works, there can be concerns
regarding security as well as social behaviour behind it. I'm fully prepared
to contribute in any way I can to provide the most secure as well as
useful and beginner--friendly tool possible. It's perfectly
possible that new restrictions might be considered for the programming
environment as a result of something like MAM. Nevertheless, it's my
intention to advocate for a responsible use from day one, and it is my hope
that, as the saying goes, the baby is not thrown out along with the bath
water.

In case these issues interest you, I have written more about this topic in
the following document: [The Khan Academy C.S.
Sandbox](http://lbv.github.io/ka-cs-programs/other/sandbox.html).

## General Tips

*   Use sprites whenever it makes sense ---for example, if you have
    a series of images for a single animation, or a group of related and
    similar drawings. In practice, extracting sprites from a single sheet
    tends to be much more efficient than loading many individual images from
    an external host.

*   If possible, try not to make your program too dependant on the
    availability of your media assets. For example, it could happen that
    sounds in certain formats (like MP3, for example) do not work reliably
    in many browsers, so if you're providing your audio files in MP3 format
    only, then keep in mind that many users may not hear any sounds at all;
    adjust your program accordingly.

*   Do not go overboard importing assets. Not everyone connects to the
    Internet through fast lines, and not everyone uses computers or devices
    with particularly good processors (think of tablets or netbooks, for
    example). Be reasonable and aim for efficient use of all of your
    resources.


## Reporting Bugs

If you have a suggestion or want to report a problem, please post a comment
in the *Tips & Feedback* section of the main [MAM
Demo](http://www.khanacademy.org/cs/mam-demo/1663711308) program.

Please note that posting a message that simply states "It doesn't work" is
not very helpful. Try being as specific as you can, and post a link to your
program if possible.


# Appendices

## Appendix A: Full Examples

*   [Importing
    images](https://gist.github.com/lbv/5621644#file-mam-example-images-js).
    Illustrates a simple way to draw a couple of images.

*   [Importing
    sprites](https://gist.github.com/lbv/5621644#file-mam-example-sprites-js).
    Extracts sprites from a single
    [sheet](https://googledrive.com/host/0BzcEQMWUa0znRE1wQU9KUGR2R2s/mam/doc/examples/img/robotsheet.png).
    It illustrates defining a single sprite, as well as a group of frames,
    that are then used in an animation.

*   [Importing
    audio](https://gist.github.com/lbv/5621644#file-mam-example-audio-js).
    Reproduces two sounds, one in OGG format and one in WAV format. It also
    illustrated the use of the `loop` property in a `HTMLAudioElement`
    object.


## Appendix B: Hosting Content in Google Drive

To be added.
