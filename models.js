class Cog {
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Vector extends Point {
	constructor(x, y) {
		super(x, y);
	}

	normalize() {
		const vecLen = this.len();
		this.x = this.x / vecLen;
		this.y = this.y / vecLen;

		return this;
	}

	mul(howMuch) {
		this.x *= howMuch;
		this.y *= howMuch;

		return this;
	}

	len() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
}

function addVec2Point(p, v) {
	return new Point(
		p.x + v.x,
		p.y + v.y
	);
}
