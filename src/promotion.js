import { WHITE, BLACK, PAWN } from './brands'

export const Promotion = {

	square(position) {
		const { activeColor: color } = position;
		for (var pawn of position.queryAll({ brand: PAWN, color })) {
			const square = position.pieceCoords(pawn);
			if (square.y === Promotion.rank(color)) {
				return square;
			}
			return null;
		}
	},

	rank(color) {switch (color) {
		case WHITE: return 0;
		case BLACK: return 7;
	}},

};
