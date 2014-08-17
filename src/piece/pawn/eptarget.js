import { PAWN } from '../../brands'
import { Point } from '../../point'
import { squareCoords, squareName } from '../../util'

export class EnPassantTarget extends Point {
	offset() {
		return new Point(0, this.y === 3 ? -1 : 1);
	}

	toString() {
		return squareName(this);
	}

	static fromPoint(point) {
		return new EnPassantTarget(point.x, point.y);
	}

	static analyze(position, piece, target) {
		if (piece.brand !== PAWN) {
			return null;
		}
		const { y: thrust } = target.difference(position.pieceCoords(piece));

		if (Math.abs(thrust) === 2) {
			return EnPassantTarget.fromPoint(new Point(0, -piece.reach).sum(target));
		}
		return new NullEnPassantTarget();
	}

	static capturablePiece(position, capturer, target) {
		if (capturer.brand !== PAWN || !target.equal(position.enPassantTarget)) {
			return {
				capturePiece: position.pieceByCoords(target),
				captureTarget: target,
				wasEnPassant: false,
			};
		}
		const captureTarget = target.sum(new Point(0, -capturer.reach));
		const capturePiece = position.pieceByCoords(captureTarget);
		if (capturePiece != null) {
			return {
				capturePiece,
				captureTarget,
				wasEnPassant: true,
			};
		}
	}

	static null() {
		return new NullEnPassantTarget();
	}
}

class NullEnPassantTarget extends EnPassantTarget {

	constructor() {}

	equal(other) {
		if (other instanceof NullEnPassantTarget) {
			return true;
		}
		return false;
	}

	toString() {
		return '-';
	}
}
