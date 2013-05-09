(require 'phi-teacup').dsl()

meta =
    title: 'The Khan Academy C.S. Sandbox'
    description: '''
      Some of my opinions on the limitations imposed on the environment
      provided by the Khan Academy to learn about computer science.
    '''
    nav: [
        { name: 'Home', url: '' }
        { name: 'Other', url: '#other' }
        { name: 'The Khan Academy CS Sandbox' }
    ]

template = ->
    markdown """
# The Khan Academy C.S. Sandbox

The Khan Adacemy's [Computer Science](https://www.khanacademy.org/cs)
section is a very interesting place to learn, explore, discuss and basically
*play* with ideas related to computer programming. It provides a nice,
visual environment where you as a programmer can receive almost immediate
feedback as you type and edit your code. At least to me, KA-CS has proved to
be a compelling alternative for learning the basics of CS. I particularly
appreciate the way this community has been carefully nurtured and guided by
a group of "guardians" and natural leaders that have stepped up from the
active community itself. It has truly set an example from which many
valuable lessons can be learned.

I think it's accurate to say that this environment (I'll refer to it as
_KA-CS_ ---short for Khan Academy's computer science environment--- from
here on for brevity) was designed with a strong emphasis on beginners (many
of them young boys and girls) in mind. This has resulted in a number of
implementation details that, deliberately or not, end up imposing certain
restrictions to what can or cannot be done in the enviroment.

My intention with this document is just to explore some of the things I've
discovered as I've been using KA-CS, and some of the questions, of both
technical and social nature, that I've been pondering about as a result.
Basically, having played with KA-CS for a little while, a recurrent question
that comes to my mind is, "how much better could this be if some of the
technical and social aspects behind it were tweaked a little bit?".

## KA--CS's Design Goals

So I've mentioned my "experience" with KA-CS, which isn't actually very
extensive.  I've been a user of the Khan Academy for a little more than 2
years, but I haven't been truly active during this entire time. I only
learned about KA-CS earlier this year, after reading an [interview with Ben
Kamens](http://interviews.slashdot.org/story/13/02/25/1417249/interviews-khan-academy-lead-developer-ben-kamens-answers-your-questions),
one of the KA's engineers, where he briefly touched upon the subject of this
platform, and mentioned "John Resig and his team". As luck would have it, it
was around that time that I started learning JavaScript "seriously" as I
wanted to play with this _node.js_ thing I kept hearing about. Even if I
wasn't fully aware of who John Resig was at that point, I recognized his
name as one of the key persons involved in the JS community, and decided to
take the time to explore this new C.S. section from the KA and see how it
felt.

Maybe I should mention, I truly, deeply love both computer science and
education. My undergraduate thesis was in the area of computer engineering
applied to education. The idea of exploring a new approach to interactive
environments to teach and learn computer science fascinates me, and I've
gotten my hands dirty with many of these experiments in the past (from many
of the *Logo* flavours, to *Scratch*, *Hackety--Hack*, the *Java Task
Force*, to interactive books *à la* "Learn *Foo* the Hard Way", etc.)

Anyway, back to the subject, learning of KA-CS was quite a pleasant
experience for me. The main thing I want to point out is that I found that
my personal views on teaching/learning C.S. seem to be very much in
alignment with those of KA-CS architects. John Resig has a very nice
[introduction writeup](http://ejohn.org/blog/introducing-khan-cs/) and a
[talk](http://ejohn.org/blog/talk-khan-academy-computer-science/) which
should give you a rough overview of how the platform works and, most
importantly, the design principles behind it.

Perhaps the best part of all this for me was coming across Bret Victor's
[*Inventing on Principle*](http://vimeo.com/36579366) talk, mentioned in
John Resig's document above. If the idea of "changing the world" appeals to
you in some way, and you haven't watched this talk yet, all I can say is,
you owe it to yourself to set aside some time and watch it attentively.

It is easy to notice how Bret Victor's message has permeated KA-CS's design.
The "instant feedback" principle is perhaps the most noticeable element that
just jumps at you when you play with KA-CS, but there are other interesting
things that are worth some consideration, even if they are perhaps not
executed to their fullest potential yet. I particuarly like the way the
KA-CS has been gradually taking shape, with different "interactive
tutorials" being created and providing a natural path that can be followed
by a complete beginner, to learn about the basics of programming (and
drawing simple computer graphics) gradually, in a nice, rewarding
enviroment.

Now, I think a case can be made for KA-CS's simplicity as an intentional
design principle as well. KA-CS provides you with a very simple interface,
where you type your programs in a little frame, and you see your program
running in "real time" in another little frame right next to your code.
From a programming point--of--view, things are kept small and simple as
well. You use JavaScript, and you have a framework for *visual* programming
at your disposal, courtesy of [Processing.js](http://processingjs.org/). You
don't have to worry about HTML or the HTML5 canvas, `script` tags or the
object--oriented interface to Processing. You just type your code, and all
the relevant components are available for you, right there on the main
scope.

However, as it's usually the case with any technology, this rose is not
without its thorns. In fact, KA-CS being a big project with a tremendously
large audience, it would be surprising if it did *not* have its quirks and
rough edges.


## The Technical Aspect

A question that is often asked in KA-CS's [community
questions](https://www.khanacademy.org/cs/d) area is "what programming
language is this?", and this usually results in answers that basically come
down to "well, it's JavaScript, but *not really*." Now, JavaScript *is*
really the language that you use to create programs in KA-CS, but
it comes with its set of idiosyncracies and peculiarities that you should be
aware of, or it can surprise you when you least expect it.

This has been a known source of confusion for many enthusiastic
self--learners who, after reading that the language used in KA-CS is
JavaScript, say "okay, so I need to learn JavaScript," and go look for JS
resources on the web. They are then surprised when they go back to KA-CS and
find that things like `new Date` don't work, or a little green fellow tells
them "hey, you typed `==` but I though you were going to type `===`."

I can see how some of the "quirks" in KA-CS's platform probably come from
conscious decisions made by people from the KA team. Some of these things
(like allowing or forbidding the `==` operator) are the kind of small
details that could fuel endless debates among people who care about coding
conventions and such. It's not my intention to argue either way about things
of this nature, but I do think there is value in considering how a tool like
KA-CS evolves with time, and the scope of things it can provide, given the
way people use it.

In John Resig's introduction you can read how he was quite impressed when he
personally witnessed kids from a *Discovery Lab* use KA-CS to create
programs that went above and beyond what he would have imagined.  His
conclusion was, "[...]to say that I'm excited to see how people are going to
use this platform is an understatement." That was written in August, 2012.
I'm writing this on May, 2013, and right now if you visit KA-CS, and take
the time to explore some of the programs built by the community, you can
find a wide range of little projects, with various degrees of
sophistication. And certainly, some of them are pretty much gems; little
works of art that showcase some of the power and flexibility you get from a
small JavaScript environment, sprinkled with some drawing directives.

Some of the things created by the community have shown that, although the
goals of KA-CS may be humble, in reality this environment is truly quite
powerful. Choosing JavaScript and modern web browsers as the basis for KA-CS
has a lot to do with this.  The technologies involved with the WWW have done
nothing but grow and improve at a dramatic rate since their inception.
JavaScript right now is pretty much ubiquitous, and the range of things
that you can do with just a web browser and JS gets wider and more
fascinating each day.

To take an example from the context of KA-CS, you often come across
interesting programs where a lot of emphasis is placed in the input/output
mechanisms.  Things like presenting text in an organised manner, and
receiving input from the user, using controls like text area fields,
checkboxes, slider controls... that sort of thing. If you're somewhat
familiar with web development, it's easy to see that this use case is pretty
much perfect for HTML, along with a little bit of JavaScript if necessary.
At least this is basically what I thought when I wanted to create my own
programs with their own input/output components. However, using things like
HTML in KA-CS is not very straightforward at the moment, mainly because the
scope your programs reside in is stripped down of many useful things, like
references to the global `window` object ---and even more surprisingly,
globals like `String`, `Date` and so on.

You *could* try to implement things like text fields in a canvas (even if
it's only through a layer like Processing.js' API).  However, when you
consider that you're working in an environment that is running inside a web
browser, it just seems a little silly to be forced to give up the simplicity
of HTML to implement a basic form, and take the long and winding road of
implementing your own UI controls on top of the canvas.

I can imagine how security has to play an important role in KA-CS'
usability. In this respect, I've noticed that most of the appropriate
technical measures are already in place ---things like running the
code from a different frame that runs on a different domain, *linting* the
source code with tools like JSHint, etc. Beyond that, modern JavaScript
implementations are built upon years of experience with web security;
problems like cross--site vulnerabilities that could lead to some type of
virus, worm, etc. can be solved without too much effort. We can see an
interesting example in [jsFiddle](http://jsfiddle.net/), where
users are free to create and share their programs, with access to a *very*
wide range of external tools built on top of JS.

The thing I find somewhat surprising in KA-CS is that most global objects
are stripped from the main scope, and certain bare words like
`ownerDocument` are forbidden as property names when using the dot notation.
These things do not have much to do with security, and just seem like
capricious restrictions. Given that ultimately the programs do run using the
client's browser JS engine, and in JavaScript it's just not possible to
completely forbid access to the global scope or to properties with certain
names (at least not without seriously breaking everything else, or
effectively using a JavaScript variant with different scoping rules), it
seems fairly strange that the aforementioned quirks would be deliberately
included in the environment. Why do it at all?  Moreover, globals like
`String`, `Array` or `Error` are very commonly used in examples from books,
articles, tutorials, and so on, so not having direct access to them in KA-CS
introduces some amount of cognitive dissonance.

In my opinion, KA-CS could take advantage of the entire stack of
technologies it's built upon: HTML5, JavaScript (without the ineffective
restrictions), Processing.JS, and even the [jQuery](http://jquery.com/) and
[Underscore.js](http://documentcloud.github.io/underscore/) libraries that
are extensively used in KA's website. Given John Resig's own involvement
with many of these technologies, it seems to me that he may be one to
appreciate how there's a great opportunity here that is not being explored.
If young programmers can impress us with just a few geometric shapes and
simple JS functions, imagine what would be possible from some responsible
use of things like HTML5's *media* elements and manipulating web content
with something like [jQuery UI](http://jqueryui.com/).

All of these things are already there. They are just not being exposed to
the programmers in a convenient way, while at the same time there are some
arbitrary limitations that do not seem to be serving any useful purpose.


## The Social Aspect

Of course, there is more to a tool like KA-CS than the technical side of it.
The people behind an environment such as this have to always be vigilant
of how it's actually being used, and this is especially important
considering that its audience has a large proportion of young boys and
girls.

I'll say that it's been a growing concern of mine that there seems to be a
little bit of "grey area" as to what is "allowed" or not by the community
guardians ---a group of people I've read much about, but have never
encountered myself, as of yet (is there a way to have some direct
interaction with them? I don't know).

Case in point, the situation with images in programs. From what I have read,
it seems like some time ago (before I started using KA-CS), it was possible
to use Processing.js' mechanism to import images into a sketch. Apparently,
due to abuse or just a policy change, this functionality was removed, or at
least restricted in a way that basically makes it out of reach for the
majority of programmers. KA-CS being a visual environment and all, this
measure seems a little counter--intuitive. However, it's not hard to imagine
how it could lead to abuse, so I don't think anyone could really object to
the idea of some sort of regulation. It's just a little surprising that a
drastic measure like trying to completely remove the functionality would be
taken. And, as far as I can tell, there are no clear guidelines regarding
what is or should be allowed and what should not.

In any case, this hasn't deterred some tenacious programmers, who have
discovered new and creative ways to step around the restriction, and import
images in their programs in various ways. I've seen many programs do some
charming things that clearly go beyond KA-CS' basic goals discussed above,
and I've seen some of them get deleted without notice, while some similar
programs are left alone, suggesting that the actions of the guardians are to
some extent arbitrary or at least uncoordinated.

Just to make myself clear, it's not my intention to gratuitously criticize
the guardians, people who clearly do an important and difficult job.  I'm
aware of the enormous complexity of moderating online communities and the
social and technical challenges involved. I do want to point out, however,
that as a community grows in size and their members evolve, it's important
to make sure the moderation mechanisms are kept up to par. I see there's an
opportunity to at least increase the communication between the guardians and
the community, which can increase the quality and efectiveness of the
moderation efforts being done. I don't think anything too complicated is
necessary. Just having a simple venue where any member of the community can
find at least some of the guidelines followed by the guardians could go a
long way.

I have hope that this can only get better with time, and it's within the
reach of every member of the community to help make this a better experience
for everyone. It seems that a big challenge for maintaining any sort of
online community is dealing with the so--called [online disinhibition
effect](http://users.rider.edu/~suler/psycyber/disinhibit.html), which can
result in annoying or potentially dangerous behaviour from people who
reinforce certain patterns of conduct until they reach unhealthy extremes.

Now, as I see it, the KA has been successful with its own measures to keep
this sort of problem under control. Granted, I can only talk from my
experience with the site, but it seems like the mechanisms that are
currently in place to moderate and flag content have been working nicely,
and coupled with the effort from the guardians, I can attest to the fact
that participating in the discussions and browsing through the KA-CS
programs "feels" like a good dynamic, where toxic behaviour is quickly dealt
with and people's altruistic side emerge naturally in most situations.

I think this has a lot to do with the people behind the KA, and the example
they set. I mean, when you see one of Salman's talks (take one of his
[commencement
speeches](https://www.khanacademy.org/talks-and-interviews/thoughts-on-education/v/mit-2012-commencement-address),
for example), you can't help but feel uplifted and covered in this nice warm
feeling that makes you look at the people around you with a different
perspective... with a certain sense of *oneness*. This naturally translates
into everything around the KA and its community.

I don't have much else to add, other than saying that I'd like to invite
everyone to take the time to pause in our daily routines, and think
about this: every little thing you do, everything you say affects the world
around you. Let's try to bring our best, and let's do it together, let's
help each other keep our smiles in our faces, and grow and learn together.


- - -

On that note, I think I will wrap this up now. If you want to further
discuss any of these points, feel free to get in touch.

To everyone in the KA community (users, developers, programmers, teachers,
etc.), I just want to add that I have nothing but respect and love for all
your work.  Cheers.


"""

module.exports =
    template: (useLayout 'default', template, doc: meta)
    meta: meta
