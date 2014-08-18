export class ChessError extends Error {
	constructor(message, position) {
		Error.call(this);
		this.name = this.constructor.name;
		this.message = message != null ? message : this.name;
		this.position = position;
	}
}

export class MobilityError extends ChessError {}

export class CheckError extends ChessError {}

export class PromotionError extends ChessError {}

export class ResultError extends ChessError {

	// constructor() {
	// 	super()
	// }
}

export class AmbiguityError extends ChessError {
	constructor(rejection, candidates) {
		super(`Ambiguous notation: ${rejection}`)
		this.rejection = rejection;
		this.candidates = candidates;
	}
}
