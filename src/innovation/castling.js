import { Point } from '../point'
import { KING, ROOK, QUEENSIDE, KINGSIDE, WHITE, BLACK } from '../brands'
import { CheckError } from '../error'

export class Castling {

	constructor({
		fenEncoding='',
		modes=parseCastlingModes(fenEncoding),
		rook,
		square
	}) {
		this.modes = modes;
		this.rook = rook;
		this.square = square;
	}

	isLegal(color, side) {
		return this.modes[color][side];
	}

	toString() {
		const { modes } = this;
		return [
			modes[WHITE][KINGSIDE]   ? 'K' : '',
			modes[WHITE][QUEENSIDE]  ? 'Q' : '',
			modes[BLACK][KINGSIDE]   ? 'k' : '',
			modes[BLACK][QUEENSIDE]  ? 'q' : '',
		].join('') || '-';
	}

	static analyze(position, king, coords) {
		const { brand, color } = king;
		const { castling } = position;
		const side = Castling.side(position, king, coords);
		if (side == null || !castling.isLegal(color, side)) {
			return new Castling({ modes: castling.modes });
		}
		if (!isValid(position, color, side)) {
			throw new CheckError();
		}
		return new Castling({
			rook: Castling.rook(position, color, side),
			square: position.pieceCoords(king).
				sum(Castling.rookOffset(color, side)),
			modes: blankModes(),
		});
	}

	static side(position, king, coords) {
		if (king.brand !== KING) {
			return null;
		}
		for (var side of [KINGSIDE, QUEENSIDE]) {
			if (Castling.isCastlingMove(position, king, side, coords)) {
				return side;
			}
		}
		return null;
	}

	static rook(position, color, side) {
		const { x: kingX }
			= position.pieceCoords(position.query({ brand: KING, color }));

		for (var rook of position.queryAll({ brand: ROOK, color })) {
			const { x: rookX } = position.pieceCoords(rook);
			if (
				(rookX > kingX && side === KINGSIDE) ||
				(rookX < kingX && side === QUEENSIDE)
			) {
				return rook;
			}
		}
	}

	static isCastlingMove(position, king, side, coords) {
		return (
			position.
			pieceCoords(king).
			sum(Castling.kingOffset(king.color, side)).
			equal(coords)
		);
	}

	static kingOffset(color, side) {
		return new Point(xOffset(color, side, 2), 0);
	}

	static rookOffset(color, side) {
		return new Point(xOffset(color, side, -1), 0).
			sum(Castling.kingOffset(color, side));
	}
}

const blankMode = () =>
	({
		[KINGSIDE]: false,
		[QUEENSIDE]: false,
	});

const blankModes = () =>
	({
		[WHITE]: blankMode(),
		[BLACK]: blankMode(),
	});

const sides = {
	'q': QUEENSIDE,
	'k': KINGSIDE,
}

function parseCastlingModes(castling) {
	const modes = blankModes();
	String(castling || '').split('').forEach((mode) => {
		const modeLower = mode.toLowerCase();
		const color = modeLower === mode ? BLACK : WHITE;
		modes[color][sides[modeLower]] = true;
	})
	return modes;
}

function xOffset(color, side, m=1) {
	// this is intentionally written explicitly:
	if (color === WHITE) {
		if (side === KINGSIDE) {
			return m;
		} else if (side === QUEENSIDE) {
			return -m;
		}
	} else if (color === BLACK) {
		if (side === KINGSIDE) {
			return -m;
		} else if (side === QUEENSIDE) {
			return m;
		}
	}
}

function isValid(position, color, side) {
	const loc = position.pieceCoords(position.query({ brand: KING, color }));
	for (var pt of loc.to(loc.sum(Castling.kingOffset(color, side)))) {
		if (position.isCheck(color, pt)) {
			return false;
		}
	}
	return true;
}
