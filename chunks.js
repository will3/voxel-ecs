var Chunks = function(size) {
	this.size = size || 16;
	this.map = {};
};

Chunks.prototype.get = function(i, j, k) {
	var id = [ 
		Math.floor(i / this.size) * this.size,
		Math.floor(j / this.size) * this.size,
		Math.floor(k / this.size) * this.size
	].join(',');

	if (this.map[id] == null) {
		return 0;
	}

	var origin = this.map[id].origin;

	return this.map[id].chunk.get(i - origin[0], j - origin[1], k - origin[2]);
};

Chunks.prototype.set = function(i, j, k, v) {
	var origin = [ 
		Math.floor(i / this.size) * this.size,
		Math.floor(j / this.size) * this.size,
		Math.floor(k / this.size) * this.size
	];

	var id = origin.join(',');

	if (this.map[id] == null) {
		this.map[id] = {
			chunk: new Chunk(this.size),
			origin: origin
		};
	}

	this.map[id].chunk.set(i - origin[0], j - origin[1], k - origin[2], v);
	this.map[id].dirty = true;
};

var Chunk = function(size) {
	this.size = size;
	this.data = [];
};

Chunk.prototype.get = function(i, j, k) {
	var index = i * this.size * this.size + j * this.size + k;
	return this.data[index] || 0;
};

Chunk.prototype.set = function(i, j, k, v) {
	var index = i * this.size * this.size + j * this.size + k;
	this.data[index] = v;
};

module.exports = Chunks;