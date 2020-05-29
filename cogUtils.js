/**
 * Takes cog1 as a reference to which cog2 is to be set,
 * and sets cog2 at an angle to cog1, measured at the center points.
 **/ 
function setCogAtAngle(cog1, cog2, angle) {
	Rs = cog1.midRadius + cog2.midRadius;
	cog2.position = {
		x: cog1.position.x + Rs * Math.cos(angle),
		y: cog1.position.y + Rs * Math.sin(angle)
	};

	const rotCompensate = angle * cog1.midRadius / cog2.midRadius;

//	cog2.rotation = {
//		z: cog2.rotation.z + rotCompensate 
//	};
}
