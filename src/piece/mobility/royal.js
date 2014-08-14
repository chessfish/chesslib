import { KINGSIDE, QUEENSIDE } from '../../brands'
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

class CastlingMobility extends Mobility {

	constructor(side) {
		this.side = side;
	}

	*adjacentPoints(position, p0) {
		// implement the rules of castling.
	}
}

export function Royal() {
	this.mobility.push(new RoyalMobility(1, 0));
	this.mobility.push(new RoyalMobility(1, 1));
	this.mobility.push(new CastlingMobility(QUEENSIDE));
	this.mobility.push(new CastlingMobility(KINGSIDE));
}
