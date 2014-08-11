import {
	WHITE,
	BLACK,
	KING,
	QUEEN,
	KNIGHT,
	BISHOP,
	ROOK,
	PAWN,
} from './brands';
import { entries, identity, squareName, squareCoords } from './util';
import { Mobility } from './piece/mobility';
import { Point } from './point';

// MODULE
export class Position {

	constructor({
		ranks=8,
		files=8,
		activeColor=WHITE,
		castling=true,
		enPassantTarget=null,
		halfmoveClock=0,
		fullmoveClock=0,
		arr2d=null,
	} = {}) {
		this.ranks = ranks;
		this.files = files;
		this.board = createBoard(ranks, files);
		this.activeColor = activeColor || WHITE;
		this.castling = castling;
		this.enPassantTarget = enPassantTarget;
		this.halfmoveClock = halfmoveClock;
		this.fullmoveClock = fullmoveClock;
		this.pieces = new Set();
		this.pieces[KING] = new Set();
		this.pieces[QUEEN] = new Set();
		this.pieces[KNIGHT] = new Set();
		this.pieces[BISHOP] = new Set();
		this.pieces[ROOK] = new Set();
		this.pieces[PAWN] = new Set();
		if (arr2d) {
			convertArr2d(this, arr2d);
		}
	}

	map(fn) {
		return this.board.map((rank, i) =>
			rank.map((piece, j) => fn(piece, i, j)));
	}

	getPieces(brand) {
		return brand == null ? this.pieces : this.pieces[brand];
	}

	getPiece(squareName) {
		return this.getPieceByCoords(squareCoords(squareName));
	}

	getPieceSquare(piece) {
		const coords = this.getPieceCoords(piece);
		return coords == null ? null : squareName(coords);
	}

	getPieceByCoords({ x, y }) {
		const rank = this.board[y];
		return rank == null ? null : rank[x];
	}

	getPieceCoords(piece) {
		for (var i = 0; i < this.board.length; i++) {
			var rank = this.board[i];
			for (var j = 0; j < rank.length; j++) {
				var p = rank[j];
				if (p === piece) {
					return new Point(j, i);
				}
			}
		}
		return null;
	}

	queryAll(selector={}) {
		const collection = this.getPieces(selector.brand);
		const results = [];
		pieces: for (var piece of collection) {
			for (var [val, key] of entries(selector)) {
				if (piece[key] !== val) {
					continue pieces;
				}
			}
			results.push(piece);
		}
		return results;
	}

	query(selector={}) {
		const collection = this.getPieces(selector.brand);
		pieces: for (var piece of collection) {
			for (var [val, key] of entries(selector)) {
				if (piece[key] !== val) {
					continue pieces;
				}
			}
			return piece;
		}
		return null;
	}

	move(piece, targetSquare) {
		if (targetSquare == null) {
			throw new Error("target square is null");
		}
		if (!Mobility.isLegal({ position: this, piece, targetSquare })) {
			return this;
		}
		return new Position({
			ranks: this.ranks,
			files: this.files,
			// swap the active color:
			activeColor: this.activeColor === WHITE ? BLACK : WHITE,
			castling: this.castling,
			enPassantTarget: null,
			halfmoveClock: this.halfmoveClock + 1,
			fullmoveClock: this.fullmoveClock,
			arr2d: this.map((p, i, j) => {
				if (p === piece) {
					return null;
				}
				if (squareName(new Point(j, i)) === targetSquare) {
					return piece;
				}
				return p;
			}),
		})
	}
}

function createBoard(ranks=8, files=8) {
	// ugly imperative way to create a board:
	const board = [];
	for (var i = 0; i < ranks; i++) {
		var rank = [];
		for (var j = 0; j < files; j++) {
			rank.push(null);
		}
		board.push(rank);
	}
	return board;
}

function placePiece(position, piece, i, j) {
	position.board[i][j] = piece;
	position.pieces.add(piece);
	position.pieces[piece.brand].add(piece);
}

function convertArr2d(position, arr2d) {
	arr2d.forEach((rank, i) => {
		rank.forEach((file, j) => {
			const piece = arr2d[i][j];
			if (piece != null) {
				placePiece(position, piece, i, j);
			}
		});
	});
}
