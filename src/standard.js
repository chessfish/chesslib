import { KING, QUEEN, KNIGHT, BISHOP, ROOK } from './brands';
import { Piece } from './piece';
import { Leaper } from './leaper';
import { Rider } from './rider';
import { Royal } from './royal';

export { Pawn } from './pawn';

export class King extends Piece {

	constructor(options) {
		super(options);
		Royal.call(this);
	}

	static get brand() {
		return KING;
	}

	canCapture(position, from, to) {
		// FIXME: this is an ugly hack:
		for (var m of [this.mobility[0], this.mobility[1]]) {
			const success = m.test(position, from, to);
			if (success) {
				return true;
			}
		}
		return false;
	}

	get fenEncoding() {
		return this.isWhite ? 'K' : 'k';
	}
}

export class Queen extends Piece {

	constructor(options) {
		super(options);
		Rider.call(this, 1, 0);
		Rider.call(this, 1, 1);
	}

	static get brand() {
		return QUEEN;
	}

	get fenEncoding() {
		return this.isWhite ? 'Q' : 'q';
	}
}

export class Rook extends Piece {

	constructor(options) {
		super(options);
		Rider.call(this, 1, 0);
	}

	static get brand() {
		return ROOK;
	}

	get fenEncoding() {
		return this.isWhite ? 'R' : 'r';
	}
}

export class Bishop extends Piece {

	constructor(options) {
		super(options);
		Rider.call(this, 1, 1);
	}

	static get brand() {
		return BISHOP;
	}

	get fenEncoding() {
		return this.isWhite ? 'B' : 'b';
	}
}

export class Knight extends Piece {

	constructor(options) {
		super(options);
		Leaper.call(this, 1, 2);
	}

	static get brand() {
		return KNIGHT;
	}

	get fenEncoding() {
		return this.isWhite ? 'N' : 'n';
	}
}
