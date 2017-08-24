var shortid = require('shortid');
var THREE = require('three');

module.exports = function() {
	var map = {};

	function add(obj) {
		if (obj._id == null) {
			obj._id = shortid();
		}
		obj.app = this;
		map[obj._id] = obj;
	};

	function remove(obj) {
		obj._removed = true;
	};

	function tick() {
		var obj;
		for (var id in map) {
			obj = map[id];
			if (!obj._started) {
				if (obj.start != null) {
					obj.start();
				}
				obj._started = true;
			}
		}

		for (var id in map) {
			obj = map[id];
			if (obj.tick != null) {
				obj.tick();
			}
		}

		var idsToRemove = [];

		for (var id in map) {
			obj = map[id];
			if (obj._removed && !obj._destroyed) {
				if (obj.destroy != null) {
					obj.destroy();
				}
				obj._destroyed = true;
				idsToRemove.push(obj._id);
			}
		}

		for (var i = 0; i < idsToRemove.length; i++) {
			var id = idsToRemove[i];
			delete map[id];
		}
	};

	return {
		add: add,
		remove: remove,
		tick: tick,
		scene: new THREE.Scene()
	};
};