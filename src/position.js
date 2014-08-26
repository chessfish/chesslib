import { WHITE, BLACK, KING, PAWN, LIGHT, DARK } from './brands';
import { Board } from './board';
import { Mobility } from './mobility';
import { Castling } from './castling';
import { EnPassantTarget } from './eptarget';
import { Point } from './point';
import { Promotion } from './promotion';
import { Algebraic } from './algebraic';
import { HalfmoveClock } from './halfmoveclock';
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

export class Position {

	constructor({
		ranks=8,
		files=8,
		activeColor=WHITE,
		castling=null,
		enPassantTarget=null,
		halfmoveClock=null,
		fullmoveCounter=0,
		board=new Board(ranks, files),
	} = {}) {
		this.board = board;
		this.activeColor = activeColor;
		this.castling = castling;
		this.enPassantTarget = enPassantTarget;
		this.halfmoveClock = halfmoveClock;
		this.fullmoveCounter = fullmoveCounter;
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

	*query(selector={}) {
		pieces: for (var piece of this.pieces(selector.brand)) {
			for (var [val, key] of entries(selector)) {
				if (piece[key] !== val) {
					continue pieces;
				}
			}
			yield piece;
		}
	}

	all(selector) {
		return [ ...this.query(selector) ];
	}

	one(selector) {
		for (var i of this.query(selector)) {
			return i;
		}
		return null;
	}

	*checks(
		color=this.activeColor,
		loc=this.pieceCoords(this.one({ brand: KING, color }))
	) {
		for (var enemy of this.query({ color: oppositeColor(color) })) {
			if (enemy.canCapture(this, this.pieceCoords(enemy), loc)) {
				yield enemy;
			}
		}
	}

	*moves(color=this.activeColor) {
		for (var piece of this.query({ color })) {
			for (var move of bounded(this.board, piece.moves(this))) {
				yield { piece, move };
			}
		}
	}

	isCheck(color, loc) {
		for (var _ of this.checks(color, loc)) {
			return true;
		}
		return false;
	}

	isCheckmate() {
		const color = this.activeColor;
		if (!this.isCheck(color)) {
			// it can't be checkmate if it's not even check:
			return false;
		}
		for (let { piece, move } of this.moves()) {
			try {
				if (!this.movePiece(piece, move).isCheck(color)) {
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
		return true;
	}

	is50MoveDraw() {
		return this.halfmoveClock.count >= 50 * 2;
	}

	isCheckmatePossible() {
		var pieces = this.all();
		var kings = pieces.filter(piece => piece.brand === KING);
		var nonKings = pieces.filter(piece => piece.brand !== KING);
		if (
			// There is an illegal number of Kings on the board:
			(kings.length !== 2) ||
			// Bare kings:
			(pieces.length === 2) ||
			// King + Knight vs. King
			(pieces.length === 3 && nonKings[0].brand === KNIGHT) ||
			(
				// same-colored bishop hijinx:
				nonKings.every(({ brand }) => brand === BISHOP) &&
				(
					nonKings.every(piece =>
						squareColor(position.pieceCoords(piece)) === LIGHT) ||
					nonKings.every(piece =>
						squareColor(position.pieceCoords(piece)) === DARK)
				)
			)
		) {
			return false;
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

		const { capturePiece, captureTarget, isEnPassant }
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
			halfmoveClock: HalfmoveClock.analyze(this, piece, target),
			fullmoveCounter: (
				// Increment the fullmove counter for each Black move:
				this.activeColor === BLACK ?
				this.fullmoveCounter + 1 :
				this.fullmoveCounter
			),
			board: this.board.map((p, square) => {
				if (// it is...
					// ...the square vacated by the piece:
					(p === piece) ||
					// ...a pawn just captured en passant:
					(isEnPassant && square.equal(captureTarget)) ||
					// ...the square vacated by the rook during castling:
					(p && p === castling.rook)
				) {
					return null;
				}
				if (castling.square && square.equal(castling.square)) {
					// it is the target square for the rook during castling.
					return castling.rook;
				}
				if (square.equal(target)) {
					// it is the target square for the piece
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

	move(notation) {
		const { piece, target, promotionPrize } = Algebraic.parse(notation, this);
		const position = this.movePiece(piece, target);
		if (promotionPrize != null) {
			return position.promote(promotionPrize);
		}
		return position;
	}
}
