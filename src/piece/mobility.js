import { PAWN } from '../brands'
import { Point } from '../point'
import { squareName, squareCoords } from '../util'

export class Mobility {

	constructor (m, n) {
		this.m = m;
		this.n = n;
	}

	test(src, dest) {
		for (var adj of this.adjacentPoints(src)) {
			if (dest.equal(adj)) {
				return true;
			}
		}
		return false;
	}

	*adjacentPoints(coords) {
		throw new Error("subclass must override Mobility#adjacentPoints");
	}

	get scope() {
		return [this.m, this.n];
	}

	static isLegal({ position, piece, targetSquare }) {
		// a piece cannot move out of turn.
		if (position.activeColor !== piece.color) {
			return false;
		}
		const targetPiece = position.getPiece(targetSquare);
		if (targetPiece) {
			// a piece cannot move to a square occupied by a piece of its color.
			if (piece.color === targetPiece.color) {
				return false;
			}
			// a piece must be able to legally capture at the square.
			return legally(
				'canCapture',
				position,
				piece,
				targetSquare
			);
		}
		// a piece must be able to legally move to the vacant square;
		return legally('canMove', position, piece, targetSquare);
	}
}

export const quadrants = [
	new Point(1, 1),
	new Point(1, -1),
	new Point(-1,	1),
	new Point(-1, -1),
];

function legally(method, position, piece, targetSquare) {
	const from = position.getPieceCoords(piece);
	const to = squareCoords(targetSquare);
	return piece[method](from, to);
}

