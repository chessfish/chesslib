export class Cursor {
	constructor(collection=[]) {
		this.collection = collection;
	}

	get length() {
		return this.collection.length;
	}

	push(...items) {
		this.collection.push(...items);
	}

	first() {
		return this.collection[0];
	}

	last() {
		return this.collection[this.collection.length - 1];
	}

	array() {
		return [ ...this.collection ];
	}

	canAccess(algebraic) {
		console.warn(new Error('Cursor#canAccess is not implemented!'));
		return true;
	}
}
