import { WHITE, BLACK } from '../brands'

export class Piece {

	constructor({ color } = {}) {
		this.color = color;
		this.mobility = [];
	}

	*moves(position) {
		const loc = position.pieceCoords(this);
		for (var m of this.mobility) {
			for (var move of m.adjacentPoints(position, loc)) {
				yield move;
			}
		}
	}

	canMove(position, from, to) {
		for (var m of this.mobility) {
			const success = m.test(position, from, to);
			if (success) {
				return true;
			}
		}
		return false;
	}

	canCapture(position, from, to) {
		// most pieces capture the same way they move:
		return this.canMove(position, from, to);
	}

	toString() {
		return this.constructor.name;
	}

	get isWhite() {
		return this.color === WHITE;
	}

	get isBlack() {
		return this.color === BLACK;
	}
}
