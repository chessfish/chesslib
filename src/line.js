import { FEN } from './fen'

export class Line {
	constructor(position=FEN.standardPosition) {
		this.position = position;
		this.ply = [];
	}

	addPly(ply) {
		this.ply.push(ply);
	}

	move(move) {
		const position = this.position.move(move);
		this.addPly({ position, move });
		this.position = position;
		return this;
	}

	get plyLength() {
		return this.ply.length;
	}

	get length() {
		return Math.floor(this.ply.length / 2);
	}
}

function last(arr) {
	return arr[arr.length - 1];
}