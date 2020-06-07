const DP1_TEETH_HEIGHT = 2.8;
const COG_HEIGHT = 1;
const COG_EXTRUDE_SETTINGS =  {
	steps: 1,
	depth: COG_HEIGHT,
	bevelEnabled: false,
};
// const UPDATE_INTERVAL = 40; 
// const MASTER_INTERVAL_ANGLE_FRAC_UPDATE = 1000 / UPDATE_INTERVAL * 60;
const CONNECTOR_RADIUS_FRACTION = 0.1;
const MASTER_INTERVAL_1MS_ANGLE_UPDATE = 2 * Math.PI / 60000;

const POINTER_HEIGHT = 0.2;
const POINTER_EXTRUDE_SETTINGS =  {
	steps: 1,
	depth: POINTER_HEIGHT,
	bevelEnabled: false,
};
