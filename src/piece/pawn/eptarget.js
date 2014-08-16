import { PAWN } from '../../brands'
import { Point } from '../../point'
import { squareCoords, squareName } from '../../util'

export class EnPassantTarget extends Point {

	constructor(fenEncoding) {
		if (fenEncoding instanceof EnPassantTarget) {
			return fenEncoding;
		}
		if (fenEncoding != null) {
			const coords = squareCoords(fenEncoding);
			super(coords.x, coords.y);
		}
		else {
			super(-1, -1);
		}
		this.fenEncoding = fenEncoding;
	}

	offset() {
		return new Point(0, this.y === 3 ? -1 : 1);
	}

	equal(squareNameP) {
		return this.fenEncoding && super.equal(squareCoords(squareNameP));
	}

	toString() {
		return this.fenEncoding || '-';
	}

	static analyze(position, piece, targetSquare) {
		if (piece.brand !== PAWN) {
			return null;
		}
		const target = squareCoords(targetSquare);
		const { y: thrust } = target.difference(position.pieceCoords(piece));

		if (Math.abs(thrust) === 2) {
			return squareName(target.sum(new Point(0, -piece.reach)));
		}
		return null;
	}
}
