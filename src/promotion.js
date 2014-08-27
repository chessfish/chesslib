import { WHITE, BLACK, PAWN } from './brands'
import { oppositeColor } from './util'

export const Promotion = {

	square(position) {
		const color = oppositeColor(position.activeColor);
		for (var pawn of position.pieces({ brand: PAWN, color })) {
			const square = position.pieceCoords(pawn);
			if (square.y === Promotion.rank(color)) {
				return square;
			}
		}
		return null;
	},

	rank(color) {switch (color) {
		case WHITE: return 0;
		case BLACK: return 7;
	}},

};
