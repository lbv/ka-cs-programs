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
