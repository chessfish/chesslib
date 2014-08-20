import { Line } from './line'

export class Game extends Line {

	constructor() {
		super();
		this.tags = Object.create(null);
	}

	addTag(key, value) {
		this.tags[key] = value;
	}

	addResult(result) {
		this.result;
	}
}
