import { Point } from '../../point'
import { Mobility, quadrants } from '../mobility'

class RoyalMobility extends Mobility {

	*adjacentPoints(position, p0) {
		const { m, n } = this;

		for (var o of [new Point(m, n), new Point(n, m)]) {
			for (var p1 of quadrants) {
				yield p0.sum(p1.product(o));
			}
		}
	}

	toString() {
		return 'royal';
	}
}

export function Royal() {
	this.mobility.push(new RoyalMobility(1, 0));
	this.mobility.push(new RoyalMobility(1, 1));
}
