import { PAWN } from './brands'
import { squareCoords } from './util'

export class Move {
	static isLegal({ position, piece, targetSquare }) {
		// a piece cannot move out of turn.
		if (position.activeColor !== piece.color) {
			return false;
		}
		const targetPiece = position.getPiece(targetSquare);
		if (targetPiece) {
			// a piece cannot move to a square occupied by a piece of its color.
			if (piece.color === targetPiece.color) {
				return false;
			}
			// a piece must be able to legally capture at the square.
			return isCaptureLegal(
				position,
				piece,
				targetSquare,
				targetPiece
			);
		}
		// a piece must be able to legally move to the vacant square;
		return isMoveLegal(position, piece, targetSquare);
	}
}

function isCaptureLegal(position, piece, targetSquare, targetPiece) {
	// pawns capture differently than they move. Not sure if this is the best approach.
	if (piece.brand !== PAWN) {
		return isMoveLegal(position, piece, targetSquare);
	}
	return true;
}

function isMoveLegal(position, piece, targetSquare) {
	const from = position.getPieceCoords(piece);
	const to = squareCoords(targetSquare);
	return piece.canMove(from, to);
}
