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

function setCogPositionAtAngle(cog1, cog2, angle) {
	Rs = cog1.midRadius + cog2.midRadius;
	cog2.position = {
		x: cog1.position.x + Rs * Math.cos(angle),
		y: cog1.position.y + Rs * Math.sin(angle)
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
