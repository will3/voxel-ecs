var shortid = require('shortid');
var THREE = require('three');
var ee = require('event-emitter');

class App {
	constructor() {
		this.map = {};
		this.shared = {};
		this.delta = 1000 / 60;
	}

	add(obj) {
		if (obj._id == null) {
			obj._id = shortid();
		}
		obj.app = this;
		this.map[obj._id] = obj;

		this.emit('add', obj);
	};

	remove(obj) {
		obj._removed = true;

		this.emit('remove', obj);
	};

	tick() {
		this.emit('beforeTick');

		var obj;
		for (var id in this.map) {
			obj = this.map[id];
			if (!obj._started) {
				if (obj.start != null) {
					obj.start();
				}
				obj._started = true;
			}
		}

		for (var id in this.map) {
			obj = this.map[id];
			if (obj.tick != null) {
				obj.tick();
			}
		}

		var idsToRemove = [];

		for (var id in this.map) {
			obj = this.map[id];
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
			delete this.map[id];
		}

		this.emit('afterTick');
	};
}

ee(App.prototype);

module.exports = function() {
	return new App();
};