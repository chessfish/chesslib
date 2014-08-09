import { h, input, event, struct, value } from 'mercury';

const dragEvent = require('../drag-handler.js');

const ranks = '87654321'.split('');
const files = 'abcdefgh'.split('');

export const playable = (position) => {

	const state = struct({
		position: value(position),
		activePiece: value(null),
		offset: value(null),
		events: input(['dragPiece'])
	});

	state.events.dragPiece(({ piece, x, y }) => {
		state.activePiece.set(piece);
		state.offset.set({ x, y });
	});

	return state;
};

playable.render = (state) =>
	h('div.board', ranks.map((r, i) =>
		h(`div.rank.r${r}`, files.map((f, j) =>
			h(`div.square.${f}${r}`, renderPiece(state, i, j))))));

function renderPiece(state, rank, file) {
	const piece = state.position.getPiece(rank, file);
	if (piece == null) {
		return null;
	}
	return h(`div.piece.${piece.fenEncoding}`, {
		'ev-mousedown': dragEvent(state.events.dragPiece, { piece }),
		'style': (
			piece === state.activePiece ? {
				'top': state.offset.y + 'px',
				'left': state.offset.x + 'px',
				'z-index': 2,
			} : {
				'z-index': 1
			}
		),
	});
}


