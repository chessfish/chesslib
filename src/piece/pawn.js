import { PAWN } from '../brands'
import { Piece } from './piece'

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

	canMove(from, to) {
		// pawns can only move forwards:
		if (from.x !== to.x) {
			return false;
		}
		const offset = this.isWhite ? -1 : 1;
		const startRow = this.isWhite ? 6 : 1;
		// pawns can move two squares on their first move.
		if (from.y === startRow) {
			return to.y === from.y + offset || to.y === from.y + offset * 2;
		}
		return to.y === from.y + offset;
	}
}