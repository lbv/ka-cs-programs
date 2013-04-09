/**
 * Ken
 * ===
 *
 * A demo of animating GIF sprites.
 *
 * Street Fighter II came out when I was a kid, and I
 * vividly remember the discussions with my friends about
 * this game, and our dreams of one day creating something
 * like that. This small and silly program was a lot of fun
 * to create, particularly because of the nostalgia.
 *
 * This is not even close to being a "playable" game, but it
 * could be used as the basis for an engine of some kind.
 * Still, I hope to extend it with more interesting features
 * in the future.
 *
 * - - -
 *
 * "Street Fighter II" and related media is copyright 1991
 * Capcom. This is, of course, a non-commercial program with
 * the purpose of illustrating programming concepts, made in
 * good faith and with the principles of fair use in mind.
 *
 * I sincerely hope I don't offend anyone by using these
 * sprites in a public program.
 *
 * - - -
 *
 * This program uses the GIF Reader code, to decode the
 * individual frames from a single GIF data stream.
 *
 * Ken
 *   http://www.khanacademy.org/cs/ken/1458582372
 *
 * Ken on GitHub
 *   https://github.com/lbv/ka-cs-programs/tree/master/ken
 *
 * GIF Reader
 *   http://www.khanacademy.org/cs/gif-reader/1449958817
 *
 * - - -
 *
 * ChangeLog
 *
 *   Version 1 (2013-03-13)
 */

m4_include(`base64.js')
m4_include(`gif-reader.js')
m4_include(`keys-indicator.js')
m4_include(`key-event-handler.js')

m4_include(`player.js')
m4_include(`ken-anim.js')
m4_include(`ken-main.js')
