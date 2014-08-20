import { FEN } from './fen';
import { last } from './util';

export class Line {

	constructor(position=FEN.standardPosition) {
		this.position = position;
		this.ply = [];
	}

	addPly(ply) {
		this.ply.push(ply);
	}

	move(move, note=null) {
		const position = this.position.move(move);
		this.addPly({ position, move, note });
		this.position = position;
		return this;
	}

	annotate(note) {
		if (this.ply.length === 0) {
			throw new Error("no move to annotate");
		}
		last(this.ply).note = note;
		return this;
	}

	get plyLength() {
		return this.ply.length;
	}

	get length() {
		return Math.ceil(this.ply.length / 2);
	}
}
