import {
	WHITE,
	BLACK,
	KING,
	QUEEN,
	KNIGHT,
	BISHOP,
	ROOK,
	PAWN,
} from './constants';
import { Cursor } from './cursor';
import { entries, identity } from './util';

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
		this.board = this.createBoard(ranks, files);
		this.activeColor = activeColor;
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
		this.arr2d = arr2d;
	}

	createBoard(ranks=8, files=8) {
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

	placePiece(piece, rank, file) {
		if (this.board[rank][file] != null) {
			throw new Error(this.squareName(rank, file) + " occupied!")
		}
		this.board[rank][file] = piece;
		this.pieces.add(piece);
		this.pieces[piece.brand].add(piece);
	}

	squareName(rank, file) {
		return `${rankName(rank)}{fileName(file)}`
	}

	rankName(rank) {
		return 'abcdefgh'.charAt(rank)
	}

	fileName(file) {
		return "" + (file + 1);
	}

	rankIndex(rankName) {
		return 'abcdefgh'.indexOf(rankName);
	}

	fileIndex(fileName) {
		return Number(fileName) - 1;
	}

	map(fn) {
		return this.board.map((rank) => rank.map((piece) => fn(piece)));
	}

	getPieces(brand) {
		return brand == null ? this.pieces : this.pieces[brand];
	}

	getPiece(rank, file) {
		return this.board[rank][file];
	}

	queryAll(selector={}) {
		const collection = this.getPieces(selector.brand);
		const results = new Cursor();
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

	set arr2d(arr2d) {
		arr2d.forEach((rank, i) => {
			rank.forEach((file, j) => {
				const piece = arr2d[i][j];
				if (piece != null) {
					this.placePiece(piece, i, j);
				}
			});
		});
	}

	get arr2d() {
		return this.map(identity);
	}

	get readableText() {
		return this.
			map((piece) => {
				if (piece == null) {
					return ' ';
				}
				return piece.unicode;
			}).
			map((rank) => rank.join('')).
			join('\n')
		;
	}
}