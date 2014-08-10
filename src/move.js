export class Move {
	static isLegal({ position, piece, targetSquare }) {
		if (position.activeColor !== piece.color) {
			return false;
		}
		return true;
	}
}
