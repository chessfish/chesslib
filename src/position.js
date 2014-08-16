import { WHITE, KING, PAWN } from './brands';
import { Board } from './board'
import { Mobility } from './piece/mobility';
import { Castling } from './piece/king/castling';
import { EnPassantTarget } from './piece/pawn/eptarget'
import { Point } from './point';
import { MobilityError, CheckError } from './error'
import {
	entries,
	identity,
	squareName,
	squareCoords,
	oppositeColor,
	bounded,
} from './util';

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
		this.board = new Board(ranks, files, board);
		this.activeColor = activeColor || WHITE;
		this.castling = new Castling(castling);
		this.enPassantTarget = new EnPassantTarget(enPassantTarget);
		this.halfmoveClock = halfmoveClock;
		this.fullmoveClock = fullmoveClock;
	}

	get files() {
		return this.board.files;
	}

	get ranks() {
		return this.board.ranks;
	}

	getPieces(brand) {
		return this.board.getPieces(brand);
	}

	getPiece(squareName) {
		return this.getPieceByCoords(squareCoords(squareName));
	}

	getCapturablePiece(squareNameP, capturer) {
		if (capturer.brand !== PAWN ||
			!this.enPassantTarget.equal(squareNameP)) {
			return [this.getPiece(squareNameP), squareNameP, false];
		}
		const coords = squareCoords(squareNameP);
		if (coords.equal(this.enPassantTarget)) {
			const captureSquare = coords.sum(new Point(0, -capturer.reach));
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
		return this.board.getPieceCoords(piece);
	}

	getPieceByCoords(point, rotated=false) {
		return this.board.getPieceByCoords(point, rotated);
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

	*checks(
		color=this.activeColor,
		loc=this.getPieceCoords(this.query({ brand: KING, color }))
	) {
		for (var enemy of this.queryAll({ color: oppositeColor(color) })) {
			if (enemy.canCapture(this, this.getPieceCoords(enemy), loc)) {
				yield enemy;
			}
		}
	}

	isCheck(color, loc) {
		for (var _ of this.checks(color, loc)) {
			return true;
		}
		return false;
	}

	isCheckmate(color=this.activeColor) {
		if (!this.isCheck(color)) {
			// it can't be checkmate if it's not even check:
			return false;
		}
		for (var ally of this.queryAll({ color })) {
			for (var move of bounded(this.board, ally.moves(this))) {
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
			= this.getCapturablePiece(targetSquare, piece);

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
			activeColor: oppositeColor(this.activeColor),
			castling: this.castling,
			enPassantTarget: EnPassantTarget.get(this, piece, targetSquare),
			halfmoveClock: this.halfmoveClock + 1,
			fullmoveClock: this.fullmoveClock,
			board: this.board.map((p, i, j) => {
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

function ourError(err) {
	return err instanceof MobilityError || err instanceof CheckError;
}
