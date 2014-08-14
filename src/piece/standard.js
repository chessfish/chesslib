import { QUEEN, KNIGHT, BISHOP, ROOK } from '../brands'
import { Piece } from './piece'
import { Leaper } from './mobility/leaper'
import { Rider } from './mobility/rider'
import { Royal } from './mobility/royal'

export { Pawn } from './pawn'
export { King } from './king'

export class Queen extends Piece {
	constructor(options) {
		super(options);
		Rider.call(this, 1, 0);
		Rider.call(this, 1, 1);
	}
	get brand() {
		return QUEEN;
	}
	get unicode() {
		return this.isWhite ? '♕' : '♛';
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
	get brand() {
		return ROOK;
	}
	get unicode() {
		return this.isWhite ? '♖' : '♜';
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
	get brand() {
		return BISHOP;
	}
	get unicode() {
		return this.isWhite ? '♗' : '♝';
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
	get brand() {
		return KNIGHT;
	}
	get unicode() {
		return this.isWhite ? '♘' : '♞';
	}
	get fenEncoding() {
		return this.isWhite ? 'N' : 'n';
	}
}
