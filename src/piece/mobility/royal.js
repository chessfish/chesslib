import { KINGSIDE, QUEENSIDE } from '../../brands';
import { Point } from '../../point';
import { Mobility, quadrants } from '../mobility';
import { Castling } from '../../castling';

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

	constructor(color, side) {
		this.color = color;
		this.side = side;
	}

	*adjacentPoints(position, p0) {
		if (position.castling.isLegal(this.color, this.side)) {
			yield p0.sum(Castling.kingOffset(this.color, this.side));
		}
	}
}

export function Royal() {
	this.mobility.push(new RoyalMobility(1, 0));
	this.mobility.push(new RoyalMobility(1, 1));
	this.mobility.push(new CastlingMobility(this.color, KINGSIDE));
	this.mobility.push(new CastlingMobility(this.color, QUEENSIDE));
}
