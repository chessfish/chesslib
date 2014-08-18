import { PAWN } from './brands';
import { Point } from './point';
import { King, Queen, Rook, Bishop, Knight, Pawn } from './piece/standard';
import { FEN } from './fen';
import { EnPassantTarget } from './eptarget';
import { squareCoords, rankIndex, fileIndex } from './util';
import { ChessError, AmbiguityError, MobilityError } from './error';

export const Algebraic = {
	parse,
	stringify,
	get chunker() { return chunker; }
};

export const chunker = /([KQRBNP])?([a-h]?[1-8]?)?x?([a-h][1-8])/;

export function	parse(algStr, position=FEN.standardPosition) {
	const [_, i, s, t] = chunker.exec(algStr);
	const source = parseSource(s);
	const target = squareCoords(t);
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
	};
}

export function stringify(move) {

}

function *pieces(position, source, target, i = 'p') {
	const Brand = pieceBrand(i);
	if (Brand === King) {
		yield position.one({
			brand: King.brand,
			color: position.activeColor
		});
	}
	else {
		for (var p of candidates(position, Brand.brand, source, target)) {
			yield p;
		}
	}
}

function pieceBrand(i) {switch (i.toLowerCase()) {
	case 'k': return King;
	case 'q': return Queen;
	case 'r': return Rook;
	case 'b': return Bishop;
	case 'n': return Knight;
	case 'p': return Pawn;
}}

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

function parseSource(s) {
	if (s == null) {
		return null;
	}
	if (!isNaN(Number(s))) {
		return new Point(0, rankIndex(s));
	}
	return new Point(fileIndex(s), 0);
}