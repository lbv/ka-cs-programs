/**
 * Heap
 *
 * Data structure that maintains its elements in order, so
 * that the "top" element is always the smallest, according
 * to a custom comparator.
 */
var Heap = function(cmp) {
	this.data = [];
	this.cmp  = cmp;
};

Heap.prototype.size = function() {
	return this.data.length;
};

Heap.prototype.isEmpty = function() {
	return this.data.length === 0;
};

Heap.prototype.push = function(v) {
	this.data.push(v);
	var idx = this.data.length - 1;

	while (idx > 0) {
		var parent = floor((idx - 1) / 2);
		if (this.cmp(this.data[parent],
		             this.data[idx]) <= 0) {
			return; }
		var aux = this.data[parent];
		this.data[parent] = this.data[idx];
		this.data[idx] = aux;
		idx = parent;
	}
};

Heap.prototype.pop = function() {
	if (this.data.length === 0) {
		throw 'The heap is empty'; }
	var e = this.data[0];
	this.data[0] = this.data.pop();

	var idx = 0;
	var sz = this.data.length;
	while (true) {
		var c1 = idx*2 + 1;
		var c2 = idx*2 + 2;
		var sw = idx;
		if (c1 < sz &&
		    this.cmp(this.data[c1], this.data[sw]) <= 0) {
			sw = c1; }
		if (c2 < sz &&
		    this.cmp(this.data[c2], this.data[sw]) <= 0) {
			sw = c2; }
		if (sw === idx) { return e; }
		var aux = this.data[sw];
		this.data[sw] = this.data[idx];
		this.data[idx] = aux;
		idx = sw;
	}
	return e;
};

Heap.prototype.peek = function() {
	if (this.data.length === 0) {
		throw 'The heap is empty'; }
	return this.data[0];
};
