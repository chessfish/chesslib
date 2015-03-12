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

	lt({ x, y }) {
		return this.x < x && this.y < y;
	}

	lte({ x, y }) {
		return this.x <= x && this.y <= y;
	}

	gt({ x, y }) {
		return this.x > x && this.y > y;
	}

	gte({ x, y }) {
		return this.x >= x && this.y >= y;
	}

	*to(that) {
		const [[x0, x1],[y0, y1]] = [
			[Math.min(this.x, that.x), Math.max(this.x, that.x)],
			[Math.min(this.y, that.y), Math.max(this.y, that.y)],
		];
		for(var i = y0; i < y1; i++) {
			for(var j = x0; j < x1; j++) {
				yield new Point(j, i);
			}
		}
	}
}
