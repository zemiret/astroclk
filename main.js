let scene;
let renderer;
let camera;

function init() {
	// create a scene, that will hold all our elements such as objects, cameras and lights.
	scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 25;

	// create a render and set the size
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	const ctr = new THREE.OrbitControls(camera, renderer.domElement);
	const axesHelper = new THREE.AxesHelper( 5000 );
	scene.add( axesHelper );

	const ambiColor = "#0c0c0c";
	const ambientLight = new THREE.AmbientLight(ambiColor);
	scene.add(ambientLight);

	const spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(0, 100, 120);
	spotLight.angle = Math.PI * 25 / 180;
	scene.add(spotLight);

	const spotLight2 = new THREE.SpotLight(0xffffff);
	spotLight2.position.set(0, -100, 120);
	spotLight2.angle = Math.PI * 25 / 180;
	scene.add(spotLight2);

	const spotLight3 = new THREE.SpotLight(0xffffff);
	spotLight3.position.set(0, -100, -120);
	spotLight3.angle = Math.PI * 25 / 180;
	scene.add(spotLight3);

	document.body.appendChild( renderer.domElement );
}

function createMesh(cog) {
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
	const material = new THREE.MeshPhongMaterial({
		color: 0xff0000,
		flatShading: true,
	});

	const edges = new THREE.EdgesGeometry(geometry);
	const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

	const mesh = new THREE.Mesh(geometry, material) ;

	cog.mesh = mesh;
	cog.lineMesh = line;
}


init();

const cog1 = new Cog(16, 2);
createMesh(cog1);
scene.add(cog1.mesh);
scene.add(cog1.lineMesh);

//cog1.rotation = { z: 2 * Math.PI / 8 };

const cog2 = new Cog(8, 2);
createMesh(cog2);
scene.add(cog2.mesh);
scene.add(cog2.lineMesh);

setCogAtAngle(cog1, cog2, 0);

const alpha = 2 * Math.PI / 64;

setCogAtAngle(cog1, cog2, alpha);

const s = alpha * cog1.midRadius;
const l = 2 * Math.PI * cog2.midRadius;
const rot = s / l * 2 * Math.PI;

cog2.rotation = { z: rot};

render();

function render() {
	// render using requestAnimationFrame
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

