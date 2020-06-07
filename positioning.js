/**
 * Takes cog1 as a reference to which cog2 is to be set,
 * and sets cog2 at an angle to cog1, measured at the center points,
 * relative to the cog1 rotation
 **/ 
function setCogAtAngle(cog1, cog2, angle) {
	setCogInitialRotation(cog2);
	setCogPositionAtAngle(cog1, cog2, angle + cog1.rotation.z);
	compensateMasterCogRotation(cog1, cog2);
	compensateDependantCogRotation(cog1, cog2, angle);
}

/**
 * Sets cog2 above cog1
 **/ 
function setCogAbove(cog1, cog2, gapWidth) {
	cog2.position = {
		x: cog1.position.x,
		y: cog1.position.y,
		z: cog1.position.z + COG_HEIGHT + (gapWidth || 0)
	};
}

/**
 * Sets cog2 below cog1
 **/ 
function setCogBelow(cog1, cog2, gapWidth) {
	cog2.position = {
		x: cog1.position.x,
		y: cog1.position.y,
		z: cog1.position.z - COG_HEIGHT - (gapWidth || 0)
	};
}

function setConnectorAbove(cog, connector) {
	connector.position.x = cog.position.x;
	connector.position.y = cog.position.y;
	connector.position.z = cog.position.z + COG_HEIGHT;
}

function setConnectorBelow(cog, connector) {
	connector.position.x = cog.position.x;
	connector.position.y = cog.position.y;
	connector.position.z =
		cog.position.z - connector.geometry.parameters.height;
}

function setPointerAboveConnector(connector, pointer) {
	pointer.position.x = connector.position.x;
	pointer.position.y = connector.position.y;
	pointer.position.z = connector.position.z + connector.geometry.parameters.height;
}

function setAt(mesh1, mesh2) {
	mesh2.position.x = mesh1.position.x;
	mesh2.position.y = mesh1.position.y;
	mesh2.position.z = mesh1.position.z;
}

function setSphereAtConnector(connector, sphere) {
	sphere.position.x = connector.position.x;
	sphere.position.y = connector.position.y;
	sphere.position.z = connector.position.z + connector.geometry.parameters.height;
}

function setCogPositionAtAngle(cog1, cog2, angle) {
	Rs = cog1.midRadius + cog2.midRadius;
	cog2.position = {
		x: cog1.position.x + Rs * Math.cos(angle),
		y: cog1.position.y + Rs * Math.sin(angle),
		z: cog1.position.z
	};

}

function setCogInitialRotation(cog) {
	if (cog.teethCount % 2 != 0) {
		cog.rotation = { z: cog.theta / 2 };
	}
}

function compensateMasterCogRotation(cog1, cog2) { 
	cog2.rotation = { z: cog1.rotation.z + cog2.rotation.z };
}

function compensateDependantCogRotation(cog1, cog2, turnAngle) {
	const rotCompensationMul =
		(cog1.teethCount + cog2.teethCount) / cog2.teethCount;
	cog2.rotation = {z: cog2.rotation.z + turnAngle * rotCompensationMul };
}
