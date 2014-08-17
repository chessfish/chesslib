import { WHITE, KING, PAWN } from './brands';
import { Board } from './board'
import { Mobility } from './piece/mobility';
import { Castling } from './castling';
import { EnPassantTarget } from './eptarget'
import { Point } from './point';
import { Promotion } from './promotion'
import {
	entries,
	identity,
	squareName,
	squareCoords,
	oppositeColor,
	bounded,
} from './util';
import {
	ChessError,
	MobilityError,
	CheckError,
	PromotionError
} from './error'

const assign = require('lodash.assign');
const contains = require('lodash.contains');

export class Position {

	constructor({
		ranks=8,
		files=8,
		activeColor=WHITE,
		castling=null,
		enPassantTarget=null,
		halfmoveClock=0,
		fullmoveClock=0,
		board=new Board(ranks, files),
	} = {}) {
		this.board = board;
		this.activeColor = activeColor;
		this.castling = castling;
		this.enPassantTarget = enPassantTarget;
		this.halfmoveClock = halfmoveClock;
		this.fullmoveClock = fullmoveClock;
		this.promotionSquare = Promotion.square(this);
	}

	beget(overrides) {
		return new Position(assign({}, this, overrides));
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
					if (!this.movePiece(ally, move).isCheck(color)) {
						return false;
					}
				}
				catch (err) {
					if (err instanceof ChessError) {
						continue;
					}
					throw err;
				}
			}
		}
		return true;
	}

	tryMovePiece(piece, target) {
		try {
			return this.movePiece(piece, target);
		}
		catch (err) {
			if (err instanceof ChessError) {
				return this;
			}
			throw err;
		}
	}

	movePiece(piece, target) {
		if (target == null || piece == null) {
			throw new Error("Argument error");
		}

		const { capturePiece, captureTarget, wasEnPassant }
			= EnPassantTarget.capturablePiece(this, piece, target);

		if (!Mobility.isLegal({
			position: this,
			piece,
			target,
			capturePiece,
		})) {
			throw new MobilityError();
		}

		const castling = Castling.analyze(this, piece, target);

		const position = this.beget({
			activeColor: oppositeColor(this.activeColor),
			castling,
			enPassantTarget: EnPassantTarget.analyze(this, piece, target),
			halfmoveClock: this.halfmoveClock + 1,
			fullmoveClock: this.fullmoveClock,
			board: this.board.map((p, square) => {
				if (p === piece) {
					// is it the square being vacated by the piece.
					return null;
				}
				if (wasEnPassant && square.equal(captureTarget)) {
					// it was just captured en passant.
					return null;
				}
				if (p && p === castling.rook) {
					// it is the rook that is being moved during castling.
					return null;
				}
				if (castling.square && square.equal(castling.square)) {
					// it is the square that the rook is being moved to during castling.
					return castling.rook;
				}
				if (square.equal(target)) {
					// it is the square that the piece is being moved to.
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

	promote(prize) {
		if (this.promotionSquare == null) {
			throw new PromotionError();
		}
		return this.beget({
			board: this.board.map((p, square) =>
				// replace the promoted pawn with the new piece:
				square.equal(this.promotionSquare) ? prize : p),
			// that we we've promoted, unset the promotion square.
			promotionSquare: null,
		});
	}
}
