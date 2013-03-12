/**
 * GIF Reader
 * ==========
 *
 * Version 2 (2013-03-11)
 *
 * A decoder for images in the GIF format.
 *
 * This is just an experiment to see if it was feasible to
 * implement a GIF decoder entirely in javascript, taking
 * the opportunity to learn about the internal details of
 * the format, and the LZW algorithm used in GIF files to
 * compress data. Turns out it *is* quite feasible :).
 *
 * It's not really necessary to implement a GIF decoder just
 * to show custom raster data in a Processing.JS/Khan
 * Academy program, but this was written purely for the fun
 * of doing it.
 *
 * This program demos the GIF reader on three different
 * images: the hand pointer thingy, which has transparency,
 * the K.A. logo, which also has transparency and is
 * interlaced, and the main photo, which is just as large
 * an image as I could test.
 *
 * As you can see, the results are not very sharp, mostly
 * because of problems with the GIF format itself, which is
 * not very good for anything other than simple images like
 * diagrams and the like. For example, for the main photo, I
 * had to reduce the palette of colors to just 64; it still
 * looks kinda nice, though.
 *
 * If you want to use your own images, you just need to
 * replace the contents of the "fooData" variables (see the
 * code). This data is encoded in Base64, which is a simple
 * mechanism to store binary data in a readable format.
 *
 * You need to do two things:
 *
 *   1) Convert the GIF image into Base64 encoding. If you
 *      happen to have a Unix-like system, look into the
 *      "recode" program, and try this:
 *
 *        recode data..b64 < image.gif > image.txt
 *
 *      Otherwise, search the web for alternative ways to
 *      encode into Base64.
 *
 *   2) Once you have the image in Case64, you have to turn
 *      it into JS code. The main problem is that JS doesn't
 *      allow line breaks in strings, so most methods to 
 *      turn the Base64 data into a JS string are very
 *      cumbersome. What I prefer to do is use CoffeeScript,
 *      which is a language that can be "translated" into
 *      Javascript. You just write:
 *
 *        myVariable = """
 *            ..... blah blah ...
 *            ..... large string ...
 *            ..... with many line breaks ...
 *        """
 *
 *      and then turn it into JS with the CoffeeScript
 *      compiler. Anyway, turning an arbitrary Base64 string
 *      into a JS string is not very hard, just inconvenient
 *      to do by hand.
 *
 * If you want to learn about the internal details of the
 * GIF format, you might enjoy the following two documents:
 *
 *   http://www.cs.cmu.edu/~cil/lzw.and.gif.txt
 *   http://www.w3.org/Graphics/GIF/spec-gif89a.txt
 *
 * - - -
 *
 * This was partly inspired by the "Mona Lisa" program, by 
 * Peter Collingridge, which produces a very nice picture 
 * using purely basic drawing primitives. Check it out!
 *
 * GIF Reader
 *   https://www.khanacademy.org/cs/gif-reader/1449958817
 *
 * GIF Reader on GitHub
 *   https://github.com/lbv/ka-cs-programs/tree/master/gif-reader
 *
 * Mona Lisa program
 *   http://www.khanacademy.org/cs/mona-lisa/1153732313
 */

m4_include(`base64.js')
m4_include(`gif-reader.js')

m4_include(`photo.js')
m4_include(`pointer.js')
m4_include(`logo.js')
m4_include(`gif-reader-main.js')
