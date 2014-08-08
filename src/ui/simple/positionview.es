import { h } from 'mercury';

export const render = (position) =>
	h('div.board', ranks().map((r, i) =>
		h(`div.rank.r${r}`, files().map((f, j) =>
			h(`div.square.${f}${r}`, renderPiece(position.getPiece(i, j)))))));

function renderPiece(piece) {
	if (piece == null) {
		return null;
	}
	return h(`div.piece.${piece.fenEncoding}`);
}

function ranks() {
	return '12345678'.split('');
}

function files() {
	return 'abcdefgh'.split('');
}
