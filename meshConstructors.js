let metalicMaterial;

(function loadGlobalMaterials() {
	const textureLoader = new THREE.TextureLoader();

	metalicMaterial = new THREE.MeshPhongMaterial({
		color: 0x000000,
		specular: 0x444444,
		shininess: 20,
		normalMap: textureLoader.load('assets/Metal007_2K_Normal.jpg'),
		normalScale: new THREE.Vector2(3, 3),
	});
})();

function createCogMesh(cog) {
	const shape = new THREE.Shape();
	shape.moveTo(cog.innerRadius, 0);

	for(let i = 0; i < cog.teethCount; ++i) {
		const startAlpha = i * cog.theta;
		const endAlpha = (i + 1) * cog.theta;

		const teethStartAlpha = startAlpha;
		const teethMiddleAlpha = startAlpha + cog.theta / 4;
		const teethEndAlpha = startAlpha + cog.theta / 2;

		const teethP2 = new Point(
			cog.midRadius * Math.cos(teethStartAlpha),
			cog.midRadius * Math.sin(teethStartAlpha),
		);

		const teethP3 = new Point(
			(cog.midRadius + (cog.teethHeight * 0.9)) * Math.cos(teethMiddleAlpha),
			(cog.midRadius + (cog.teethHeight * 0.9)) * Math.sin(teethMiddleAlpha),
		);

		const teethP4 = new Point(
			cog.midRadius * Math.cos(teethEndAlpha),
			cog.midRadius * Math.sin(teethEndAlpha),
		);

		const teethP5 = new Point(
			cog.innerRadius * Math.cos(teethEndAlpha),
			cog.innerRadius * Math.sin(teethEndAlpha),
		);

		const endPoint = new Point(
			cog.innerRadius * Math.cos(endAlpha),
			cog.innerRadius * Math.sin(endAlpha)
		);

		shape.lineTo(teethP2.x, teethP2.y);
		shape.quadraticCurveTo(teethP3.x, teethP3.y, teethP4.x, teethP4.y);
		shape.lineTo(teethP5.x, teethP5.y);
		shape.lineTo(endPoint.x, endPoint.y);
	}

	const geometry = new THREE.ExtrudeGeometry(shape, COG_EXTRUDE_SETTINGS);

	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load("assets/Wood034_2K_Color.jpg");
	texture.repeat.set(0.02, 0.02);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	const material = new THREE.MeshPhongMaterial({
		map: texture,
	});

	const edges = new THREE.EdgesGeometry(geometry);
	const mesh = new THREE.Mesh(geometry, material) ;

	mesh.receiveShadow = true;
	mesh.castShadow = true;

	cog.mesh = new CogMesh(mesh);
}

function createConnectorMesh(radius, height) {
	const geometry = new THREE.CylinderBufferGeometry(radius, radius, height, 32);

	const textureLoader = new THREE.TextureLoader();
	const material = metalicMaterial;

	const cylinder = new THREE.Mesh(geometry, material);

	cylinder.rotation.x = Math.PI / 2;
	cylinder.position.z = geometry.parameters.height / 2;

	const pivot = new THREE.Object3D();
	pivot.geometry = geometry;
	pivot.add(cylinder);

	return pivot;
}

function createSphereMesh(radius, material) {
	material = material || new THREE.MeshBasicMaterial( {color: 0x00ffff} );
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const sphere = new THREE.Mesh( geometry, material );

	return sphere;
}

function createArmMesh(length, height, endShape) {
	function ArmCurve(length, height) {
		THREE.Curve.call( this );
		this.length = length;
		this.height = height;
	}

	ArmCurve.prototype = Object.create( THREE.Curve.prototype );
	ArmCurve.prototype.constructor = ArmCurve;

	ArmCurve.prototype.getPoint = function ( t ) {
		var radians = 3 * Math.PI / 2  + Math.PI / 2 * t;
		return new THREE.Vector3( this.length * Math.cos( radians ),
								  this.height + this.height * Math.sin( radians ),
								  0 );
	};

	const path = new ArmCurve(length, height);
	const geometry = new THREE.TubeGeometry(path, 32, 0.3, 8, false );

	const material = metalicMaterial;
	const mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	const group = new THREE.Group();
	group.add(mesh);

	if (endShape) {
		const endShapeX = length;
		const endShapeY = height +
			(endShape.geometry.parameters.height / 2 ||
			endShape.geometry.parameters.radius);	// somewhat stupid assumption to get height

		endShape.position.x = endShapeX;
		endShape.position.y = endShapeY;

		group.add(endShape);
	}

	group.rotation.z = Math.PI / 2;
	group.rotation.y = Math.PI / 2;
	const pivot = new THREE.Object3D();
	pivot.add(group);

	return pivot;
}

function createPointerMesh(length, radius, height) {
	height = height || POINTER_HEIGHT; 

	const textureLoader = new THREE.TextureLoader;

	const cylinderHeight = height * 1.2;
	const holdGeometry = new THREE.CylinderBufferGeometry(radius, radius, cylinderHeight, 32);
	const holdMaterial = metalicMaterial;
	const holdMesh = new THREE.Mesh(holdGeometry, holdMaterial);
	holdMesh.castShadow = true;
	holdMesh.receiveShadow = true;

	const stopX = length * 0.6;
	const width = radius * 1.4;

	const p1 = new Point(0, radius); 
	const p2 = new Point(stopX, width);
	const p3 = new Point(length, 0);
	const p4 = new Point(stopX, -width);
	const p5 = new Point(0, -radius);
	const p6 = new Point(0, 0);
	
	const shape = new THREE.Shape();
	shape.lineTo(p1.x, p1.y);
	shape.lineTo(p2.x, p2.y);
	shape.lineTo(p3.x, p3.y);
	shape.lineTo(p4.x, p4.y);
	shape.lineTo(p5.x, p5.y);
	shape.lineTo(p6.x, p6.y);

	const geometry = new THREE.ExtrudeGeometry(shape, POINTER_EXTRUDE_SETTINGS);
	const texture = textureLoader.load("assets/Wood026_2K_Color.jpg")
	texture.repeat.set(0.05, 0.05);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	const material = new THREE.MeshPhongMaterial({
		map: texture,
	});
	
	const mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	holdMesh.rotation.x = Math.PI / 2;
	holdMesh.position.z = cylinderHeight / 2;

	mesh.position.x = -radius * 1.2;

	const group = new THREE.Group();
	group.add(holdMesh);
	group.add(mesh);

	const pivot = new THREE.Object3D();
	pivot.add(group);

	return pivot;
}
