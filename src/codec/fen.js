import { WHITE, BLACK } from '../brands'
import { Pawn, Rook, Knight, Bishop, King, Queen } from '../piece/standard'
import { Castling } from '../piece/king/castling'
import { Position } from '../position'
import { Point } from '../point'

export const FEN = {

	parse(fenStr) {
		const [
			ranks,
			activeColor,
			castling,
			enPassantTarget,
			halfmoveClock,
			fullmoveClock
		] = fenStr.split(' ');
		return new Position({
			board: parseRanks(ranks),
			activeColor: parseActiveColor(activeColor),
			castling: parseCastling(castling),
			enPassantTarget: parseEPTarget(enPassantTarget),
			halfmoveClock: parseClock(halfmoveClock),
			fullmoveClock: parseClock(fullmoveClock)
		});
	},

	stringify(position) {
		return stringifyPosition(position);
	}

}

function parseRanks(ranks) {
	return ranks.split('/').map(parseRank);
}

function parseRank(rank) {
	const cells = rank.split('');
	const row = [];
	for (var i = 0, c = 0; i < 8; c++) {
		var cell = rank[c];
		if (!isNaN(Number(cell))) {
			i += Number(cell);
			continue;
		}
		var piece = createPiece(cell);
		if (piece != null) {
			row[i] = piece;
		}
		i += 1;
	}
	return row;
}

function createPiece(piece='') {
	const lowered = piece.toLowerCase();
	const options = { color: lowered === piece ? BLACK : WHITE };
	switch (lowered) {
	case 'p': return new Pawn(options);
	case 'r': return new Rook(options);
	case 'n': return new Knight(options);
	case 'b': return new Bishop(options);
	case 'k': return new King(options);
	case 'q': return new Queen(options);
	case '': return null;
	default: throw new SyntaxError('Unparseable: ' + piece);
	}
}

function parseActiveColor(activeColor) {switch (activeColor) {
	case 'w': return WHITE;
	case 'b': return BLACK;
}}

function parseCastling(castling) {
	return new Castling({ fenEncoding: castling });
}

function parseEPTarget(enPassantTarget) {switch (enPassantTarget) {
	case '-': return null;
	default: return enPassantTarget;
}}

function parseClock(clock) {
	if (clock == null) {
		return null;
	}
	return Number(clock);
}

function stringifyPosition(position) {
	return [
		stringifyRanks(position),
		stringifyActiveColor(position.activeColor),
		stringifyCastling(position.castling),
		stringifyEPTarget(position.enPassantTarget),
		stringifyClock(position.halfmoveClock),
		stringifyClock(position.fullmoveClock)
	].filter(Boolean).join(' ');
}

function stringifyRanks(position) {
	var ranks = '';
	for (var i = 0; i < 8; i++) {
		for (var j = 0, count = 0; j < 8; j++) {
			var piece = position.pieceByCoords(new Point(j, i));
			if (piece == null) {
				count += 1;
				if (j === 7) {
					ranks += `${count ? count : ''}${i !== 7 ? '/' : ''}`;
				}
				continue;
			}
			ranks += `${count ? count : ''}${piece.fenEncoding}`;
			if (j === 7 && i !== 7) {
				ranks += '/';
			}
			count = 0;
		}
	}
	return ranks;
}

function stringifyActiveColor(activeColor) {switch (activeColor) {
	case WHITE: return 'w';
	case BLACK: return 'b';
}}

function stringifyCastling(castling) {
	return String(castling);
}

function stringifyEPTarget(enPassantTarget) {
	if (enPassantTarget == null) {
		return '-';
	}
	return String(enPassantTarget);
}

function stringifyClock(clock) {
	if (clock == null) {
		return null;
	}
	return String(clock);
}
