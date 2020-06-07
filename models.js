class Cog {
	constructor(teethCount, diametralPitch) {
		this.teethCount = teethCount;
		this.diametralPitch = diametralPitch;

		this.pitchDiameter = this.teethCount / this.diametralPitch;
		this.midRadius = this.pitchDiameter / 2;

		this.teethHeight = DP1_TEETH_HEIGHT / diametralPitch; 
		this.halfTeethHeight = this.teethHeight / 2;

		this.innerRadius = this.midRadius - this.halfTeethHeight; 
		this.outerRadius = this.midRadius + this.halfTeethHeight;

		this.theta = 2 * Math.PI / this.teethCount;

		this.mesh = null;

		this.dependantCogs = [];
		this.sameRotatorCogs = [];
	}

	get rotation() {
		return this.mesh.rotation;
	}

	get position() {
		return this.mesh.position;
	}

	set position(pos) {
		this.mesh.position = pos;
	}

	set rotation(rot) {
		this.mesh.rotation = rot;
	}

	generateMesh() {
		return this.mesh.generate();
	}

	update(rotAngleDelta) {
		this.rotation = { z: this.rotation.z + rotAngleDelta };

		for(const sameRotatorCog of this.sameRotatorCogs) {
			if(sameRotatorCog.update) {
				sameRotatorCog.update(rotAngleDelta);
			} else {
				sameRotatorCog.rotation.z += rotAngleDelta;
			}
		}

		for(const depenantCog of this.dependantCogs) {
			const speedup = this.teethCount / depenantCog.teethCount;
			depenantCog.update(-(speedup * rotAngleDelta));
		}
	}

	addDependantElement(cog) {
		this.dependantCogs.push(cog);
	}

	addSameRotator(cog) {
		this.sameRotatorCogs.push(cog);
	}
}

class CogMesh {
	constructor(mesh, lineMesh) {
		this.mesh = mesh;
		this.lineMesh = lineMesh;
	}

	generate() {
		const group = new THREE.Object3D;
		group.add(this.mesh);
		if (this.lineMesh) {
			group.add(this.lineMesh);
		}

		return group;
	}

	get rotation() {
		return this.mesh.rotation;
	}

	get position() {
		return this.mesh.position;
	}

	set position(pos) {
		pos.x = pos.x || this.mesh.position.x;
		pos.y = pos.y || this.mesh.position.y;
		pos.z = pos.z || this.mesh.position.z;

		this.mesh.position.x = pos.x;
		this.mesh.position.y = pos.y;
		this.mesh.position.z = pos.z;

		if (this.lineMesh) {
			this.lineMesh.position.x = pos.x;
			this.lineMesh.position.y = pos.y;
			this.lineMesh.position.z = pos.z;
		}
	}

	set rotation(rot) {
		rot.x = rot.x || this.mesh.rotation.x;
		rot.y = rot.y || this.mesh.rotation.y;
		rot.z = rot.z || this.mesh.rotation.z;

		this.mesh.rotation.x = rot.x;
		this.mesh.rotation.y = rot.y;
		this.mesh.rotation.z = rot.z;

		if (this.lineMesh) {
			this.lineMesh.rotation.x = rot.x;
			this.lineMesh.rotation.y = rot.y;
			this.lineMesh.rotation.z = rot.z;
		}
	}
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

