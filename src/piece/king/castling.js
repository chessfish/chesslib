import { QUEENSIDE, KINGSIDE, WHITE, BLACK } from '../../brands'

export class Castling {
	constructor(castling) {
		this.castling = parseCastling(castling);
	}

	isLegal(color, side) {
		return this.castling[color][side];
	}

	toString() {
		const mode = this.castling;
		return [
			mode[WHITE][KINGSIDE]   ? 'K' : '',
			mode[WHITE][QUEENSIDE]  ? 'Q' : '',
			mode[BLACK][KINGSIDE]   ? 'k' : '',
			mode[BLACK][QUEENSIDE]  ? 'q' : '',
		].join('') || '-';
	}
}

const blankMode = () =>
	({
		[KINGSIDE]: false,
		[QUEENSIDE]: false,
	});

const sides = {
	'q': QUEENSIDE,
	'k': KINGSIDE,
}

function parseCastling(castling) {
	const modes = {
		[WHITE]: blankMode(),
		[BLACK]: blankMode(),
	};
	String(castling).split('').forEach((mode) => {
		const modeLower = mode.toLowerCase();
		const color = modeLower === mode ? BLACK : WHITE;
		modes[color][sides[modeLower]] = true;
	})
	return modes;
}
