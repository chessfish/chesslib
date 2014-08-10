import { WHITE, BLACK } from './constants'

export class Piece {
	constructor({ color } = {}) {
		this.color = color;
	}

	toString() {
		return this.constructor.name;
	}

	get isWhite() {
		return this.color === WHITE;
	}

	get isBlack() {
		return this.color === BLACK;
	}
}