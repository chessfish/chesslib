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
import {
	entries,
	identity,
	squareName,
	squareCoords,
	oppositeColor,
} from './util';
import { Mobility } from './piece/mobility';
import { EnPassantTarget } from './piece/pawn/eptarget'
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
		board=null,
	} = {}) {
		this.ranks = ranks;
		this.files = files;
		this.board = createBoard(ranks, files);
		this.activeColor = activeColor || WHITE;
		this.castling = castling;
		this.enPassantTarget = new EnPassantTarget(enPassantTarget);
		this.halfmoveClock = halfmoveClock;
		this.fullmoveClock = fullmoveClock;
		this.pieces = new Set();
		this.pieces[KING] = new Set();
		this.pieces[QUEEN] = new Set();
		this.pieces[KNIGHT] = new Set();
		this.pieces[BISHOP] = new Set();
		this.pieces[ROOK] = new Set();
		this.pieces[PAWN] = new Set();
		if (board) {
			decorateBoard(this, board);
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

	getCapturablePiece(squareNameP, capturerBrand=null) {
		if (capturerBrand !== PAWN || !this.enPassantTarget.equal(squareNameP)) {
			return [this.getPiece(squareNameP), squareNameP, false];
		}
		const coords = squareCoords(squareNameP);
		if (coords.equal(this.enPassantTarget)) {
			const captureSquare = coords.sum(new Point(0, coords.y === 2 ? 1 : -1));
			const capturedPiece = this.getPieceByCoords(captureSquare);
			return [
				capturedPiece,
				capturedPiece && squareName(captureSquare),
				!!capturedPiece
			];
		}
		return [null, null, false];
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

	isCheck(color) {
		const king = this.query({ brand: KING, color });
		const enemies = this.queryAll({ color: oppositeColor(color) });

		for (var enemy of enemies) {
			if (enemy.canCapture(this,
				this.getPieceCoords(enemy),
				this.getPieceCoords(king))) {
				return true;
			}
		}
		return false;
	}

	move(piece, targetSquare) {
		if (targetSquare == null) {
			throw new Error("target square is null");
		}

		const [targetPiece, captureSquare, wasEnPassant]
			= this.getCapturablePiece(targetSquare, piece.brand);

		if (!Mobility.isLegal({
			position: this,
			piece,
			targetSquare,
			targetPiece,
		})) {
			return this;
		}
		const position = new Position({
			ranks: this.ranks,
			files: this.files,
			// swap the active color:
			activeColor: oppositeColor(this.activeColor),
			castling: this.castling,
			enPassantTarget: EnPassantTarget.get(this, piece, targetSquare),
			halfmoveClock: this.halfmoveClock + 1,
			fullmoveClock: this.fullmoveClock,
			board: this.map((p, i, j) => {
				if (p === piece) {
					return null;
				}
				const sq = new Point(j, i);
				if (wasEnPassant && sq.equal(squareCoords(captureSquare))) {
					// it was just captured en passant.
					return null;
				}
				if (squareName(sq) === targetSquare) {
					return piece;
				}
				return p;
			}),
		});
		if (position.isCheck(this.activeColor)) {
			// this move is illegal, because it would put the king in check!
			return this;
		}
		return position;
	}
}

function createBoard(ranks=8, files=8) {
	// ugly imperative way to create a board:
	const board = [];
	for (var i = 0; i < ranks; i++) {
		const rank = [];
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

function decorateBoard(position, board) {
	board.forEach((rank, i) => {
		rank.forEach((file, j) => {
			const piece = board[i][j];
			if (piece != null) {
				placePiece(position, piece, i, j);
			}
		});
	});
}
