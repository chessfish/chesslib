import { KING, QUEEN, KNIGHT, BISHOP, ROOK, PAWN } from './constants'

export class Move {

	constructor(position, algebraic) {
		this.algebraic = algebraic;
		this.position = position;
		this.piece = getPiece(position, algebraic);
	}

}

function getPiece(position, algebraic) {
	const letter = algebraic.charAt(0);
	if (letter.toLowerCase() === letter) {
		return position.query({
			brand: PAWN,
			activeColor: position.activeColor,
		})
	}
	switch (letter) {
	case 'K':
		return position.query({
			brand: KING,
			color: position.activeColor,
		});
	case 'Q':
		return position.query({
			brand: QUEEN,
			color: position.activeColor,
		}).canAccess(algebraic).first();
	case 'N':
		return position.query({
			brand: KNIGHT,
			color: position.activeColor,
		}).canAccess(algebraic).first();
	case 'B':
		return position.queryAll({
			brand: BISHOP,
			color: position.activeColor,
		}).canAccess(algebraic).first();
	case 'R':
		return position.queryAll({
			brand: ROOK,
			color: position.activeColor,
		}).canAccess(algebraic).first();
	}
}