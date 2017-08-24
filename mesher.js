var mesher = require('./monotone').mesher;
var THREE = require('three');

module.exports = function(object, chunks, material) {
	for (var id in chunks.map) {
		var region = chunks.map[id];

		if (!region.dirty) {
			continue;
		}

		meshRegion(object, region, material);

		region.dirty = false;
	}
};

function meshRegion(object, region, material) {
	if (region.mesh != null) {
		region.mesh.parent.remove(region.mesh);
		region.mesh.geometry.dispose();
	}

	var geometry = new THREE.Geometry();

	var size = region.chunk.size;
	var results = mesher(function(i, j, k) {
		return region.chunk.get(i, j, k);
	}, [ size, size, size ]);

	results.vertices.forEach(function(v) {
		geometry.vertices.push(new THREE.Vector3(v[0], v[1], v[2]));
	});

	results.faces.forEach(function(f) {
		var face = new THREE.Face3(f[0], f[1], f[2]);
		face.materialIndex = f[3];
		geometry.faces.push(face);
	});

	region.mesh = new THREE.Mesh(geometry, material);
	region.mesh.position.fromArray(region.origin);

	geometry.computeFaceNormals();

	object.add(region.mesh);
};