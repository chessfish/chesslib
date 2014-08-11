export class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equal({ x, y }) {
		return this.x === x && this.y === y;
	}

	add({ x, y }) {
		return new Point(this.x + x, this.y + y);
	}

	mul({ x, y }) {
		return new Point(this.x * x, this.y * y);
	}
}
