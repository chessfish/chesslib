import { PAWN } from '../../brands'
import { Point } from '../../point'
import { squareCoords, squareName } from '../../util'

export class EnPassantTarget {

	constructor(fenEncoding) {
		if (fenEncoding instanceof EnPassantTarget) {
			return fenEncoding;
		}
		this.fenEncoding = fenEncoding;
	}

	coords() {
		return this.fenEncoding && squareCoords(this.fenEncoding);
	}

	offset() {
		return new Point(0, this.coords().y === 3 ? -1 : 1);
	}

	equal(squareNameP) {
		return this.fenEncoding && this.coords().equal(squareCoords(squareNameP));
	}

	toString() {
		return this.fenEncoding || '-';
	}

	static get(position, piece, targetSquare) {
		if (piece.brand !== PAWN) {
			return null;
		}
		const target = squareCoords(targetSquare);
		const { y: thrust } = target.difference(position.getPieceCoords(piece));

		if (Math.abs(thrust) === 2) {
			return squareName(target.difference(new Point(0, piece.reach)));
		}
		return null;
	}
}
