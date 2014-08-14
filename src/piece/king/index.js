import { KING } from '../../brands'
import { Piece } from '../piece'
import { Royal } from '../mobility/royal'

export class King extends Piece {
	constructor(options) {
		super(options);
		Royal.call(this);
	}
	get brand() {
		return KING;
	}
	get unicode() {
		return this.isWhite ? '♔' : '♚';
	}
	get fenEncoding() {
		return this.isWhite ? 'K' : 'k';
	}
}
