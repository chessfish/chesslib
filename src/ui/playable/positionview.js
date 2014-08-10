import { h, input, event, struct, value } from 'mercury';

const dragEvent = require('./drag-handler.js');

const ranks = '87654321'.split('');
const files = 'abcdefgh'.split('');

export function playable(position) {

	const state = struct({
		position: value(position),
		draggingPiece: value(null),
		registeredPiece: value(null),
		offset: value(null),
		targetSquare: value(null),
		events: input(['dragPiece', 'registerPiece', 'dropPiece']),
	});

	state.events.dragPiece(({ piece, x, y }) => {
		state.draggingPiece.set(piece);
		state.offset.set({ x, y });
	});

	state.events.registerPiece(({ piece }) => {
		state.registeredPiece.set(piece);
	});

	state.events.dropPiece(({ piece }) => {
		state.draggingPiece.set(null);
		state.registeredPiece.set(null);
	});

	return state;
}

playable.render = (state) =>
	h('div.board', ranks.map((r, i) =>
		h(`div.rank.r${r}`, files.map((f, j) =>
			h(`div.square.${f}${r}`, renderPiece(state, i, j))))));

function renderPiece(state, rank, file) {
	const piece = state.position.getPiece(rank, file);
	if (piece == null) {
		return null;
	}
	const options = { piece };
	return h(`div.piece.${piece.fenEncoding}`, {
		'ev-mousedown': dragEvent(state.events.dragPiece, options),
		'ev-click': event(state.events.registerPiece, options),
		'ev-mouseup': event(state.events.dropPiece, options),
		'style': (
			piece === state.draggingPiece ? {
				'top': state.offset.y + 'px',
				'left': state.offset.x + 'px',
				'z-index': 2,
			} : {
				'z-index': 1,
			}
		),
	});
}


