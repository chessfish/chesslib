import { WHITE, BLACK } from '../brands';
import { Pawn, Rook, Knight, Bishop, King, Queen } from '../piece/standard';
import { Castling } from '../innovation/castling';
import { EnPassantTarget } from '../piece/pawn/eptarget';
import { Position } from '../position';
import { Board } from '../board';
import { Point } from '../point';
import { squareCoords } from '../util';

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
	},

	get standard() {
		return standard;
	},

	get standardPosition() {
		return standardPosition;
	}
};

export const standard
	= 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const standardPosition = FEN.parse(standard);

function parseRanks(ranks) {
	const board = new Board();
	ranks.split('/').forEach((rank, i) => {
		parseRank(rank, board, i);
	});
	return board;
}

function parseRank(rank, board, i) {
	const cells = rank.split('');
	for (var j = 0, c = 0; j < board.files; c++) {
		var cell = rank[c];
		if (!isNaN(Number(cell))) {
			// In FEN, a number means "skip this many squares":
			j += Number(cell);
			continue;
		}
		board.placePiece(createPiece(cell), new Point(j, i));
		// not getting too fancy:
		j += 1;
	}
}

function createPiece(piece) {
	const lowered = piece.toLowerCase();
	const options = { color: lowered === piece ? BLACK : WHITE };
	switch (lowered) {
	case 'p': return new Pawn(options);
	case 'r': return new Rook(options);
	case 'n': return new Knight(options);
	case 'b': return new Bishop(options);
	case 'k': return new King(options);
	case 'q': return new Queen(options);
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
	case '-':
		return EnPassantTarget.null();
	default:
		return EnPassantTarget.fromPoint(squareCoords(enPassantTarget));
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
	return String(enPassantTarget);
}

function stringifyClock(clock) {
	if (clock == null) {
		return null;
	}
	return String(clock);
}
