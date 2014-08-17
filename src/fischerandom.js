import { WHITE, BLACK, DARK, LIGHT } from './brands';
import { King, Queen, Rook, Bishop, Knight, Pawn } from './piece/standard';
import { Point } from './point';
import { Board } from './board';
import { FEN } from './codec/fen';
import { isEven, isOdd, oppositeColor } from './util';
const Die = require('jsdice');

export function fischerandom() {
	const board = new Board();

	randomizeSide(board);
	copySide(board);
	placePawns(board);

	return position(board);
};

export function doubleFischerandom() {
	const board = new Board();

	randomizeSide(board, WHITE);
	randomizeSide(board, BLACK);
	placePawns(board);

	return position(board);
};
// alias for people who don't like Bobby Fischer :)
export const ninesixty = fischerandom;

function randomizeSide(board, color=WHITE) {
	const rank = colorRank(color);
	const place = placeOnEmptySquare.bind(null, rank, board);

	// 1. place the first bishop on the square of octohedron roll:
	const b1 = rollDie('d8');
	board.placePiece(new Bishop({ color }), new Point(b1, rank));

	// 2. place the opposite color bishop on the square of the tetrahedron role:
	const b2 = rollDie('d4');
	const b2Prime = colorClash(b1, b2) ? b2 + 1 : b2;
	board.placePiece(new Bishop({ color }), new Point(b2Prime, rank));

	// 3. place the queen on the square of the cube roll:
	place(new Queen({ color }), rollDie('d6'));

	// 4. place the knights on the quotient and remainders of 1 below the
	//    icosahedron roll diveded by 4:
	const n = rollDie('d20');
	place(new Knight({ color }), Math.floor(n / 4));
	place(new Knight({ color }), n % 4);

	// 5. place the king between the rooks on the remaining 3 squares:
	place(new Rook({ color }), 0);
	place(new King({ color }), 0);
	place(new Rook({ color }), 0);
}

function placePawns(board) {
	for (var j = 0; j < board.files; j++) {
		board.placePiece(new Pawn({ color: WHITE }), new Point(j, 6));
		board.placePiece(new Pawn({ color: BLACK }), new Point(j, 1));
	}
}

function copySide(board, color=BLACK) {
	const rank = colorRank(color);
	const oppRank = colorRank(oppositeColor(color));
	for (var j = 0; j < board.files; j++) {
		const { constructor: Brand }
			= board.getPieceByCoords(new Point(j, oppRank));
		board.placePiece(
			new Brand({ color }),
			new Point(j, rank)
		);
	}
}

function colorRank(color) {
	return color === WHITE ? 7 : 0;
}

function colorClash(a, b) {
	return (
		(isEven(a) && isEven(b)) ||
		(isOdd(a) && isOdd(b))
	);
}

function placeOnEmptySquare(rank, board, piece, n) {
	for(var j = 0, count = 0; j < board.files; j++) {
		var point = new Point(j, rank);
		if (board.getPieceByCoords(point) != null) {
			continue;
		}
		if (n === count++) {
			board.placePiece(piece, point);
		}
	}
}

function rollDie(signature) {
	return new Die(signature).roll().total - 1;
}

function position(board) {
	return FEN.standardPosition.beget({ board });
}
