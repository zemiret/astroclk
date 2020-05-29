let scene;
let renderer;
let camera;

const DP1_TEETH_HEIGHT = 0.7;
const PRESSURE_ANGLE = Math.PI / 12;

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

function createGear(teethCount, diametralPitch) {
	const x = 0, y = 0;
	const pitchDiameter = teethCount / diametralPitch;
	const midRadius = pitchDiameter / 2;

	const teethHeight = DP1_TEETH_HEIGHT * diametralPitch; 
	const halfTeethHeight = teethHeight / 2;

	const innerRadius = midRadius - halfTeethHeight; 
	const outerRadius = midRadius + halfTeethHeight;

	const theta = 2 * Math.PI / teethCount;

	const shape = new THREE.Shape();
	shape.moveTo(innerRadius, 0);

	for(let i = 0; i < teethCount; ++i) {
		const startAlpha = i * theta;
		const endAlpha = (i + 1) * theta;

		const teethStartAlpha = startAlpha;
		const teethMiddleAlpha = startAlpha + theta / 4;
		const teethEndAlpha = endAlpha - theta / 2;

		const teethStartPoint = new Point(
				innerRadius * Math.cos(teethStartAlpha),
				innerRadius * Math.sin(teethStartAlpha),
			);

		const teethMidPoint = new Point(
				(midRadius + (teethHeight * 0.9)) * Math.cos(teethMiddleAlpha),
				(midRadius + (teethHeight * 0.9)) * Math.sin(teethMiddleAlpha),
			);

		const teethEndPoint = new Point(
				innerRadius * Math.cos(teethEndAlpha),
				innerRadius * Math.sin(teethEndAlpha),
			);

		const endPoint = new Point(
			innerRadius * Math.cos(endAlpha),
			innerRadius * Math.sin(endAlpha)
		);

		const dirVector = new Vector(
			teethMidPoint.x - x,
			teethMidPoint.y - y,
		).normalize().mul(teethHeight / 2);


		const teethP1 = new Point(
				(midRadius) * Math.cos(teethStartAlpha),
				(midRadius) * Math.sin(teethStartAlpha),
			);
		const teethP2 = new Point(
				(midRadius) * Math.cos(teethEndAlpha),
				(midRadius) * Math.sin(teethEndAlpha),
			);
		

		shape.lineTo(teethP1.x, teethP1.y);
//		shape.lineTo(teethP1.x, teethP1.y);
		shape.quadraticCurveTo(teethMidPoint.x, teethMidPoint.y, teethP2.x, teethP2.y);
//		shape.lineTo(teethP2.x, teethP2.y);
//		shape.lineTo();
		shape.lineTo(teethEndPoint.x, teethEndPoint.y);
		shape.lineTo(endPoint.x, endPoint.y);
	}
	
	const extrudeSettings = {
		steps: 1,
		depth: 1,
		bevelEnabled: false,
	};

	const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
	const material = new THREE.MeshPhongMaterial({
		color: 0xff0000,
		flatShading: true,
	});

	const edges = new THREE.EdgesGeometry( geometry );
	const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

	const mesh = new THREE.Mesh( geometry, material ) ;

	return {mesh, line};
}


init();

const {mesh, line} = createGear(8, 2);
mesh.position.x = line.position.x = 10;
mesh.rotation.z = line.rotation.z = - Math.PI / 16;

scene.add(mesh);
scene.add(line);

const gear2 = createGear(32, 2);
gear2.mesh.rotation.z = gear2.line.rotation.z = Math.PI / 64;
scene.add(gear2.mesh);
scene.add(gear2.line);

render();

function render() {
	// render using requestAnimationFrame
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

