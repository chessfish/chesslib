import { h } from 'mercury';

const ranks = '12345678'.split('');
const files = 'abcdefgh'.split('');

export const render = (position) =>
	h('div.board', ranks.map((r, i) =>
		h(`div.rank.r${r}`, files.map((f, j) =>
			h(`div.square.${f}${r}`, renderPiece(position.getPiece(i, j)))))));

function renderPiece(piece) {
	if (piece == null) {
		return null;
	}
	return h(`div.piece.${piece.fenEncoding}`);
}
