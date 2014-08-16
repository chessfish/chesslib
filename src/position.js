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

const assign = require('lodash.assign');

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

	pieces(brand) {
		return this.board.getPieces(brand);
	}

	piece(squareName) {
		return this.pieceByCoords(squareCoords(squareName));
	}

	pieceCoords(piece) {
		return this.board.getPieceCoords(piece);
	}

	pieceByCoords(point, rotated=false) {
		return this.board.getPieceByCoords(point, rotated);
	}

	*queryAll(selector={}) {
		pieces: for (var piece of this.pieces(selector.brand)) {
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
		loc=this.pieceCoords(this.query({ brand: KING, color }))
	) {
		for (var enemy of this.queryAll({ color: oppositeColor(color) })) {
			if (enemy.canCapture(this, this.pieceCoords(enemy), loc)) {
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

	capturablePiece(squareNameP, capturer) {
		if (capturer.brand !== PAWN ||
			!this.enPassantTarget.equal(squareNameP)) {
			return [this.piece(squareNameP), squareNameP, false];
		}
		const coords = squareCoords(squareNameP);
		if (coords.equal(this.enPassantTarget)) {
			const captureSquare = coords.sum(new Point(0, -capturer.reach));
			const capturedPiece = this.pieceByCoords(captureSquare);
			return [
				capturedPiece,
				capturedPiece && squareName(captureSquare),
				!!capturedPiece
			];
		}
		return [null, null, false];
	}

	move(piece, targetSquare) {
		if (targetSquare == null) {
			throw new Error("target square is null");
		}

		const [targetPiece, captureSquare, wasEnPassant]
			= this.capturablePiece(targetSquare, piece);

		if (!Mobility.isLegal({
			position: this,
			piece,
			targetSquare,
			targetPiece,
		})) {
			throw new MobilityError();
		}

		const castling = Castling.analyze(this, piece, squareCoords(targetSquare));

		const position = this.beget({
			activeColor: oppositeColor(this.activeColor),
			castling,
			enPassantTarget: EnPassantTarget.analyze(this, piece, targetSquare),
			halfmoveClock: this.halfmoveClock + 1,
			fullmoveClock: this.fullmoveClock,
			board: this.board.map((p, square) => {
				// do stuff with castling information.
				if (p === piece) {
					return null;
				}
				if (wasEnPassant && square.equal(squareCoords(captureSquare))) {
					// it was just captured en passant.
					return null;
				}
				if (squareName(square) === targetSquare) {
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

	beget(overrides) {
		return new Position(assign({}, this, overrides));
	}
}

function ourError(err) {
	return err instanceof MobilityError || err instanceof CheckError;
}
