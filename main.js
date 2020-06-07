let scene;
let renderer;
let camera;

function init() {
	// create a scene, that will hold all our elements such as objects, cameras and lights.
	scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 120;

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
	spotLight.position.set(0, 300, 120);
	spotLight.angle = Math.PI * 25 / 180;
	scene.add(spotLight);

	const spotLight2 = new THREE.SpotLight(0xffffff);
	spotLight2.position.set(0, -300, 120);
	spotLight2.angle = Math.PI * 25 / 180;
	scene.add(spotLight2);

	const spotLight3 = new THREE.SpotLight(0xffffff);
	spotLight3.position.set(0, -100, -120);
	spotLight3.angle = Math.PI * 25 / 180;
	scene.add(spotLight3);

	document.body.appendChild( renderer.domElement );
}


function addCogWithMesh(teethCount, diametralPitch) {
	const cog = new Cog(teethCount, diametralPitch);
	createCogMesh(cog);
	scene.add(cog.generateMesh());

	return cog;
}


/**
 * adds a connector element between from_cog and to_cog.
 * It assumes that they are already properly centered one above the other.
 */
function addConnectorBetween(from_cog, to_cog) {
	const radiusReference = from_cog.innerRadius < to_cog.innerRadius ? from_cog : to_cog;

	const radius = CONNECTOR_RADIUS_FRACTION * radiusReference.innerRadius;
	const height = Math.abs(from_cog.position.z - to_cog.position.z) - COG_HEIGHT;
	const connector = createConnectorMesh(radius, height);

	if(from_cog.position.z < to_cog.position.z) {
		setConnectorAbove(from_cog, connector);
	} else {
		setConnectorBelow(from_cog, connector);
	}

	from_cog.addSameRotator(connector);
	from_cog.addSameRotator(to_cog);

	scene.add(connector);

	return connector;
}


init();

const masterCog = addCogWithMesh(8, 1);

// TODO: Cog framework working. Great! Next steps:
// DONE (I guess) 1. Work on additional elements (planets, dials, make them work smoothly as well)
// DONE 2. Design normal clock, and sun+earth
// 3. textures, nice looks, and nice background
// 4. Synchronizing clock to the current date


// --- REGULAR CLOCK ---

const clock16Extension = addCogWithMesh(16, 1);
setCogAtAngle(masterCog, clock16Extension, 0);
masterCog.addDependantElement(clock16Extension);

const second8 = addCogWithMesh(8, 1);
setCogAtAngle(clock16Extension, second8, 0);
clock16Extension.addDependantElement(second8);

const secondPointerConnector = createConnectorMesh(second8.innerRadius * 0.1, 1);
scene.add(secondPointerConnector);
setConnectorAbove(second8, secondPointerConnector);
second8.addSameRotator(secondPointerConnector);

const secondPointer = createPointerMesh(
	second8.innerRadius * 3,
	second8.innerRadius * 0.1
);
scene.add(secondPointer);
setPointerAboveConnector(secondPointerConnector, secondPointer);
second8.addSameRotator(secondPointer);

const minute8_1rpm = addCogWithMesh(8, 2);
setCogBelow(second8, minute8_1rpm, 1);
addConnectorBetween(second8, minute8_1rpm);

const minute48 = addCogWithMesh(48, 2);
setCogAtAngle(minute8_1rpm, minute48, 7/6 * Math.PI);
minute8_1rpm.addDependantElement(minute48);

const minute8_10rph = addCogWithMesh(8, 2);
setCogBelow(minute48, minute8_10rph, 1);
addConnectorBetween(minute48, minute8_10rph);

const minute80 = addCogWithMesh(80, 2);
setCogAtAngle(minute8_10rph, minute80, Math.PI / 4);
minute8_10rph.addDependantElement(minute80);

const minutePointerConnector = createConnectorMesh(minute80.innerRadius * 0.05, 6);
scene.add(minutePointerConnector);
setConnectorAbove(minute80, minutePointerConnector);
minute80.addSameRotator(minutePointerConnector);

const minutePointer = createPointerMesh(
	minute80.innerRadius * 0.6,
	minute80.innerRadius * 0.05
);
scene.add(minutePointer);
setPointerAboveConnector(minutePointerConnector, minutePointer);
minute80.addSameRotator(minutePointer);

const hour8_1rph = addCogWithMesh(8, 0.8);
setCogBelow(minute80, hour8_1rph, 1);
addConnectorBetween(minute80, hour8_1rph);

const hour32_3rp12h = addCogWithMesh(32, 0.8);
setCogPositionAtAngle(hour8_1rph, hour32_3rp12h, Math.PI);
hour8_1rph.addDependantElement(hour32_3rp12h);

const hour8_3rp12h = addCogWithMesh(8, 1);
setCogAbove(hour32_3rp12h, hour8_3rp12h, 3);
addConnectorBetween(hour32_3rp12h, hour8_3rp12h);

const hour24_1rp12h = addCogWithMesh(24, 1);
setCogAtAngle(hour8_3rp12h, hour24_1rp12h, Math.PI / 4);
hour8_3rp12h.addDependantElement(hour24_1rp12h);

const hour8_1rp12h_extension = addCogWithMesh(8, 1);
setCogAbove(hour24_1rp12h, hour8_1rp12h_extension, 1);
addConnectorBetween(hour24_1rp12h, hour8_1rp12h_extension);

const hour16_1rp12h_extension = addCogWithMesh(16, 1);
setCogAtAngle(hour8_1rp12h_extension, hour16_1rp12h_extension, Math.PI / 4);
hour8_1rp12h_extension.addDependantElement(hour16_1rp12h_extension);

const hour8_1rp12h = addCogWithMesh(8, 1);
setCogAtAngle(hour16_1rp12h_extension, hour8_1rp12h, -2 * Math.PI / 3);
hour16_1rp12h_extension.addDependantElement(hour8_1rp12h);


const hourPointerConnector = createConnectorMesh(hour8_1rp12h.innerRadius * 0.1, 0.2);
scene.add(hourPointerConnector);
setConnectorAbove(hour8_1rp12h, hourPointerConnector);
hour8_1rp12h.addSameRotator(hourPointerConnector);

const hourPointer = createPointerMesh(
	hour24_1rp12h.innerRadius * 0.6,
	hour24_1rp12h.innerRadius * 0.1
);
scene.add(hourPointer);
setPointerAboveConnector(hourPointerConnector, hourPointer); 
hour8_1rp12h.addSameRotator(hourPointer);

// --- REGULAR CLOCK END ---

// --- ASTRONOMICAL CLOCK ---
const astro48_1rp24h = addCogWithMesh(48, 1);
setCogAtAngle(hour24_1rp12h, astro48_1rp24h, Math.PI / 4);
hour24_1rp12h.addDependantElement(astro48_1rp24h);

const astro8_1rp24h = addCogWithMesh(8, 1);
setCogAbove(astro48_1rp24h, astro8_1rp24h, 1);
addConnectorBetween(astro48_1rp24h, astro8_1rp24h);

const astro40_1rp73d = addCogWithMesh(40, 1);
setCogAtAngle(astro8_1rp24h, astro40_1rp73d, 5 * Math.PI / 4);
astro8_1rp24h.addDependantElement(astro40_1rp73d);

const astro8_1rp73d = addCogWithMesh(8, 10);
setCogAbove(astro40_1rp73d, astro8_1rp73d, 1);
addConnectorBetween(astro40_1rp73d, astro8_1rp73d);

const astro584_1rpy = addCogWithMesh(584, 10);
setCogAtAngle(astro8_1rp73d, astro584_1rpy, Math.PI);
astro8_1rp73d.addDependantElement(astro584_1rpy);

const sunConnector = createConnectorMesh(astro584_1rpy.innerRadius * 0.01, 8);
setConnectorAbove(astro584_1rpy, sunConnector);
scene.add(sunConnector);
astro584_1rpy.addSameRotator(sunConnector);

const sun = createSphereMesh(4);
scene.add(sun);
setSphereAtConnector(sunConnector, sun);
astro584_1rpy.addSameRotator(sun);

const earth = createSphereMesh(2);
const earthArm = createArmMesh(astro584_1rpy.innerRadius, 3, earth);
scene.add(earthArm);
setAt(sunConnector, earthArm);
earthArm.position.z += 1;
astro584_1rpy.addSameRotator(earthArm);

// --- ASTRONOMICAL CLOCK END ---

function start() {
	let start;
	let lastT;

	function render(t) {
		// render using requestAnimationFrame
		if (start === undefined) {
			start = t;
			lastT = t;
		}
		const elapsed = t - start;
		const diff = t - lastT;

		lastT = t;
		
		masterCog.update(-MASTER_INTERVAL_1MS_ANGLE_UPDATE * diff);

		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	requestAnimationFrame(render);
}

start();

