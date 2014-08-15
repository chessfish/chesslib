import { KING, QUEEN, KNIGHT, BISHOP, ROOK, PAWN } from './brands';
import { Point } from './point'

export class Board {

	constructor(files=8, ranks=8, board) {
		this.files = files;
		this.ranks = ranks;
		this.storage = createStorage(files, ranks);
		this.pieces = new Set();
		this.pieces[KING] = new Set();
		this.pieces[QUEEN] = new Set();
		this.pieces[KNIGHT] = new Set();
		this.pieces[BISHOP] = new Set();
		this.pieces[ROOK] = new Set();
		this.pieces[PAWN] = new Set();
		if (board) {
			this.decorate(board);
		}
	}

	map(fn) {
		return this.storage.map((rank, i) =>
			rank.map((piece, j) => fn(piece, i, j)));
	}

	getPieces(brand) {
		return brand == null ? this.pieces : this.pieces[brand];
	}

	getPieceCoords(piece) {
		for (var i = 0, iLen = this.storage.length; i < iLen; i++) {
			const rank = this.storage[i];
			for (var j = 0, jLen = rank.length; j < jLen; j++) {
				const p = rank[j];
				if (p === piece) {
					return new Point(j, i);
				}
			}
		}
		return null;
	}

	getPieceByCoords({ x, y }/*, rotated=false*/) {
		const rank = this.storage[y];
		return rank == null ? null : rank[x];
	}

	placePiece(piece, file, rank) {
		this.storage[rank][file] = piece;
		this.pieces.add(piece);
		this.pieces[piece.brand].add(piece);
	}

	decorate(board) {
		board.forEach((rank, i) => {
			rank.forEach((file, j) => {
				const piece = board[i][j];
				if (piece != null) {
					this.placePiece(piece, j, i);
				}
			});
		});
	}
}

function createStorage(ranks=8, files=8) {
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
