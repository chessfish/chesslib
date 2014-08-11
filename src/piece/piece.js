import { WHITE, BLACK } from '../brands'

export class Piece {
	constructor({ color } = {}) {
		this.color = color;
		this.mobility = [];
	}

	canMove(from, to) {
		const m = this.mobility;
		for (var i = 0, len = m.length; i < len; i++) {
			const success = m[i].test(from, to);
			if (success) {
				return true;
			}
		}
		return false;
	}

  canCapture(from, to) {
    // most pieces capture the same way they move:
    return this.canMove(from, to);
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