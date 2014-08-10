import { PAWN } from '../constants'
import { Piece } from '../piece'

export class Pawn extends Piece {
	get brand() {
		return PAWN;
	}
	get unicode() {
		return this.isWhite ? '♙' : '♟';
	}
	get fenEncoding() {
		return this.isWhite ? 'P' : 'p';
	}
	canMove(position, targetSquare) {

	}
}