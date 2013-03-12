/**
 * Mona Lisa (Full)
 * ================
 *
 * Version 1 (2013-03-11)
 *
 * Simple program to display the full Mona Lisa, read from
 * a GIF image.
 *
 * The data is decoded with the GIF Reader. This has been
 * inspired, of course, by the original "Mona Lisa" program.
 *
 * To make the GIF data small enough to fit in a K.A.
 * program, it was processed using dithering, and a palette
 * of only 4 colors!
 *
 *   Mona Lisa (Full)
 *     https://www.khanacademy.org/cs/mona-lisa-full/1454350231
 *
 *   Mona Lisa (Full) on GitHub
 *     https://github.com/lbv/ka-cs-programs/tree/master/mona-lisa-full
 *
 *   GIF Reader
 *     https://www.khanacademy.org/cs/gif-reader/1449958817
 *
 *   Mona Lisa
 *     http://www.khanacademy.org/cs/mona-lisa/1153732313
 */

m4_include(`base64.js')
m4_include(`gif-reader.js')
m4_include(`text-helper.js')

m4_include(`mona-lisa-data.js')
m4_include(`mona-lisa-main.js')
