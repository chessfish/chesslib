import { PAWN } from './brands';

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
		if (
			// it's a pawn move.
			(piece.brand === PAWN) ||
			// it's a capture.
			(position.pieceByCoords(target) != null)
		) {
			return new HalfmoveClock(0);
		}
		return position.halfmoveClock.inc();
	}
}
