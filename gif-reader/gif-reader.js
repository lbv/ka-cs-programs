/**
 * GIF Reader
 * ==========
 *
 * A decoder for images in the GIF format.
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
	if (this.ntable === this.maxElem) { this.maxElem = 1 << (++this.bits); }
};

LZWReader.prototype.nextByte = function() {
	if (this.stack.length === 0) { this.read(); }
	return this.stack.pop();
};

/**
 * GIF data reader
 */
var GIFReader = function(input) {
	this.input   = input;
	this.width   = 0;
	this.height  = 0;
	this.gct     = null;   // global color table
	this.gctf    = false;  // GCT flag (if GCT is present or not)
	this.gctSize = 0;
	this.bgIndex = 0;
	this.images  = [];
};

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
	for (var i = 0; i < total; ++i) { table.push(this.nextBytes(3)); }
	return table;
};

GIFReader.prototype.blockExtension = function() {
	this.nextByte();
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

	var img = createImage(this.width, this.height, ARGB);
	var ctx = img.sourceImg.getContext("2d");
	var pix = ctx.createImageData(w, h);

	var codeSize = this.nextByte();
	var blockReader = new BlockReader(this);
	var lzwReader = new LZWReader(blockReader, codeSize);
	var row = 0, col = 0;
	while (true) {
		var b = lzwReader.nextByte();
		if (b === null) { break; }
		var idx = (row * w + col) * 4;
		pix.data[idx] = ct[b][0];
		pix.data[idx + 1] = ct[b][1];
		pix.data[idx + 2] = ct[b][2];
		pix.data[idx + 3] = 0xff;
		if (++col >= w) { col = 0; ++row; }
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




var gif_data = "R0lGODlhZABkAIABAAAA/////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAZABkAAACoYyPqcvt\nD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITCqXzKbzCY1Kp9Sq9YrN\narcYgJer8IrH4LGZnD2rv9e1u+1WW+NvKn1dvcunery0vxcFeGY3yMZnCJCXODcIB4gFmXZX5gd2\nIHapucnZ6fkJGio6SlpqeoqaqrrK2ur6ChsrO0tba3uLm6u7y9vr61EAADs=";

var mainImg;
try {
	var b64 = new Base64Reader(gif_data);
	var gif = new GIFReader(b64);
	var res = gif.readImages();
	mainImg = res[0];
}
catch (e) {
	println("Error: " + e);
}

var draw = function() {
	background(200, 200, 200);
	image(mainImg, 50, 50);
};

