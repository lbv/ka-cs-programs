/**
 * GIF Reader
 * ==========
 *
 * Version 1 (2013-03-10)
 *
 * A decoder for images in the GIF format.
 *
 * This is just an experiment to see if it was feasible to implement a GIF
 * decoder entirely in javascript, taking the opportunity to learn about the
 * internal details of the format, and the LZW algorithm used in GIF files to
 * compress data. Turns out it *is* quite feasible :).
 *
 * It's not really necessary to implement a GIF decoder just to show custom
 * raster data in a Processing.JS/Khan Academy program, but this was written
 * purely for the fun of doing it.
 *
 * This program demos the GIF reader on three different images: the hand
 * pointer thingy, which has transparency, the K.A. logo, which also has
 * transparency and is interlaced, and the main photo, which is just as large
 * an image as I could test.
 *
 * As you can see, the results are not very sharp, mostly because of problems
 * with the GIF format itself, which is not very good for anything other than
 * simple images like diagrams and the like. For example, for the main photo,
 * I had to reduce the palette of colors to just 64; it still looks kinda
 * nice, though.
 *
 * If you want to use your own images, you just need to replace the contents
 * of the "fooData" variables (see the code). This data is encoded in Base64,
 * which is a simple mechanism to store binary data in a readable format.
 *
 * You need to do two things:
 *
 *   1) Convert the GIF image into Base64 encoding. If you happen to have a
 *      Unix-like system, look into the "recode" program, and try this:
 *
 *        recode data..b64 < image.gif > image.txt
 *
 *      Otherwise, search the web for alternative ways to encode into Base64.
 *
 *   2) Once you have the image in Case64, you have to turn it into JS code.
 *      The main problem is that JS doesn't allow line breaks in strings, so
 *      most methods to turn the Base64 data into a JS string are very
 *      cumbersome. What I prefer to do is use CoffeeScript, which is a
 *      language that can be "translated" into Javascript. You just write:
 *
 *        myVariable = """
 *            ..... blah blah ...
 *            ..... large string ...
 *            ..... with many line breaks ...
 *        """
 *
 *      and then turn it into JS with the CoffeeScript compiler. Anyway,
 *      turning an arbitrary Base64 string into a JS string is not very
 *      hard, just inconvenient to do by hand.
 *
 * If you want to learn about the internal details of the GIF format, you
 * might enjoy the following two documents:
 *
 *   http://www.cs.cmu.edu/~cil/lzw.and.gif.txt
 *   http://www.w3.org/Graphics/GIF/spec-gif89a.txt
 *
 * - - -
 *
 * This was partly inspired by the "Mona Lisa" program, by Peter
 * Collingridge, which produces a very nice picture using purely basic
 * drawing primitives.
 *
 * Mona Lisa program:
 *   http://www.khanacademy.org/cs/mona-lisa/1153732313
 *
 * GIF Reader on K.A.:
 *   http://www.khanacademy.org/cs/gif-reader/1449958817
 *
 * GIF Reader on GitHub:
 *   https://github.com/lbv/ka-cs-programs/tree/master/gif-reader
 */

/**
 * Base64 data reader
 */
var Base64Reader = function(str) {
	this.str    = str;
	this.idx    = 0;
	this.octets = 0;
	this.oIdx   = 0;
	this.end    = false;
};

Base64Reader.prototype.readOctets = function() {
	if (this.idx >= this.str.length) { this.end = true; return; }
	for (var i = 0; i < 4; ++i) {
		var c = this.idx + i < this.str.length ?
		        this.str.charCodeAt(this.idx + i) : 0;

		if      (c >= 65 && c <= 90)  { c -= 65; }
		else if (c >= 97 && c <= 122) { c -= 71; }
		else if (c >= 48 && c <= 57)  { c += 4; }
		else if (c === 43) { c = 62; }
		else if (c === 47) { c = 63; }
		else if (c === 61) { c = 0; }
		else if (c !== 0)  { ++this.idx; --i; continue; }

		this.octets = (this.octets << 6) | c;
	}
	this.idx += 4;
};

Base64Reader.prototype.nextByte = function() {
	if (this.oIdx === 0) { this.readOctets(); }
	if (this.end) { return null; }
	if (++this.oIdx > 2) { this.oIdx = 0; }
	var b = (this.octets >> 16) & 0xff;
	this.octets <<= 8;
	return b;
};

/**
 * GIF block data reader
 */
var BlockReader = function(input) {
	this.input = input;
	this.n     = 0;
	this.end   = false;
};

BlockReader.prototype.nextByte = function() {
	if (this.n-- === 0) {
		this.n = this.input.nextByte();
		if (this.n-- === 0) { this.end = true; return null; }
	}
	return this.input.nextByte();
};

BlockReader.prototype.skip = function() {
	while (! this.end) { this.nextByte(); }
};

/**
 * Provides a stream of data by groups of bits
 */
var BitChunkReader = function(input) {
	this.input   = input;
	this.buffer  = 0;
	this.nbuffer = 0;
};

BitChunkReader.prototype.readBits = function(bits) {
	var read = 0;
	var ans  = 0;
	while (read < bits) {
		if (this.nbuffer === 0) {
			this.buffer  = this.input.nextByte();
			this.nbuffer = 8;
		}
		var n = min(bits - read, this.nbuffer);
		ans |= (this.buffer & ((1 << n) - 1)) << read;
		read += n;
		this.nbuffer -= n;
		this.buffer >>= n;
	}
	return ans;
};

/**
 * LZW-compressed data reader
 */
var LZWReader = function(input, codeSize) {
	this.input    = new BitChunkReader(input);
	this.codeSize = codeSize;
	this.bits     = codeSize + 1;
	this.CC       = 1 << codeSize;
	this.EOI      = this.CC + 1;
	this.stack    = [];
	this.table    = [];
	this.ntable   = 0;
	this.oldCode  = null;
};

LZWReader.prototype.initTable = function() {
	this.table = [];
	for (var i = 0; i < this.CC; ++i) { this.table[i] = [ i, -1, i ]; }
	this.bits    = this.codeSize + 1;
	this.maxElem = 1 << this.bits;
	this.ntable  = this.CC + 2;
	this.oldCode = null;
};

LZWReader.prototype.read = function() {
	var code = this.input.readBits(this.bits);
	if (code === this.EOI) { this.stack.push(null); return; }
	if (code === this.CC) {
		this.initTable();
		code = this.input.readBits(this.bits);
	}
	if (this.oldCode === null) {
		this.oldCode = code;
		this.stack.push(this.table[code][0]);
		return;
	}
	var i;
	if (code < this.ntable) {
		for (i = code; i >= 0; i = this.table[i][1]) {
			this.stack.push(this.table[i][0]);
		}
		this.table[this.ntable++] = [
			this.table[code][2], this.oldCode, this.table[this.oldCode][2] ];
	}
	else {
		var K = this.table[this.oldCode][2];
		this.table[this.ntable++] = [ K, this.oldCode, K ];
		for (i = code; i >= 0; i = this.table[i][1]) {
			this.stack.push(this.table[i][0]);
		}
	}
	this.oldCode = code;
	if (this.ntable === this.maxElem) {
		this.maxElem = 1 << (++this.bits);
		if (this.bits > 12) { this.bits = 12; }
	}
};

LZWReader.prototype.nextByte = function() {
	if (this.stack.length === 0) { this.read(); }
	return this.stack.pop();
};

/**
 * GIF data reader
 */
var GIFReader = function(input) {
	this.input    = input;
	this.width    = 0;
	this.height   = 0;
	this.gct      = null;   // global color table
	this.gctf     = false;  // GCT flag (if GCT is present or not)
	this.gctSize  = 0;
	this.bgIndex  = 0;
	this.hasTrans = false;
	this.transIdx = 0;
	this.images   = [];
};

GIFReader.interlacing = [
	[ 0, 8 ],
	[ 4, 8 ],
	[ 2, 4 ],
	[ 1, 2 ],
	[ 0, 0 ]
];

GIFReader.prototype.assert = function(v) {
	if (! v) { throw 'GIF error - is the data correct?'; }
};

GIFReader.prototype.nextByte = function() {
	var b = this.input.nextByte();
	this.assert(b !== null);
	return b;
};

GIFReader.prototype.nextBytes = function(len) {
	var bytes = [];
	for (var i = 0; i < len; ++i) { bytes.push(this.nextByte()); }
	return bytes;
};

GIFReader.prototype.assertBytes = function(bytes) {
	var inBytes = this.nextBytes(bytes.length);
	for (var i = 0; i < bytes.length; ++i) {
		this.assert(inBytes[i] === bytes[i]);
	}
};

GIFReader.prototype.readInt16 = function() {
	var b = this.nextBytes(2);
	return b[0] | (b[1] << 8);
};

GIFReader.prototype.readColorTable = function(sz) {
	var total = 1 << sz;
	var table = [];
	for (var i = 0; i < total; ++i) {
		var rgba = this.nextBytes(3);
		rgba.push(0xff);
		table.push(rgba);
	}
	return table;
};

GIFReader.prototype.graphicControl = function() {
	this.assert(this.nextByte() === 4);
	var flags     = this.nextByte();
	var delay     = this.readInt16();
	this.transIdx = this.nextByte();
	this.assert(this.nextByte() === 0);

	this.hasTrans = !!(flags & 0x1);
};

GIFReader.prototype.blockExtension = function() {
	var label = this.nextByte();
	if (label === 249) { this.graphicControl(); return; }
	var blockReader = new BlockReader(this);
	blockReader.skip();
};

GIFReader.prototype.blockImage = function() {
	var left = this.readInt16();
	var top  = this.readInt16();
	var w    = this.readInt16();
	var h    = this.readInt16();

	var flags = this.nextByte();
	var lctf   = !!(flags & 0x80);
	var ilace  = !!(flags & 0x40);
	var ctSize = (flags & 0x07) + 1;

	var lct = null;
	if (lctf) { lct = this.readColorTable(ctSize); }

	var ct = lctf ? lct : this.gct;

	if (this.hasTrans) { ct[this.transIdx][3] = 0; }

	var img = createImage(this.width, this.height, ARGB);
	var ctx = img.sourceImg.getContext("2d");
	var pix = ctx.createImageData(w, h);

	var codeSize = this.nextByte();
	var blockReader = new BlockReader(this);
	var lzwReader = new LZWReader(blockReader, codeSize);
	var row = 0, col = 0, ilp = 0;
	while (true) {
		var b = lzwReader.nextByte();
		if (b === null) { break; }
		var idx = (row * w + col) * 4;
		pix.data[idx] = ct[b][0];
		pix.data[idx + 1] = ct[b][1];
		pix.data[idx + 2] = ct[b][2];
		pix.data[idx + 3] = ct[b][3];
		if (++col >= w) {
			col = 0;
			if (ilace) {
				row += GIFReader.interlacing[ilp][1];
				if (row >= h) { row = GIFReader.interlacing[++ilp][0]; }
			}
			else { ++row; }
		}
	}
	blockReader.skip();

	ctx.putImageData(pix, left, top);
	this.images.push(img);
};

GIFReader.prototype.readImages = function() {
	this.assertBytes([ 71, 73, 70, 56 ]);
	var b = this.nextByte();
	this.assert(b === 55 || b === 57);
	this.assertBytes([ 97 ]);

	this.width  = this.readInt16();
	this.height = this.readInt16();

	b = this.nextByte();
	this.gctf    = !!(b & 0x80);
	this.gctSize = (b & 0x07) + 1;
	this.bgIndex = this.nextByte();

	this.nextByte();  // aspect ratio
	// Ignored information: color resolution, sorted flag, aspect ratio

	if (this.gctf) { this.gct = this.readColorTable(this.gctSize); }

	while (true) {
		b = this.nextByte();
		if      (b === 59) { break; }
		else if (b === 33) { this.blockExtension(); }
		else if (b === 44) { this.blockImage(); }
		else               { this.assert(false); }
	}
	return this.images;
};


// Generated by CoffeeScript 1.3.3
var photoData;

photoData = "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";

// Generated by CoffeeScript 1.3.3
var pointerData;

pointerData = "R0lGODlhHgAnAIABAAAAAP///yH5BAEKAAEALAAAAAAeACcAAAJ1jI+py+1/gITUSFDftDivHYAe\nAoojF3Vnyq5tqLrlFXvzJau36cxv5rOQeIpgiIRqGGMdES0JiyClQg6xOD1aawwm9VfRJbgUJtmG\ndWmzK+45/Hlr4jL66LoGyvH2rry49zcmKBhVVlaYp5RI0+jI+BipVlEAADs=";

// Generated by CoffeeScript 1.3.3
var logoData;

logoData = "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\nrGWuWplLJfRilbPsZRIKMIBiGtOYwsxlEAAAOw==";

var photoImg;
var pointerImg;
var logoImg;
var usePointer = false;

try {
	var gif = new GIFReader(new Base64Reader(pointerData));
	pointerImg = gif.readImages()[0];
	gif = new GIFReader(new Base64Reader(logoData));
	logoImg = gif.readImages()[0];

	gif = new GIFReader(new Base64Reader(photoData));
	photoImg = gif.readImages()[0];
}
catch (e) {
	println("Error: " + e);
}

var photoY = (height - photoImg.height) / 2;
var photoDir = 1;
var photoSpeed = 3;
var photoMoving = false;

var draw = function() {
	background(0xffeeeeec);
	image(photoImg, 0, photoY);
	image(logoImg, width - logoImg.width, 0);

	if (usePointer && mouseY >= photoY && mouseY <= photoY + photoImg.height) {
		noFill();
		stroke(0xffef2929);
		strokeWeight(2);
		rect(1, photoY + 1, width - 2, photoImg.height - 2);
	}
	if (photoMoving) {
		photoY += photoSpeed * photoDir;
		if (photoY > height - photoImg.height) {
			photoY = height - photoImg.height;
			photoDir = -1;
		}
		if (photoY < 0) {
			photoY = 0;
			photoDir = 1;
		}
	}

	if (usePointer) { image(pointerImg, mouseX, mouseY); }
};

var mouseOut = function() {
	usePointer = false;
};

var mouseOver = function() {
	usePointer = true;
	noCursor();
};

var mousePressed = function() {
	if (mouseY >= photoY && mouseY <= photoY + photoImg.height) {
		photoMoving = !photoMoving;
	}
};

