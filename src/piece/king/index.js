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
	get fenEncoding() {
		return this.isWhite ? 'K' : 'k';
	}
}
