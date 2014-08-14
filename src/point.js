export class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equal({ x, y }) {
		return this.x === x && this.y === y;
	}

	sum({ x, y }) {
		return new Point(this.x + x, this.y + y);
	}

	difference({ x, y }) {
		return new Point(this.x - x, this.y - y);
	}

	product({ x, y }) {
		return new Point(this.x * x, this.y * y);
	}
}
