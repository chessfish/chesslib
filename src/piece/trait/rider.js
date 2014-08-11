import { Point } from '../../point'
import { Mobility, quadrants } from '../mobility';

class RiderMobility extends Mobility {
	*adjacentPoints(p0) {
		const { m, n } = this;

		for (var p1 of quadrants) {
			for (var r = 0; r < 8; r++) {
				const rad = new Point(r, r);

				yield p0.add(p1.mul(new Point(m, n).mul(rad)));
				yield p0.add(p1.mul(new Point(n, m).mul(rad)));
			}
		}
	}

	toString() {
		return `(${this.scope}) rider`;
	}
}

export function Rider(m, n) {
	this.mobility.push(new RiderMobility(m, n));
}
