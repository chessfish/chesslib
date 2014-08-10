const deepEqual = require('deep-equal');

import { squareName } from './util'
import { Point } from './point'

export class Mobility {
	constructor (m, n) {
		this.m = m;
		this.n = n;
	}

	test(src, dest) {
		return this.adjacentPoints(src).some((adj) => deepEqual(dest, adj));
	}

	adjacentPoints(coords) {
		throw new Error("subclass must override Mobility#adjacentPoints");
	}

	get scope() {
		return [this.m, this.n];
	}
}

export const quadrants = [
	new Point(1, 1),
	new Point(1, -1),
	new Point(-1,	1),
	new Point(-1, -1),
];
