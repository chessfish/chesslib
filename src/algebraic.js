import { WHITE, KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } from './brands';
import { Point } from './point';
import { King, Queen, Rook, Bishop, Knight, Pawn } from './standard';
import { EnPassantTarget } from './eptarget';
import { ChessError, AmbiguityError, MobilityError } from './error';
import {
	squareCoords,
	rankIndex,
	fileIndex,
	rankName,
	fileName,
	squareName
} from './util';
const unique = require('lodash.uniq');

export const Algebraic = {
	parse,
	stringify,
	get chunker() { return chunker; }
};

export const chunker = /([KQRBN])?([a-h]?[1-8]?)?x?([a-h][1-8])(?:=([QRBN]))?/;

export function parse(algStr, position) {
	if (algStr === 'O-O' || algStr === 'O-O-O') {
		return castlingMove(algStr, position);
	}
	return normalMove(algStr, position);
}

export function stringify({
		piece,
		target,
		source=position.pieceCoords(piece),
		isCapture=position.pieceByCoords(target) != null,
		promotionPrize=null
	},
	position
) {
	const initial = stringifyPiece(piece);
	const disambiguator = [];

	for (var p of pieces(position, null, target, stringifyPiece(piece))) {
		if (p === piece) {
			continue;
		}
		const pCoords = position.pieceCoords(p);
		if (pCoords.y === source.y) {
			disambiguator.push(rankName(source.y));
		}
		else {
			disambiguator.push(fileName(source.x));
		}
	}
	const capture = isCapture ? 'x' : '';
	const targetSquare = squareName(target);
	return [
		initial,
		...unique(disambiguator),
		capture,
		targetSquare
	].join('');
}

function *pieces(position, source, target, i='') {
	const Brand = pieceBrand(i);
	if (Brand === King) {
		yield getKing(position);
	}
	else {
		for (var p of candidates(position, Brand.brand, source, target)) {
			yield p;
		}
	}
}

function *candidates(position, brand, source, target) {
	for (var p of position.query({ brand, color: position.activeColor })) {
		const loc = position.pieceCoords(p);
		if (source == null || source.x === loc.x || source.y === loc.y) {
			try {
				// best way to find out if the piece can move is to move it:
				position.movePiece(p, target);
				yield p;
			}
			catch (e) {
				if (e instanceof ChessError) {
					continue;
				}
				throw e;
			}
		}
	}
}

function pieceBrand(i) {switch (i) {
	case 'K': return King;
	case 'Q': return Queen;
	case 'R': return Rook;
	case 'B': return Bishop;
	case 'N': return Knight;
	case '': return Pawn;
}}

function parsePromotionPrize(i, color) {switch (i) {
	case 'Q': return new Queen({ color });
	case 'R': return new Rook({ color });
	case 'B': return new Bishop({ color });
	case 'N': return new Knight({ color });
}}

function parseSource(s) {
	if (s == null) {
		return null;
	}
	if (!isNaN(Number(s))) {
		return new Point(NaN, rankIndex(s));
	}
	return new Point(fileIndex(s), NaN);
}

function normalMove(algStr, position) {
	const [_, i, s, t, p] = chunker.exec(algStr);
	const source = parseSource(s);
	const target = squareCoords(t);
	const promotionPrize = parsePromotionPrize(p, position.activeColor);
	const [piece, extra] = [ ...pieces(position, source, target, i) ];
	if (piece == null) {
		throw new MobilityError(algStr, position);
	}
	if (extra != null) {
		throw new AmbiguityError(algStr);
	}
	const { captureTarget, capturePiece, isEnPassant }
		= EnPassantTarget.capturablePiece(position, piece, target);
	return {
		piece,
		source: position.pieceCoords(piece),
		target,
		isCapture: capturePiece != null,
		captureTarget,
		capturePiece,
		isEnPassant,
		promotionPrize,
	};
}

function castlingMove(algStr, position) {
	const king = position.one({ brand: KING, color: position.activeColor });
	return {
		piece: king,
		source: position.pieceCoords(king),
		target: getCastlingCoords(algStr, position),
		isCapture: false,
		capturePiece: null,
		isEnPassant: false,
		promotionPrize: null,
	};
}

function getCastlingCoords(algStr, position) {switch (algStr) {
	case 'O-O':
		return squareCoords(position.activeColor === WHITE ? 'g1' : 'g8');
	case 'O-O-O':
		return squareCoords(position.activeColor === WHITE ? 'c1' : 'c8');
}}

function getKing(position) {
	return position.one({ brand: King.brand, color: position.activeColor });
}

function stringifyPiece(piece) {switch (piece.brand) {
	case KING: return 'K';
	case QUEEN: return 'Q';
	case ROOK: return 'R';
	case BISHOP: return 'B';
	case KNIGHT: return 'N';
	case PAWN: return '';
}}
