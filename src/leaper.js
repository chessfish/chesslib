import { Point } from './point'
import { Mobility, quadrants } from './mobility';

class LeaperMobility extends Mobility {

	*adjacentPoints(position, p0) {
		const { m, n } = this;

		for (var o of [new Point(m, n), new Point(n, m)]) {
			for (var p1 of quadrants) {
				yield p0.sum(p1.product(o));
			}
		}
	}

	toString() {
		return `(${this.scope}) leaper`;
	}
}

export function Leaper(m, n) {
	this.mobility.push(new LeaperMobility(m, n));
}
