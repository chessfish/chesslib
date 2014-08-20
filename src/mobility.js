import { PAWN } from './brands'
import { Point } from './point'
import { squareName, squareCoords } from './util'

export class Mobility {

	constructor (m, n) {
		this.m = m;
		this.n = n;
	}

	test(position, src, dest) {
		for (var adj of this.adjacentPoints(position, src)) {
			if (dest.equal(adj)) {
				return true;
			}
		}
		return false;
	}

	*adjacentPoints(position, coords) {
		throw new Error("subclass must override Mobility#adjacentPoints");
	}

	static isLegal({ position, piece, target, capturePiece }) {
		// a piece cannot move out of turn.
		if (position.activeColor !== piece.color) {
			return false;
		}
		if (capturePiece != null) {
			// a piece cannot move to a square occupied by a piece of its color.
			if (piece.color === capturePiece.color) {
				return false;
			}
			// a piece must be able to legally capture at the square.
			return legally('canCapture', position, piece, target);
		}
		// a piece must be able to legally move to the vacant square;
		return legally('canMove', position, piece, target);
	}
}

export const quadrants = [
	new Point(1, 1),
	new Point(1, -1),
	new Point(-1, 1),
	new Point(-1, -1),
];

function legally(method, position, piece, target) {
	return piece[method](position, position.pieceCoords(piece), target);
}
