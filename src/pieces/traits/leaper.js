import { Point } from '../../point'
import { Mobility, quadrants } from '../../mobility';
import { squareName } from '../../util';

const flatten = require('lodash.flatten');

class LeaperMobility extends Mobility {
	adjacentPoints(p0) {
		const { m, n } = this;

		return flatten(quadrants.map((p1) =>
			[
				p0.add(p1.mult(new Point(m, n))),
				p0.add(p1.mult(new Point(n, m))),
			]
		));
	}

	toString() {
		return `(${this.scope}) leaper`;
	}
}

export function Leaper(m, n) {
	this.mobility.push(new LeaperMobility(m, n));
}
