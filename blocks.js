var mesher = require('./mesher');
var Chunks = require('./chunks');
var THREE = require('three');

class Blocks {
	constructor() {
		this.object = new THREE.Object3D();
		this.innerObject = new THREE.Object3D();
		this.object.add(this.innerObject);
		this.chunks = new Chunks();
		this.material = [ null ];	
	}

	start() {
		this.app.shared.scene.add(this.object);	
	}

	tick() {
		mesher(this.innerObject, this.chunks, this.material);
	}

	destroy() {
		this.app.shared.scene.remove(this.object);
	}

	get offset() {
		return this.innerObject.position;
	}
};

module.exports = Blocks;