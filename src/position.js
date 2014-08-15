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
	bounded,
} from './util';
import { Mobility } from './piece/mobility';
import { Castling } from './piece/king/castling';
import { EnPassantTarget } from './piece/pawn/eptarget'
import { Point } from './point';
import { MobilityError, CheckError } from './error'
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
		this.castling = new Castling(castling);
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

	getPieceCoords(piece) {
		for (var i = 0, iLen = this.board.length; i < iLen; i++) {
			const rank = this.board[i];
			for (var j = 0, jLen = rank.length; j < jLen; j++) {
				const p = rank[j];
				if (p === piece) {
					return new Point(j, i);
				}
			}
		}
		return null;
	}

	getPieceByCoords({ x, y }) {
		const rank = this.board[y];
		return rank == null ? null : rank[x];
	}

	*queryAll(selector={}) {
		pieces: for (var piece of this.getPieces(selector.brand)) {
			for (var [val, key] of entries(selector)) {
				if (piece[key] !== val) {
					continue pieces;
				}
			}
			yield piece;
		}
	}

	queryArray(selector) {
		return [ ...this.queryAll(selector) ];
	}

	query(selector) {
		for (var i of this.queryAll(selector)) {
			return i;
		}
		return null;
	}

	isCheck(
		color=this.activeColor,
		loc=this.getPieceCoords(this.query({ brand: KING, color }))
	) {
		for (var enemy of this.queryAll({ color: oppositeColor(color) })) {
			if (enemy.canCapture(this, this.getPieceCoords(enemy), loc)) {
				return true;
			}
		}
		return false;
	}

	isCheckmate(color=this.activeColor) {
		if (!this.isCheck(color)) {
			// it can't be checkmate if it's not even check:
			return false;
		}
		for (var ally of this.queryAll({ color })) {
			for (var move of bounded(this, ally.moves(this))) {
				try {
					if (!this.move(ally, squareName(move)).isCheck(color)) {
						return false;
					}
				}
				catch (err) {
					if (ourError(err)) {
						continue;
					}
					throw err;
				}
			}
		}
		return true;
	}

	tryMove(piece, targetSquare) {
		try {
			return this.move(piece, targetSquare);
		}
		catch (err) {
			if (ourError(err)) {
				return this;
			}
			throw err;
		}
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
			throw new MobilityError();
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
			throw new CheckError();
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

function ourError(err) {
	return err instanceof MobilityError || err instanceof CheckError;
}
