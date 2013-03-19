/**
 * BigInt
 *
 * Holds integers of arbitrary size.
 */
var BigInt = function(n) {
	if (n instanceof BigInt) { this.copyFrom(n); return; }

	this.d = [];
	this.sgn = false;

	if (n < 0) { this.sgn = true; n = -n; }
	if (n < BigInt.BASE) { this.d.push(n); }
	else {
		while (n !== 0) {
			this.d.push(n % BigInt.BASE);
			n = floor(n / BigInt.BASE);
		}
	}
};

BigInt.BASE = 1000;

BigInt.fmtDigits = function(n) {
	var str = '';
	for (var i = 0; i < 3; ++i) {
		var d = n % 10;
		n = floor(n/10);
		str = d.toString() + str;
	}
	return str;
};

BigInt.neg = function(b) {
	var ans = new BigInt(b);
	ans.neg();
	return ans;
};

BigInt.add = function(a, b) {
	var ans = new BigInt(a);
	ans.add(b);
	return ans;
};

BigInt.prototype.copyFrom = function(b) {		
	this.d   = b.d.slice(0);
	this.sgn = b.sgn;
};

BigInt.prototype.len = function() { return this.d.length; };

BigInt.prototype.isZero = function() {
	return this.len() === 1 && this.d[0] === 0;
};

BigInt.prototype.neg = function() { this.sgn = !this.sgn; };

BigInt.prototype.clean = function() {
	var i;
	for (i = this.len()-1; i > 0 && this.d[i] === 0; --i) {}
	this.d.splice(i + 1, this.d.length - i);
	if (this.sgn && this.isZero()) { this.sgn = false; }
};

BigInt.prototype.lt = function(b) {
	if (this.sgn !== b.sgn) { return this.sgn; }
	if (this.len() !== b.len()) {
		return this.sgn ^ (this.len() < b.len()); }
	for (var i = this.len() - 1; i >= 0; --i) {
		if (this.d[i] !== b.d[i]) {
			return this.sgn ^ (this.d[i] < b.d[i]); }
	}
	return false;
};

BigInt.prototype.add = function(b) {
	if (this.sgn !== b.sgn) {
		this.sub(BigInt.neg(b)); return; }
	var s1 = this.len(), s2 = b.len(), s3 = max(s1, s2) + 1;
	var res = [], c = 0;
	for (var i = 0; i < s3; ++i) {
		var sum = c;
		sum += i < s1 ? this.d[i] : 0;
		sum += i < s2 ? b.d[i]    : 0;
		if (sum >= BigInt.BASE) {
			c = floor(sum / BigInt.BASE);
			sum %= BigInt.BASE;
		}
		else { c = 0; }
		res[i] = sum;
	}
	this.d = res; this.clean();
};

BigInt.prototype.sub = function(b) {
	if (this.sgn !== b.sgn) {
		this.add(BigInt.neg(b)); return; }
	var sbk  = this.sgn;
	this.sgn = false;
	b = new BigInt(b.sgn ? BigInt.neg(b) : b);
	if (this.lt(b)) {
		b.sub(this);
		if (sbk) { this.copyFrom(b); }
		else     { this.copyFrom(BigInt.neg(b)); }
		return;
	}
	var s1 = this.len(), s2 = b.len(), s3 = s1;
	var res = [], c = 0;
	for (var i = 0; i < s3; ++i) {
		var sum = this.d[i] - (i < s2 ? b.d[i] : 0) - c;
		if (sum < 0) { sum += BigInt.BASE; c = 1; }
		else         { c = 0; }
		res[i] = sum;
	}
	this.d = res; this.sgn = sbk; this.clean();
};

BigInt.prototype.shortDiv = function(n) {
	var r, i;
	for (r = 0, i = this.len() - 1; i >= 0; --i) {
		r = r * BigInt.BASE + this.d[i];
		this.d[i] = floor(r / n);
		r %= n;
	}
	this.clean();
	return r;
};

BigInt.prototype.nDigits = function() {
	var len = this.len();
	var rest = 3 * (len - 1);
	return rest + 1 + floor(log(this.d[len - 1]) / log(10));
};

BigInt.prototype.toString = function() {
	var str = '';
	if (this.sgn) { str = '-'; }
	var first = true;
	for (var i = this.len() - 1; i >= 0; --i) {
		if (first) {
			str += this.d[i].toString(); first = false; }
		else {
			str += BigInt.fmtDigits(this.d[i]); }
	}
	return str;
};
