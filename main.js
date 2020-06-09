let scene;
let renderer;
let camera;

function init() {
	// create a scene, that will hold all our elements such as objects, cameras and lights.
	scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	// create a render and set the size
	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	renderer.setSize(window.innerWidth, window.innerHeight);

	const ctr = new THREE.OrbitControls(camera, renderer.domElement);

	camera.position.set(0, 0, 80);
	ctr.update();

	const ambiColor = "#6778CE";
	const ambientLight = new THREE.AmbientLight(ambiColor, 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.x = directionalLight.position.y = 0;
	directionalLight.position.z = 1000;
	scene.add(directionalLight);

	const underSpotLight = new THREE.SpotLight(0xffffff, 0.8);
	underSpotLight.position.x = underSpotLight.position.y = 0;
	underSpotLight.position.z = -100;
	scene.add(underSpotLight);

	const helperSpotLight = new THREE.SpotLight(0xffffff, 0.2);
	helperSpotLight.position.y = 0;
	helperSpotLight.position.x = 50;
	helperSpotLight.position.z = 150;
	helperSpotLight.rotation.x = Math.PI / 4;

	helperSpotLight.castShadow = true;
	helperSpotLight.shadow = new THREE.LightShadow(
		new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
	);
	helperSpotLight.shadow.mapSize.width = 2048 * 8;
	helperSpotLight.shadow.mapSize.height = 2048 * 8;
	
	scene.add(helperSpotLight);

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

const textureLoader = new THREE.TextureLoader;

const masterCog = addCogWithMesh(8, 1);
masterCog.position = { y: -20 };

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


const sunTexture = textureLoader.load("assets/2k_sun.jpg");
const sun = createSphereMesh(4, new THREE.MeshPhongMaterial({
	map: sunTexture,
    emissive: 0xffffee,
    emissiveIntensity: 0.2,
}));
scene.add(sun);
setSphereAtConnector(sunConnector, sun);
astro584_1rpy.addSameRotator(sun);

const sunPointLight = new THREE.PointLight(0xffffff, 1, 200);
sunPointLight.position.x = sun.position.x;
sunPointLight.position.y = sun.position.y;
sunPointLight.position.z = sun.position.z;

sunPointLight.castShadow = true;
sunPointLight.shadow.mapSize.width = 2048 * 4;
sunPointLight.shadow.mapSize.height = 2048 * 4;

scene.add(sunPointLight);

const earthTexture = textureLoader.load("assets/earthmap1k.jpg");
const earthBumpmap = textureLoader.load("assets/earthbump1k.jpg");
const earth = createSphereMesh(2, new THREE.MeshPhongMaterial({
	map: earthTexture,
	bumpMap: earthBumpmap,
}));
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
		if (start === undefined) {
			start = t;
			lastT = t;
		}
		const elapsed = t - start;
		const diff = t - lastT;

		lastT = t;
		
		masterCog.update(-MASTER_INTERVAL_1MS_ANGLE_UPDATE * diff);
//		masterCog.update(- diff);

		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	requestAnimationFrame(render);
}

Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    if((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
};

Date.prototype.getDOY = function() {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};

function synchronize() {
	const now = new Date();
	const seconds = now.getSeconds();
	const minutes = now.getMinutes();
	let hours = now.getHours();
	hours = hours < 12 ? hours : hours - 12;
	const day = now.getDOY();

	secondPointer.rotation.z = Math.PI/2 - 2 * Math.PI * seconds / 60;
	minutePointer.rotation.z = Math.PI/2 - 2 * Math.PI * minutes / 60 + (-2 * Math.PI / 60 * seconds / 60);
	hourPointer.rotation.z = Math.PI/2 - 2 * Math.PI * hours / 12 + (-2 * Math.PI / 12 * minutes / 60);

	earthArm.rotation.z = 2 * Math.PI * day / (now.isLeapYear() ? 366 : 365);
}

synchronize();
start();

