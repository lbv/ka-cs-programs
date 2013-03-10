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
 * GIF data reader
 */
var GIFReader = function(input) {
	this.input = input;

	this.width  = 0;
	this.height = 0;

	this.gct  = null;   // global color table
	this.gctf = false;  // GCT flag (if GCT is present or not)

	this.gctSize = 0;
	this.bgIndex = 0;
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
	for (var i = 0; i < total; ++i) {
		var b = this.nextBytes(3);
		table.push(color(b[0], b[1], b[2]));
	}
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

	var img = createImage(this.width, this.height, ARGB);
	var ctx = img.sourceImg.getContext("2d");
	var pix = ctx.createImageData(w, h);

	var codeSize = this.nextByte();
	var blockReader = new BlockReader(this);
	blockReader.skip();

	ctx.putImageData(pix, left, top);
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
};




var gif_data = "R0lGODlhZABkAIABAAAA/////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAZABkAAACoYyPqcvt\nD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITCqXzKbzCY1Kp9Sq9YrN\narcYgJer8IrH4LGZnD2rv9e1u+1WW+NvKn1dvcunery0vxcFeGY3yMZnCJCXODcIB4gFmXZX5gd2\nIHapucnZ6fkJGio6SlpqeoqaqrrK2ur6ChsrO0tba3uLm6u7y9vr61EAADs=";

try {
	var b64 = new Base64Reader(gif_data);
	var gif = new GIFReader(b64);
	var res = gif.readImages();
	debug("ok");
}
catch (e) {
	println("Error: " + e);
}

