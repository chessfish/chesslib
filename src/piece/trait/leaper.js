import { Point } from '../../point'
import { Mobility, quadrants } from '../mobility';

class LeaperMobility extends Mobility {

	*adjacentPoints(position, p0) {
		const { m, n } = this;

		for (var p1 of quadrants) {
			yield p0.add(p1.mul(new Point(m, n)));
			yield p0.add(p1.mul(new Point(n, m)));
		}
	}

	toString() {
		return `(${this.scope}) leaper`;
	}
}

export function Leaper(m, n) {
	this.mobility.push(new LeaperMobility(m, n));
}
