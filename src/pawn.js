import { PAWN } from './brands'
import { Piece } from './piece'
import { squareName } from './util'

export class Pawn extends Piece {

	get fenEncoding() {
		return this.isWhite ? 'P' : 'p';
	}

	get homeRank() {
		return this.isWhite ? 6 : 1;
	}

	get reach() {
		return this.isWhite ? -1 : 1;
	}

	canMove(position, from, to) {
		// pawns can only move forwards:
		if (from.x !== to.x) {
			return false;
		}
		const reach = this.reach;
		// pawns can move two squares on their first move.
		if (from.y === this.homeRank) {
			return to.y === from.y + reach || to.y === from.y + reach * 2;
		}
		return to.y === from.y + reach;
	}

	canCapture(position, from, to) {
		return (
			// it's one rank "below" the pawn to be captured:
			to.y === from.y + this.reach &&
			// it's a from a neighboring file:
			(from.x === to.x + 1 || from.x === to.x - 1)
		);
	}

	static get brand() {
		return PAWN;
	}
}
