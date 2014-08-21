import { PAWN, ROOK, KING } from './brands';

export class HalfmoveClock {

	constructor(count=0, source=null) {
		this.count = count;
		this.source = source;
	}

	inc() {
		return new HalfmoveClock(this.count + 1);
	}

	toString() {
		return String(this.count);
	}

	static analyze(position, piece, target) {
		if (piece.brand === PAWN) {
			// it's a pawn move.
			return new HalfmoveClock(0);
		}
		if (position.pieceByCoords(target) != null) {
			// it's a capture.
			return new HalfmoveClock(0);
		}
		if (piece.brand === ROOK) {
			// need to handle the case that the piece is a rook.
		}
		if (piece.brand === KING) {
			// need to handle the case that the piece is a king.
		}
		return position.halfmoveClock.inc();
	}
}
